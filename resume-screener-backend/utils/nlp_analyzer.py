
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re
import google.generativeai as genai
from config import Config
import numpy as np

# Configure Gemini API key
if Config.GEMINI_API_KEY:
    try:
        genai.configure(api_key=Config.GEMINI_API_KEY)
    except Exception as e:
        print(f"Error configuring Gemini: {e}")

def preprocess_text(text):
    """
    Preprocess text for analysis
    """
    # Convert to lowercase
    text = text.lower()
    
    # Remove special characters
    text = re.sub(r'[^\w\s]', ' ', text)
    
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text

def extract_skills_from_text(text, skill_list):
    """
    Extract skills from text
    """
    matched_skills = []
    text = text.lower()
    
    for skill in skill_list:
        skill_pattern = r'\b' + re.escape(skill.lower()) + r'\b'
        if re.search(skill_pattern, text):
            matched_skills.append(skill)
    
    return matched_skills

def analyze_ats_friendliness(resume_text):
    """
    Analyze ATS friendliness of resume
    """
    score = 100  # Start with perfect score
    
    # Check for common ATS issues
    issues = []
    
    # Check for tables (approximate detection)
    table_patterns = [r'[\|\t]{2,}', r'\+[-+]+\+', r'┌[─┬]+┐', r'╔[═╦]+╗']
    for pattern in table_patterns:
        if re.search(pattern, resume_text):
            score -= 15
            issues.append("Detected possible table structures which may not parse correctly in ATS systems")
            break
    
    # Check for headers/footers (approximate detection)
    header_footer_patterns = [r'Page \d+ of \d+', r'\d+/\d+']
    for pattern in header_footer_patterns:
        if re.search(pattern, resume_text):
            score -= 5
            issues.append("Detected possible headers or footers which may interfere with ATS parsing")
            break
    
    # Check for non-standard section headings
    standard_headings = ['experience', 'education', 'skills', 'summary', 'objective', 'projects', 'certifications']
    found_standard_headings = False
    for heading in standard_headings:
        heading_pattern = r'\b' + re.escape(heading) + r'\b'
        if re.search(heading_pattern, resume_text.lower()):
            found_standard_headings = True
            break
    
    if not found_standard_headings:
        score -= 10
        issues.append("No standard section headings detected (like 'Experience', 'Education', 'Skills')")
    
    # Check for excessive use of acronyms
    acronym_pattern = r'\b[A-Z]{2,}\b'
    acronyms = re.findall(acronym_pattern, resume_text)
    if len(acronyms) > 10:  # Arbitrary threshold
        score -= 5
        issues.append("Excessive use of acronyms may reduce ATS score")
    
    # Check for appropriate length
    word_count = len(resume_text.split())
    if word_count > 1000:  # Arbitrary threshold
        score -= 5
        issues.append("Resume is quite long, consider making it more concise")
    
    # Ensure score is between 0 and 100
    score = max(0, min(100, score))
    
    return score, issues

def get_gemini_suggestions(resume_text, job_description, matched_skills, missing_skills):
    """
    Get suggestions from Google's Gemini AI
    """
    try:
        if not Config.GEMINI_API_KEY:
            return ["Enable Gemini API with a key to get personalized suggestions"]
        
        # Using Gemini-1.0-flash-lite as requested
        model = genai.GenerativeModel('gemini-1.0-flash-lite')
        
        prompt = f"""
        As a resume optimization expert, analyze this resume against the job description and provide 
        5 specific improvement suggestions. Focus on how to better emphasize existing skills 
        and incorporate missing skills if applicable.

        Resume:
        {resume_text}

        Job Description:
        {job_description}

        Matched Skills: {', '.join(matched_skills)}
        Missing Skills: {', '.join(missing_skills)}

        Provide ONLY 5 short, specific, actionable suggestions as a list, each 1-2 sentences:
        """
        
        response = model.generate_content(prompt)
        
        # Extract suggestions from response
        text = response.text
        suggestions = []
        
        # Look for numbered list items
        pattern = r'^\s*\d+\.\s*(.*?)$'
        matches = re.findall(pattern, text, re.MULTILINE)
        
        if matches:
            suggestions = [match.strip() for match in matches]
        else:
            # If no numbered list, try to split by newlines
            lines = [line.strip() for line in text.split('\n') if line.strip()]
            suggestions = [line for line in lines if not line.startswith('#') and len(line) > 10]
        
        # Ensure we have at most 5 suggestions
        suggestions = suggestions[:5]
        
        if not suggestions:
            suggestions = ["Customize your resume to highlight experience related to the job description",
                        "Ensure your skills section includes relevant keywords from the job listing"]
        
        return suggestions
            
    except Exception as e:
        print(f"Error generating Gemini suggestions: {e}")
        return ["Customize your resume to highlight experience related to the job description",
                "Ensure your skills section includes relevant keywords from the job listing"]

def analyze_resume(resume_text, job_description, required_skills):
    """
    Analyze resume against job description and return match percentage, scores, and suggestions
    """
    # Preprocess texts
    processed_resume = preprocess_text(resume_text)
    processed_job = preprocess_text(job_description)
    
    # Calculate match percentage using TF-IDF and cosine similarity
    vectorizer = TfidfVectorizer()
    try:
        tfidf_matrix = vectorizer.fit_transform([processed_resume, processed_job])
        match_score = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        match_percentage = int(match_score * 100)
    except:
        match_percentage = 50  # Default if there's an error
    
    # Find matched and missing skills
    matched_skills = extract_skills_from_text(resume_text, required_skills)
    missing_skills = [skill for skill in required_skills if skill not in matched_skills]
    
    # Calculate skills match percentage
    skills_match_percentage = len(matched_skills) / len(required_skills) * 100 if required_skills else 0
    
    # Combine text similarity and skills match for final score
    # Weight: 60% skills match, 40% text similarity
    final_match_percentage = int(0.6 * skills_match_percentage + 0.4 * match_percentage)
    
    # Analyze ATS friendliness
    ats_score, ats_issues = analyze_ats_friendliness(resume_text)
    
    # Get suggestions from Gemini
    suggestions = get_gemini_suggestions(resume_text, job_description, matched_skills, missing_skills)
    
    # Combine ATS issues with Gemini suggestions if needed
    if ats_issues:
        for issue in ats_issues:
            if len(suggestions) < 5:
                suggestions.append(f"ATS Improvement: {issue}")
    
    return {
        'match_percentage': final_match_percentage,
        'ats_score': ats_score,
        'matched_skills': matched_skills,
        'missing_skills': missing_skills,
        'suggestions': suggestions
    }
