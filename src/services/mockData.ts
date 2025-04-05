
export interface JobDescription {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  skills: string[];
  postDate: string;
}

export interface SkillMatch {
  skill: string;
  status: 'matched' | 'missing' | 'required';
}

export interface ResumeAnalysis {
  id: string;
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  matchPercentage: number;
  atsScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  requiredSkills: string[];
  skillMatches: SkillMatch[];
  suggestions: string[];
  analysisDate: string;
  resumeText?: string;
}

// Mock job descriptions
export const jobDescriptions: JobDescription[] = [
  {
    id: '1',
    title: 'Frontend Developer',
    company: 'TechCorp',
    location: 'Remote',
    description: 'We are looking for an experienced Frontend Developer proficient in React.js to join our team. The ideal candidate will have experience building responsive web applications and working with modern JavaScript frameworks.',
    requirements: [
      'Bachelor\'s degree in Computer Science or related field',
      '3+ years of experience with React.js',
      'Proficiency in HTML, CSS, and JavaScript',
      'Experience with responsive design',
    ],
    skills: ['React.js', 'JavaScript', 'HTML', 'CSS', 'TypeScript', 'Redux', 'Git', 'Responsive Design'],
    postDate: '2025-03-15',
  },
  {
    id: '2',
    title: 'Backend Developer',
    company: 'DataSoft',
    location: 'San Francisco, CA',
    description: 'We are seeking a Backend Developer with strong Python skills to develop and maintain our server-side applications. The ideal candidate will have experience with Flask or Django and database management.',
    requirements: [
      'Bachelor\'s or Master\'s in Computer Science',
      '2+ years of experience with Python',
      'Knowledge of SQL and NoSQL databases',
      'Experience with RESTful API design',
    ],
    skills: ['Python', 'Flask', 'Django', 'PostgreSQL', 'RESTful APIs', 'Docker', 'AWS', 'Git'],
    postDate: '2025-03-20',
  },
  {
    id: '3',
    title: 'Full Stack Developer',
    company: 'InnovateTech',
    location: 'Chicago, IL',
    description: 'We are looking for a Full Stack Developer to work on our web applications. The candidate should be comfortable working with both frontend and backend technologies.',
    requirements: [
      'Bachelor\'s degree in Computer Science or equivalent',
      '4+ years of experience in full stack development',
      'Strong proficiency in JavaScript and a backend language such as Node.js',
      'Experience with databases and API design',
    ],
    skills: ['JavaScript', 'Node.js', 'React', 'MongoDB', 'RESTful APIs', 'Git', 'AWS', 'Docker'],
    postDate: '2025-03-25',
  },
  {
    id: '4',
    title: 'Data Scientist',
    company: 'AnalyticsPro',
    location: 'Boston, MA',
    description: 'We are seeking a Data Scientist to join our analytics team. The ideal candidate will have strong statistical analysis skills and experience with machine learning models.',
    requirements: [
      'Master\'s or PhD in Statistics, Computer Science, or related field',
      '3+ years of experience in data science',
      'Proficiency in Python and R',
      'Experience with machine learning algorithms',
    ],
    skills: ['Python', 'R', 'SQL', 'Machine Learning', 'TensorFlow', 'PyTorch', 'Data Visualization', 'Statistics'],
    postDate: '2025-03-18',
  },
  {
    id: '5',
    title: 'UI/UX Designer',
    company: 'DesignHub',
    location: 'Seattle, WA',
    description: 'We are looking for a UI/UX Designer to create engaging and intuitive user experiences for our products.',
    requirements: [
      'Bachelor\'s degree in Design, HCI, or related field',
      '3+ years of experience in UI/UX design',
      'Proficiency in design tools such as Figma, Adobe XD',
      'Portfolio demonstrating UI/UX projects',
    ],
    skills: ['UI Design', 'UX Research', 'Wireframing', 'Prototyping', 'Figma', 'Adobe XD', 'User Testing', 'Responsive Design'],
    postDate: '2025-03-22',
  }
];

