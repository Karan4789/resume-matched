
from flask import jsonify, request
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from functools import wraps

def role_required(role):
    """
    Decorator to check if user has required role
    """
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            current_user = get_jwt_identity()
            
            if current_user.get('role') != role:
                return jsonify({'error': 'Unauthorized access'}), 403
            
            return fn(*args, **kwargs)
        return decorator
    return wrapper
