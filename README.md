
# ResumeMatch AI - Resume Screening and Guidance Web Application

## Project Overview

ResumeMatch AI is an AI-powered resume screening and guidance web application that streamlines the hiring process for recruiters and provides valuable feedback to job applicants. The platform supports two user roles:

- **Candidates** - Job seekers who can upload resumes and receive AI-driven analysis and feedback
- **HR Professionals** - Recruiters who can review candidate submissions and make hiring decisions

## Features

### For Candidates
- Upload resume in PDF or text format
- Select job roles to match against
- Receive detailed AI analysis of their resumes
- View match percentage and ATS compatibility score
- Get personalized recommendations for improvement
- Track multiple job applications

### For HR Professionals
- View all candidate submissions
- Filter candidates by job role or match percentage
- Access detailed breakdowns of each resume
- Review candidate strengths and weaknesses
- Make informed hiring decisions

## Technology Stack

- **Frontend**: React.js, Tailwind CSS, shadcn UI
- **State Management**: React Context API, Tanstack Query
- **Routing**: React Router
- **AI Analysis**: Mock implementation (would integrate with NLP models in production)
- **Authentication**: JWT-based (mock implementation)

## Getting Started

### Prerequisites
- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation
```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm i

# Start the development server
npm run dev
```

### Demo Accounts
For testing purposes, you can use these demo accounts:

- **Candidate**: candidate@example.com / password
- **HR Professional**: hr@example.com / password

## Project Structure

```
src/
├── components/         # Reusable UI components
├── contexts/           # React context providers
├── hooks/              # Custom React hooks
├── pages/              # Page components
│   ├── candidate/      # Candidate-specific pages
│   ├── hr/             # HR-specific pages
├── services/           # API and data services
└── utils/              # Utility functions
```

## Future Enhancements

- Email notifications
- Resume report downloads
- Chatbot support
- Custom job description input by HR
- Integration with real NLP models
- Database storage with PostgreSQL or MongoDB

## License

This project is licensed under the MIT License.
