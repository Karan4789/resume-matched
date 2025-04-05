
from flask import Blueprint, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required
import bcrypt
from models import user_exists, create_user, get_user_by_email
import re

auth_bp = Blueprint('auth', __name__)
jwt = JWTManager()

def init_jwt(app):
    jwt.init_app(app)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validate input
    for field in ['email', 'password', 'name', 'role']:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    email = data['email']
    password = data['password']
    name = data['name']
    role = data['role']
    
    # Validate email format
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({'error': 'Invalid email format'}), 400
    
    # Validate password
    if len(password) < 8:
        return jsonify({'error': 'Password must be at least 8 characters long'}), 400
    
    # Validate role
    if role not in ['candidate', 'hr']:
        return jsonify({'error': 'Role must be either "candidate" or "hr"'}), 400
    
    # Check if user already exists
    if user_exists(email):
        return jsonify({'error': 'User with this email already exists'}), 409
    
    # Hash password
    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    
    # Create user
    user_data = {
        'email': email,
        'password': hashed_pw.decode('utf-8'),
        'name': name,
        'role': role
    }
    
    user_id = create_user(user_data)
    
    # Create access token
    user_claims = {
        'user_id': user_id,
        'email': email,
        'name': name,
        'role': role
    }
    
    access_token = create_access_token(identity=user_claims)
    
    return jsonify({
        'token': access_token,
        'user': {
            'id': user_id,
            'email': email,
            'name': name,
            'role': role
        }
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    # Validate input
    for field in ['email', 'password']:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    email = data['email']
    password = data['password']
    
    # Get user from database
    user = get_user_by_email(email)
    
    # Check if user exists
    if not user:
        return jsonify({'error': 'Invalid email or password'}), 401
    
    # Verify password
    if not bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
        return jsonify({'error': 'Invalid email or password'}), 401
    
    # Create access token
    user_claims = {
        'user_id': user['_id'],
        'email': user['email'],
        'name': user['name'],
        'role': user['role']
    }
    
    access_token = create_access_token(identity=user_claims)
    
    return jsonify({
        'token': access_token,
        'user': {
            'id': user['_id'],
            'email': user['email'],
            'name': user['name'],
            'role': user['role']
        }
    }), 200

@auth_bp.route('/user', methods=['GET'])
@jwt_required()
def get_user():
    current_user = get_jwt_identity()
    return jsonify(current_user), 200
