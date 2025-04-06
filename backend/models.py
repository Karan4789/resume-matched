from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()
engine = create_engine('sqlite:///skillsync.db', echo=True)
Session = sessionmaker(bind=engine)

class ResumeAnalysis(Base):
    __tablename__ = 'resume_analyses'

    id = Column(Integer, primary_key=True)
    candidate_name = Column(String)  # Make sure this exists
    candidate_email = Column(String)  # Add this column
    role = Column(String)
    resume_text = Column(String)
    job_description = Column(String)
    analysis_result = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)

    @staticmethod
    def save_analysis(resume_text, job_description, analysis_result, candidate_name, candidate_email, role):
        session = Session()
        analysis = ResumeAnalysis(
            resume_text=resume_text,
            job_description=job_description, 
            analysis_result=analysis_result,
            candidate_name=candidate_name,
            candidate_email=candidate_email,
            role=role
        )
        session.add(analysis)
        session.commit()
        session.refresh(analysis)  # Refresh to get the new ID
        return {'id': analysis.id}  # Return the ID in a dict

    @staticmethod
    def get_recent_submissions(limit=10):
        session = Session()
        submissions = session.query(ResumeAnalysis).order_by(
            ResumeAnalysis.created_at.desc()
        ).limit(limit).all()
        session.close()
        return [
            {
                'job_description': sub.job_description,
                'analysis_result': sub.analysis_result,
                'created_at': sub.created_at
            } for sub in submissions
        ]

    @staticmethod
    def get_stats():
        try:
            session = Session()
            submissions = session.query(ResumeAnalysis).all()
            session.close()

            if not submissions:
                return [{
                    '_id': None,
                    'avg_match_score': 0,
                    'avg_ats_score': 0,
                    'total_submissions': 0,
                    'missing_skills': []
                }]

            total = len(submissions)
            avg_match = sum(s.analysis_result.get('match_score', 0) for s in submissions) / total
            avg_ats = sum(s.analysis_result.get('ats_score', 0) for s in submissions) / total
            missing_skills = [s.analysis_result.get('missing_skills', []) for s in submissions]

            return [{
                '_id': None,
                'avg_match_score': round(avg_match, 2),
                'avg_ats_score': round(avg_ats, 2),
                'total_submissions': total,
                'missing_skills': missing_skills
            }]
        except Exception as e:
            print(f"Error calculating stats: {str(e)}")
            return [{
                '_id': None,
                'avg_match_score': 0,
                'avg_ats_score': 0,
                'total_submissions': 0,
                'missing_skills': []
            }]

    @staticmethod
    def get_dashboard_stats():
        session = Session()
        try:
            # Get total candidates
            total_candidates = session.query(ResumeAnalysis).count() or 0
            
            # Get total job postings
            total_jobs = session.query(JobPosting).count() or 0
            
            # Get average match score safely
            submissions = session.query(ResumeAnalysis).all()
            avg_match = 0
            if submissions:
                total_scores = sum(
                    s.analysis_result.get('match_score', 0) 
                    for s in submissions 
                    if isinstance(s.analysis_result, dict)
                )
                avg_match = total_scores / len(submissions) if len(submissions) > 0 else 0

            return {
                'total_candidates': total_candidates,
                'total_job_postings': total_jobs,
                'avg_match_score': round(avg_match, 2)
            }
        except Exception as e:
            print(f"Error in get_dashboard_stats: {str(e)}")
            return {
                'total_candidates': 0,
                'total_job_postings': 0,
                'avg_match_score': 0
            }
        finally:
            session.close()

    @staticmethod
    def get_candidate_details():
        session = Session()
        try:
            candidates = session.query(ResumeAnalysis).order_by(ResumeAnalysis.created_at.desc()).all()
            return [{
                'candidate_name': c.candidate_name or 'Anonymous',
                'role': c.role or 'Not Specified',
                'match_score': c.analysis_result.get('match_score', 0) if isinstance(c.analysis_result, dict) else 0,
                'status': c.analysis_result.get('status', 'Pending') if isinstance(c.analysis_result, dict) else 'Pending',
                'submission_date': c.created_at.strftime('%Y-%m-%d') if c.created_at else 'N/A'
            } for c in candidates] if candidates else []
        except Exception as e:
            print(f"Error in get_candidate_details: {str(e)}")
            return []
        finally:
            session.close()

    @staticmethod
    def delete_resume(resume_id):
        session = Session()
        try:
            resume = session.query(ResumeAnalysis).filter(ResumeAnalysis.id == resume_id).first()
            if resume:
                session.delete(resume)
                session.commit()
                return True
            return False
        finally:
            session.close()

class JobPosting(Base):
    __tablename__ = 'job_postings'

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    company = Column(String, nullable=False)
    department = Column(String, nullable=False)
    location = Column(String, nullable=False)
    description = Column(String, nullable=False)
    requirements = Column(JSON, nullable=False)
    skills = Column(JSON, nullable=False)
    applicants = Column(Integer, default=0)
    status = Column(String, default='Active')
    created_at = Column(DateTime, default=datetime.utcnow)

    @staticmethod
    def create_job_posting(data):
        session = Session()
        try:
            job_posting = JobPosting(
                title=data['title'],
                company=data['company'],
                department=data['department'],
                location=data['location'],
                description=data['description'],
                requirements=data['requirements'],
                skills=data['skills'],
                status=data.get('status', 'Active')
            )
            session.add(job_posting)
            session.commit()
            return job_posting.id
        finally:
            session.close()

    @staticmethod
    def get_all_job_postings():
        session = Session()
        try:
            jobs = session.query(JobPosting).order_by(JobPosting.created_at.desc()).all()
            return [{
                'id': job.id,
                'title': job.title,
                'company': job.company,
                'department': job.department,
                'location': job.location,
                'description': job.description,
                'requirements': job.requirements,
                'skills': job.skills,
                'applicants': job.applicants,
                'status': job.status,
                'posted_date': job.created_at.strftime('%Y-%m-%d')
            } for job in jobs]
        finally:
            session.close()

# Create tables
Base.metadata.create_all(engine)
