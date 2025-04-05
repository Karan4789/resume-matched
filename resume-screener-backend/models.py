
from pymongo import MongoClient
from config import Config
from bson import ObjectId
import json

# Connect to MongoDB
client = MongoClient(Config.MONGO_URI)
db = client.get_database()

# Collections
users = db.users
resumes = db.resumes
jobs = db.jobs
analyses = db.analyses

class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super(JSONEncoder, self).default(obj)

def serialize_doc(doc):
    """Convert MongoDB document to JSON serializable dict"""
    if isinstance(doc, list):
        return [serialize_doc(item) for item in doc]
    
    if doc is None:
        return None
    
    if "_id" in doc and isinstance(doc["_id"], ObjectId):
        doc["_id"] = str(doc["_id"])
    
    return doc

def user_exists(email):
    """Check if user with given email exists"""
    return users.find_one({"email": email}) is not None

def create_user(user_data):
    """Create a new user"""
    result = users.insert_one(user_data)
    return str(result.inserted_id)

def get_user_by_email(email):
    """Get user by email"""
    user = users.find_one({"email": email})
    return serialize_doc(user)

def get_user_by_id(user_id):
    """Get user by ID"""
    user = users.find_one({"_id": ObjectId(user_id)})
    return serialize_doc(user)

def save_resume(resume_data):
    """Save a resume submission"""
    result = resumes.insert_one(resume_data)
    return str(result.inserted_id)

def get_resume(resume_id):
    """Get resume by ID"""
    resume = resumes.find_one({"_id": ObjectId(resume_id)})
    return serialize_doc(resume)

def get_user_resumes(user_id):
    """Get all resumes for a user"""
    user_resumes = list(resumes.find({"user_id": user_id}))
    return serialize_doc(user_resumes)

def save_analysis(analysis_data):
    """Save resume analysis"""
    result = analyses.insert_one(analysis_data)
    return str(result.inserted_id)

def get_analysis(analysis_id):
    """Get analysis by ID"""
    analysis = analyses.find_one({"_id": ObjectId(analysis_id)})
    return serialize_doc(analysis)

def get_user_analyses(user_id):
    """Get all analyses for a user"""
    user_analyses = list(analyses.find({"user_id": user_id}))
    return serialize_doc(user_analyses)

def get_all_jobs():
    """Get all job descriptions"""
    all_jobs = list(jobs.find())
    return serialize_doc(all_jobs)

def get_job(job_id):
    """Get job by ID"""
    job = jobs.find_one({"_id": ObjectId(job_id)})
    return serialize_doc(job)

def save_job(job_data):
    """Save a job description"""
    result = jobs.insert_one(job_data)
    return str(result.inserted_id)

def get_candidate_analyses():
    """Get all candidate analyses (for HR view)"""
    all_analyses = list(analyses.find())
    return serialize_doc(all_analyses)

def delete_resume(resume_id):
    """Delete a resume"""
    resumes.delete_one({"_id": ObjectId(resume_id)})
    
def delete_analysis(analysis_id):
    """Delete an analysis"""
    analyses.delete_one({"_id": ObjectId(analysis_id)})
