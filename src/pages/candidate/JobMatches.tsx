
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { jobDescriptions } from '@/services/mockData';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Building, MapPin, ArrowUpRight, Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const JobMatches = () => {
  // We'll use the job descriptions from mock data, with added match percentages
  const jobsWithMatches = jobDescriptions.map(job => ({
    ...job,
    matchPercentage: Math.floor(Math.random() * 41) + 60, // Random match between 60-100%
    companyLogo: job.company.substring(0, 1).toUpperCase(),
    postedDate: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    location: ['Remote', 'New York', 'San Francisco', 'London', 'Berlin'][Math.floor(Math.random() * 5)]
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Matches</h1>
          <p className="text-muted-foreground mt-2">
            Discover job opportunities that match your skills and experience
          </p>
        </div>

        <div className="grid gap-4">
          {jobsWithMatches.sort((a, b) => b.matchPercentage - a.matchPercentage).map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start">
                  <div className="h-12 w-12 rounded-md bg-blue-600 text-white flex items-center justify-center text-lg font-bold mr-4">
                    {job.companyLogo}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{job.title}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <Building className="h-3.5 w-3.5 mr-1" />
                          {job.company}
                          <span className="mx-2">•</span>
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          {job.location}
                          <span className="mx-2">•</span>
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          Posted {job.postedDate}
                        </CardDescription>
                      </div>
                      <div className="text-center">
                        <span className="text-2xl font-bold text-blue-600">{job.matchPercentage}%</span>
                        <p className="text-xs text-muted-foreground">Match</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm line-clamp-2">{job.description}</p>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Required Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {job.skills.map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Star className="h-4 w-4 mr-1 text-yellow-400 fill-yellow-400" />
                      <span>Great match for your skills</span>
                    </div>
                    <Button variant="outline" size="sm" className="text-blue-600" asChild>
                      <Link to={`/candidate-dashboard/job/${job.id}`}>
                        <span className="flex items-center">
                          View Job
                          <ArrowUpRight className="ml-2 h-4 w-4" />
                        </span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default JobMatches;
