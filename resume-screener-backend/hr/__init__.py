
# This file is required to make the directory a package

def init_app(app):
    from hr.routes import hr_bp
    app.register_blueprint(hr_bp, url_prefix='/hr')
