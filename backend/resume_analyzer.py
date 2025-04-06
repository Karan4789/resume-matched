import os
from flask import Blueprint, request, jsonify
import google.generativeai as genai
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from models import ResumeAnalysis
import json
import logging

resume_bp = Blueprint('resume', __name__)

# Configure Google GenAI
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-2.0-flash-lite')

def calculate_ats_score(resume_text, job_description):
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([resume_text, job_description])
    similarity = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]
    return round(similarity * 100)

@resume_bp.route('/analyze', methods=['POST'])
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

        if not resume_text or not job_description:
            return jsonify({'error': 'Missing resume text or job description'}), 400

        prompt = f"""Analyze this resume for a software development role:

Job Description:
{job_description}

Resume Text:
{resume_text}

Respond strictly in this JSON format:
{{
    "extracted_skills": ["list", "of", "skills"],
    "required_skills": ["skills", "from", "job", "description"],
    "matched_skills": ["matching", "skills"],
    "missing_skills": ["missing", "required", "skills"],
    "match_score": <0-100>,
    "ats_score": <0-100>,
    "feedback": "Detailed feedback"
}}"""

        response = model.generate_content(prompt)
        cleaned_text = response.text.strip()
        
        if '```json' in cleaned_text:
            cleaned_text = cleaned_text.split('```json')[1].split('```')[0].strip()
        elif '```' in cleaned_text:
            cleaned_text = cleaned_text.split('```')[1].strip()
                
        result = json.loads(cleaned_text)
        result['ats_score'] = calculate_ats_score(resume_text, job_description)

        # Save analysis
        analysis = ResumeAnalysis.save_analysis(
            resume_text=resume_text,
            job_description=job_description,
            analysis_result=result,
            candidate_name=candidate_name,
            candidate_email=candidate_email,
            role=role
        )

        return jsonify({
            **result,
            'id': analysis.get('id'),
            'candidate_name': candidate_name,
            'candidate_email': candidate_email,
            'role': role
        })

    except Exception as e:
        logging.error(f"Resume analysis error: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500
