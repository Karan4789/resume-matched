
from flask import Flask
from flask_cors import CORS
from config import Config
from auth.routes import auth_bp
from candidate.routes import candidate_bp
from hr.routes import hr_bp
import os

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Enable CORS
    CORS(app, resources={r"/*": {"origins": "*"}})
    
    # Create upload directory if it doesn't exist
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(candidate_bp, url_prefix='/api/candidate')
    app.register_blueprint(hr_bp, url_prefix='/api/hr')
    
    @app.route('/health')
    def health_check():
        return {"status": "healthy"}, 200
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