// Mock resume analyses
export const resumeAnalyses: ResumeAnalysis[] = [
  {
    id: '1',
    candidateId: '1',
    candidateName: 'John Candidate',
    jobId: '1',
    jobTitle: 'Frontend Developer',
    matchPercentage: 0,
    atsScore: 0,
    matchedSkills: ['React.js', 'JavaScript', 'HTML', 'CSS', 'Git'],
    missingSkills: ['TypeScript', 'Redux'],
    requiredSkills: ['React.js', 'JavaScript', 'HTML', 'CSS'],
    skillMatches: [
      { skill: 'React.js', status: 'matched' },
      { skill: 'JavaScript', status: 'matched' },
      { skill: 'HTML', status: 'matched' },
      { skill: 'CSS', status: 'matched' },
      { skill: 'Git', status: 'matched' },
      { skill: 'TypeScript', status: 'missing' },
      { skill: 'Redux', status: 'missing' },
      { skill: 'Responsive Design', status: 'required' }
    ],
    suggestions: [
      'Add TypeScript to your skill set and mention any projects where you\'ve used it',
      'Highlight experience with state management libraries like Redux',
      'Emphasize responsive design examples in your portfolio',
      'Consider adding a projects section to showcase your React.js work'
    ],
    analysisDate: '2025-04-02',
  },
  {
    id: '2',
    candidateId: '1',
    candidateName: 'John Candidate',
    jobId: '3',
    jobTitle: 'Full Stack Developer',
    matchPercentage: 0,
    atsScore: 0,
    matchedSkills: ['JavaScript', 'React', 'Git'],
    missingSkills: ['Node.js', 'MongoDB', 'AWS', 'Docker'],
    requiredSkills: ['JavaScript', 'Node.js', 'React', 'MongoDB'],
    skillMatches: [
      { skill: 'JavaScript', status: 'matched' },
      { skill: 'React', status: 'matched' },
      { skill: 'Git', status: 'matched' },
      { skill: 'Node.js', status: 'missing' },
      { skill: 'MongoDB', status: 'missing' },
      { skill: 'AWS', status: 'missing' },
      { skill: 'Docker', status: 'missing' },
      { skill: 'RESTful APIs', status: 'required' }
    ],
    suggestions: [
      'Develop backend skills with Node.js through personal projects',
      'Learn a NoSQL database like MongoDB',
      'Gain experience with cloud platforms like AWS',
      'Add containerization skills using Docker',
      'Emphasize your experience with RESTful APIs if you have any'
    ],
    analysisDate: '2025-04-03',
  }
];

// Function to simulate AI analysis of a resume
export const analyzeResume = (resumeText: string, jobId: string): Promise<ResumeAnalysis> => {
  return new Promise((resolve) => {
    // Find the job description
    const job = jobDescriptions.find(j => j.id === jobId);
    
    if (!job) {
      throw new Error('Job not found');
    }
    
    // Simulate AI processing delay
    setTimeout(() => {
      // Extract "skills" from resume text (very simplified)
      const extractedSkills = [];
      const lowerText = resumeText.toLowerCase();
      
      // Check for each skill in the job requirements
      for (const skill of job.skills) {
        if (lowerText.includes(skill.toLowerCase())) {
          extractedSkills.push(skill);
        }
      }
      
      // Determine which skills matched and which are missing
      const matchedSkills = extractedSkills;
      const missingSkills = job.skills.filter(skill => !extractedSkills.includes(skill));
      const requiredSkills = job.skills.slice(0, 4); // First 4 skills are "required"
      
      // Create skill matches array
      const skillMatches = job.skills.map(skill => {
        if (matchedSkills.includes(skill)) {
          return { skill, status: 'matched' as const };
        } else if (requiredSkills.includes(skill)) {
          return { skill, status: 'required' as const };
        } else {
          return { skill, status: 'missing' as const };
        }
      });
      
      // Calculate match percentage
      const matchPercentage = Math.round((matchedSkills.length / job.skills.length) * 100);
      
      // Generate a random ATS score
      const atsScore = Math.min(Math.round(matchPercentage + (Math.random() * 20 - 10)), 100);
      
      // Generate suggestions
      const suggestions = [];
      for (const skill of missingSkills) {
        suggestions.push(`Consider adding '${skill}' to your resume and highlighting relevant experience`);
      }
      
      if (atsScore < 90) {
        suggestions.push('Use more keywords from the job description to improve ATS score');
        suggestions.push('Structure your resume with clear sections for better parsing');
      }
      
      // Create the analysis
      const analysis: ResumeAnalysis = {
        id: Math.random().toString(),
        candidateId: '1', // Mock ID
        candidateName: 'John Candidate', // Mock name
        jobId: job.id,
        jobTitle: job.title,
        matchPercentage,
        atsScore,
        matchedSkills,
        missingSkills,
        requiredSkills,
        skillMatches,
        suggestions,
        analysisDate: new Date().toISOString().split('T')[0],
        resumeText
      };
      
      resolve(analysis);
    }, 2000);
  });
};
