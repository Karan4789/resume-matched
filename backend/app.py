import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai
import json
from PyPDF2 import PdfReader
from io import BytesIO
import logging
from models import ResumeAnalysis, JobPosting
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:8080"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Configure Google GenAI
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-2.0-flash-lite')

def calculate_ats_score(resume_text, job_description):
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([resume_text, job_description])
    similarity = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]
    return round(similarity * 100)

@app.route('/api/analyze-resume', methods=['POST'])
def analyze_resume():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
                
        resume_text = data.get('resume_text', '').strip()
        job_description = data.get('job_description', '').strip()
        candidate_name = data.get('candidate_name', 'Anonymous')
        candidate_email = data.get('candidate_email', '')
        role = data.get('role', 'Not Specified')
        
        logger.debug(f"Resume length: {len(resume_text)}")
        logger.debug(f"Job description length: {len(job_description)}")

        if not resume_text or not job_description:
            return jsonify({'error': 'Missing resume text or job description'}), 400

        prompt = f"""Analyze this resume for a software development role. Provide a structured analysis in JSON format:

Job Description:
{job_description}

Resume Text:
{resume_text}

Focus on:
1. Technical skills (programming languages, frameworks, tools)
2. Relevant experience and projects
3. Education and certifications
4. Soft skills
5. Overall match for the position

Respond strictly in this JSON format:
{{
    "extracted_skills": ["list", "of", "all", "technical", "and", "soft", "skills"],
    "required_skills": ["skills", "from", "job", "description"],
    "matched_skills": ["matching", "skills"],
    "missing_skills": ["missing", "required", "skills"],
    "match_score": <0-100>,
    "ats_score": <0-100>,
    "feedback": "Detailed feedback with specific improvements"
}}"""

        logger.debug("Sending request to Gemini")
        response = model.generate_content(prompt)
        logger.debug(f"Received response from Gemini: {response.text[:100]}...")

        try:
            cleaned_text = response.text.strip()
            # Remove any markdown formatting
            if '```json' in cleaned_text:
                cleaned_text = cleaned_text.split('```json')[1].split('```')[0].strip()
            elif '```' in cleaned_text:
                cleaned_text = cleaned_text.split('```')[1].strip()
                
            result = json.loads(cleaned_text)
            
            # Validate response structure
            required_fields = ['extracted_skills', 'required_skills', 'matched_skills', 
                             'missing_skills', 'match_score', 'ats_score', 'feedback']
            missing_fields = [field for field in required_fields if field not in result]
            
            if missing_fields:
                logger.error(f"Missing fields in response: {missing_fields}")
                raise ValueError(f"Missing required fields: {', '.join(missing_fields)}")
            
            # Calculate ATS score
            result['ats_score'] = calculate_ats_score(resume_text, job_description)
            
            # Calculate match score based on skills
            matched_skills_count = len(result['matched_skills'])
            required_skills_count = len(result['required_skills'])
            result['match_score'] = round((matched_skills_count / required_skills_count * 100) if required_skills_count > 0 else 0)

            # Store in SQLite
            analysis = ResumeAnalysis.save_analysis(
                resume_text=resume_text,
                job_description=job_description,
                analysis_result=result,
                candidate_name=candidate_name,
                candidate_email=candidate_email,
                role=role
            )
            
            logger.debug("Successfully processed response")
            return jsonify({
                **result,
                'id': analysis['id'],
                'candidate_name': candidate_name,
                'candidate_email': candidate_email,
                'role': role
            })
            
        except json.JSONDecodeError as e:
            logger.error(f"JSON Parse Error: {str(e)}\nResponse: {response.text}")
            return jsonify({
                'error': 'Failed to parse AI response',
                'details': str(e),
                'response': response.text
            }), 500
            
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}", exc_info=True)
        return jsonify({
            'error': 'Analysis failed',
            'details': str(e)
        }), 500

@app.route('/api/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    try:
        # Get recent submissions
        recent_submissions = ResumeAnalysis.get_recent_submissions()
        
        # Get aggregate stats
        stats = ResumeAnalysis.get_stats()
        
        # Process missing skills
        missing_skills = stats['missing_skills']
        skill_counts = {}
        for skill in missing_skills:
            if isinstance(skill, str):  # Make sure skill is a string
                skill_counts[skill] = skill_counts.get(skill, 0) + 1
        
        common_missing_skills = [
            {'skill': skill, 'count': count}
            for skill, count in sorted(skill_counts.items(), key=lambda x: x[1], reverse=True)[:5]
        ]

        return jsonify({
            'recent_submissions': recent_submissions,
            'stats': {
                'avg_match_score': stats['avg_match_score'],
                'avg_ats_score': stats['avg_ats_score'],
                'total_submissions': stats['total_submissions'],
                'common_missing_skills': common_missing_skills
            }
        })
    except Exception as e:
        logger.error(f"Dashboard stats error: {str(e)}", exc_info=True)
        return jsonify({
            'error': str(e)
        }), 500

@app.route('/api/dashboard/overview', methods=['GET'])
def get_dashboard_overview():
    try:
        # Get dashboard stats (total candidates, jobs, avg match score)
        dashboard_stats = ResumeAnalysis.get_dashboard_stats()
        
        # Get candidate details
        candidates = ResumeAnalysis.get_candidate_details()

        return jsonify({
            'overview': {
                'total_candidates': dashboard_stats['total_candidates'],
                'total_jobs': dashboard_stats['total_job_postings'],
                'avg_match_score': dashboard_stats['avg_match_score']
            },
            'recent_candidates': candidates
        })

    except Exception as e:
        logger.error(f"Dashboard overview error: {str(e)}", exc_info=True)
        return jsonify({'error': 'Failed to fetch dashboard overview'}), 500

@app.route('/api/job-postings', methods=['OPTIONS'])
def handle_options():
    return '', 204

@app.route('/api/job-postings', methods=['POST'])
def create_job_posting():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        required_fields = ['title', 'company', 'department', 'location', 
                         'description', 'requirements', 'skills']
        
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({'error': f'Missing required fields: {", ".join(missing_fields)}'}), 400

        # Add error handling for invalid JSON in requirements/skills
        try:
            if isinstance(data['requirements'], str):
                data['requirements'] = data['requirements'].split(',')
            if isinstance(data['skills'], str):
                data['skills'] = data['skills'].split(',')
        except Exception as e:
            return jsonify({'error': 'Invalid requirements or skills format'}), 400
        
        job_id = JobPosting.create_job_posting(data)
        return jsonify({
            'id': job_id,
            'message': 'Job posting created successfully'
        }), 201
        
    except Exception as e:
        logger.error(f"Create job posting error: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500

@app.route('/api/job-postings', methods=['GET'])
def get_job_postings():
    try:
        job_postings = JobPosting.get_all_job_postings()
        return jsonify(job_postings)
    except Exception as e:
        logger.error(f"Get job postings error: {str(e)}", exc_info=True)
        return jsonify({'error': 'Failed to fetch job postings'}), 500

@app.route('/api/resume/<int:resume_id>', methods=['DELETE'])
def delete_resume(resume_id):
    try:
        success = ResumeAnalysis.delete_resume(resume_id)
        if success:
            return jsonify({'message': 'Resume deleted successfully'}), 200
        return jsonify({'error': 'Resume not found'}), 404
    except Exception as e:
        logger.error(f"Delete resume error: {str(e)}", exc_info=True)
        return jsonify({'error': 'Failed to delete resume'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
