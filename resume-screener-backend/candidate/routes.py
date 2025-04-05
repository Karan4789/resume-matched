
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from utils.text_parser import extract_text_from_pdf, extract_text_from_docx, extract_text_from_txt
from utils.nlp_analyzer import analyze_resume
from models import save_resume, get_user_resumes, save_analysis, get_user_analyses, get_job, get_all_jobs, get_analysis, delete_resume, delete_analysis
import os
import uuid

candidate_bp = Blueprint('candidate', __name__)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']

@candidate_bp.route('/upload', methods=['POST'])
def upload_resume():
    # Hardcoded user_id since we removed authentication
    user_id = "default_user_id"
    
    # Check if job_id is provided
    if 'job_id' not in request.form:
        return jsonify({'error': 'Job ID is required'}), 400
    
    job_id = request.form['job_id']
    
    # Get job from database
    job = get_job(job_id)
    if not job:
        return jsonify({'error': 'Job not found'}), 404
    
    # Check if file is provided
    if 'file' not in request.files and 'text' not in request.form:
        return jsonify({'error': 'Either file or text must be provided'}), 400
    
    resume_text = None
    file_path = None
    original_filename = None
    
    if 'file' in request.files:
        file = request.files['file']
        
        # Check if file is empty
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Check if file extension is allowed
        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not allowed'}), 400
        
        # Generate a unique filename
        filename = str(uuid.uuid4()) + '_' + secure_filename(file.filename)
        file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        original_filename = secure_filename(file.filename)
        
        # Save file
        file.save(file_path)
        
        # Extract text from file
        extension = file.filename.rsplit('.', 1)[1].lower()
        if extension == 'pdf':
            resume_text = extract_text_from_pdf(file_path)
        elif extension == 'docx':
            resume_text = extract_text_from_docx(file_path)
        elif extension == 'txt':
            resume_text = extract_text_from_txt(file_path)
        else:
            # Remove the saved file
            if os.path.exists(file_path):
                os.remove(file_path)
            return jsonify({'error': 'Unsupported file type'}), 400
    else:
        resume_text = request.form['text']
    
    # Save resume to database
    resume_data = {
        'user_id': user_id,
        'job_id': job_id,
        'file_path': file_path,
        'original_filename': original_filename,
        'resume_text': resume_text
    }
    
    resume_id = save_resume(resume_data)
    
    # Analyze resume
    analysis_result = analyze_resume(resume_text, job['description'], job['skills'])
    
    # Save analysis to database
    analysis_data = {
        'user_id': user_id,
        'resume_id': resume_id,
        'job_id': job_id,
        'job_title': job['title'],
        'company': job['company'],
        'match_percentage': analysis_result['match_percentage'],
        'ats_score': analysis_result['ats_score'],
        'matched_skills': analysis_result['matched_skills'],
        'missing_skills': analysis_result['missing_skills'],
        'suggestions': analysis_result['suggestions']
    }
    
    analysis_id = save_analysis(analysis_data)
    
    return jsonify({
        'resume_id': resume_id,
        'analysis_id': analysis_id,
        'message': 'Resume uploaded and analyzed successfully'
    }), 201

@candidate_bp.route('/resumes', methods=['GET'])
def get_resumes():
    # Hardcoded user_id since we removed authentication
    user_id = "default_user_id"
    
    resumes = get_user_resumes(user_id)
    
    return jsonify(resumes), 200

@candidate_bp.route('/analyses', methods=['GET'])
def get_analyses():
    # Hardcoded user_id since we removed authentication
    user_id = "default_user_id"
    
    analyses = get_user_analyses(user_id)
    
    return jsonify(analyses), 200

@candidate_bp.route('/jobs', methods=['GET'])
def get_jobs():
    jobs = get_all_jobs()
    
    return jsonify(jobs), 200

@candidate_bp.route('/analysis/<analysis_id>', methods=['GET'])
def get_analysis_details(analysis_id):
    analysis = get_analysis(analysis_id)
    
    if not analysis:
        return jsonify({'error': 'Analysis not found'}), 404
    
    return jsonify(analysis), 200

@candidate_bp.route('/resume/<resume_id>', methods=['DELETE'])
def delete_resume_endpoint(resume_id):
    # Hardcoded user_id since we removed authentication
    user_id = "default_user_id"
    
    # Get resume from database
    resume = get_user_resumes(user_id)
    if not resume:
        return jsonify({'error': 'Resume not found'}), 404
    
    # Delete file if exists
    if resume['file_path'] and os.path.exists(resume['file_path']):
        os.remove(resume['file_path'])
    
    # Delete resume from database
    delete_resume(resume_id)
    
    # Delete associated analysis from database
    delete_analysis(resume_id)
    
    return jsonify({'message': 'Resume and analysis deleted successfully'}), 200
