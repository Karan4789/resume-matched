
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Users, Briefcase, BarChart2, ArrowUpRight, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { jobDescriptions, resumeAnalyses } from '@/services/mockData';

const HRDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">HR Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Manage job postings and review candidate applications.
            </p>
          </div>
          
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search candidates or jobs..."
              className="pl-8 w-full md:w-[200px] lg:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Stats cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Candidates
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foreground mt-1">
                +3 this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Job Postings
              </CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {jobDescriptions.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                +2 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Match Rate
              </CardTitle>
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                72%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                +5% from previous week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Top Candidates
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                4
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Candidates with >80% match
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Candidates */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Candidates</h2>
            <Button variant="outline" size="sm" asChild>
              <Link to="/hr-dashboard/candidates">View all</Link>
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-muted">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      >
                        Job Position
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      >
                        Match
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">View</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {resumeAnalyses.map((candidate) => (
                      <tr key={candidate.id} className="hover:bg-muted/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium">{candidate.candidateName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {candidate.jobTitle}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className={`px-2 py-1 text-xs rounded-full font-semibold ${
                                candidate.matchPercentage >= 80
                                  ? "bg-green-100 text-green-800"
                                  : candidate.matchPercentage >= 60
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {candidate.matchPercentage}%
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {new Date(candidate.analysisDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <Button size="sm" variant="ghost" asChild>
                            <Link to={`/hr-dashboard/candidate/${candidate.id}`}>
                              <ArrowUpRight className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        {/* Active Job Postings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Active Job Postings</h2>
            <Button variant="outline" size="sm" asChild>
              <Link to="/hr-dashboard/job-postings">View all</Link>
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {jobDescriptions.slice(0, 3).map((job) => (
              <Card key={job.id} className="resume-card">
                <CardHeader>
                  <CardTitle>{job.title}</CardTitle>
                  <CardDescription>{job.company} • {job.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {job.description}
                  </p>
                  
                  <div className="mt-2">
                    <h4 className="text-sm font-medium mb-2">Required Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {job.skills.slice(0, 5).map((skill, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 5 && (
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold">
                          +{job.skills.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full" asChild>
                    <Link to={`/hr-dashboard/job-posting/${job.id}`}>
                      <span className="flex items-center">
                        View Job Details
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </span>
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HRDashboard;
