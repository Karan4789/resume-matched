
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-brand mb-4">ResumeMatch AI</h3>
            <p className="text-sm text-gray-600">
              AI-powered resume screening and guidance platform for job seekers and HR professionals.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">For Candidates</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/how-it-works" className="text-gray-600 hover:text-brand">How It Works</Link></li>
              <li><Link to="/pricing" className="text-gray-600 hover:text-brand">Pricing</Link></li>
              <li><Link to="/resume-tips" className="text-gray-600 hover:text-brand">Resume Tips</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">For HR Professionals</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/features" className="text-gray-600 hover:text-brand">Features</Link></li>
              <li><Link to="/enterprise" className="text-gray-600 hover:text-brand">Enterprise</Link></li>
              <li><Link to="/integrations" className="text-gray-600 hover:text-brand">Integrations</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-gray-600 hover:text-brand">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-brand">Contact</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-brand">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} ResumeMatch AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
