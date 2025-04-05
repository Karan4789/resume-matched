
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from utils.helpers import role_required
from models import get_candidate_analyses, get_analysis, save_job, get_all_jobs, get_job
import json

hr_bp = Blueprint('hr', __name__)

@hr_bp.route('/candidates', methods=['GET'])
@jwt_required()
@role_required('hr')
def get_candidates():
    # Get query parameters for filtering
    job_id = request.args.get('job_id')
    min_score = request.args.get('min_score')
    max_score = request.args.get('max_score')
    
    # Get all analyses
    analyses = get_candidate_analyses()
    
    # Filter by job_id if specified
    if job_id:
        analyses = [a for a in analyses if a['job_id'] == job_id]
    
    # Filter by match_percentage if specified
    if min_score:
        try:
            min_score = float(min_score)
            analyses = [a for a in analyses if a['match_percentage'] >= min_score]
        except ValueError:
            pass
    
    if max_score:
        try:
            max_score = float(max_score)
            analyses = [a for a in analyses if a['match_percentage'] <= max_score]
        except ValueError:
            pass
    
    # Sort by match_percentage in descending order
    analyses.sort(key=lambda a: a['match_percentage'], reverse=True)
    
    return jsonify(analyses), 200

@hr_bp.route('/candidate/<analysis_id>', methods=['GET'])
@jwt_required()
@role_required('hr')
def get_candidate_analysis(analysis_id):
    analysis = get_analysis(analysis_id)
    
    if not analysis:
        return jsonify({'error': 'Analysis not found'}), 404
    
    return jsonify(analysis), 200

@hr_bp.route('/job', methods=['POST'])
@jwt_required()
@role_required('hr')
def create_job():
    data = request.get_json()
    
    # Validate input
    for field in ['title', 'company', 'description', 'skills']:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    # Create job
    job_id = save_job(data)
    
    return jsonify({
        'job_id': job_id,
        'message': 'Job created successfully'
    }), 201

@hr_bp.route('/jobs', methods=['GET'])
@jwt_required()
@role_required('hr')
def get_jobs():
    jobs = get_all_jobs()
    
    return jsonify(jobs), 200

@hr_bp.route('/job/<job_id>', methods=['GET'])
@jwt_required()
@role_required('hr')
def get_job_by_id(job_id):
    job = get_job(job_id)
    
    if not job:
        return jsonify({'error': 'Job not found'}), 404
    
    return jsonify(job), 200
