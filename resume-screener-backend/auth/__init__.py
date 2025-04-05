
# This file is required to make the directory a package
from auth.routes import init_jwt

def init_app(app):
    init_jwt(app)
