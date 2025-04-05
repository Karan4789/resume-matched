
# This file is required to make the directory a package
from auth.routes import jwt

def init_app(app):
    jwt.init_app(app)
