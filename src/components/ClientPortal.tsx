'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, FileText, Users, CheckCircle, Upload, MessageSquare, BarChart3, Settings, Bell } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  status: 'planning' | 'in-progress' | 'review' | 'completed';
  progress: number;
  startDate: string;
  endDate: string;
  milestones: Milestone[];
  team: TeamMember[];
  files: ProjectFile[];
  feedback: Feedback[];
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  completedDate?: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  email: string;
}

interface ProjectFile {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadDate: string;
  version: string;
  url: string;
}

interface Feedback {
  id: string;
  type: 'comment' | 'approval' | 'revision';
  message: string;
  author: string;
  timestamp: string;
  status: 'pending' | 'resolved';
}

const ClientPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [notifications, setNotifications] = useState(3);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockProjects: Project[] = [
      {
        id: '1',
        name: 'Website Redesign',
        status: 'in-progress',
        progress: 65,
        startDate: '2024-01-15',
        endDate: '2024-03-15',
        milestones: [
          { id: '1', title: 'Design Concepts', description: 'Initial design mockups', dueDate: '2024-01-30', status: 'completed', completedDate: '2024-01-28' },
          { id: '2', title: 'Development', description: 'Frontend development', dueDate: '2024-02-28', status: 'in-progress' },
          { id: '3', title: 'Testing & Launch', description: 'Final testing and deployment', dueDate: '2024-03-15', status: 'pending' }
        ],
        team: [
          { id: '1', name: 'Sarah Johnson', role: 'Project Manager', avatar: '/api/placeholder/40/40', email: 'sarah@mma.com' },
          { id: '2', name: 'Mike Chen', role: 'Designer', avatar: '/api/placeholder/40/40', email: 'mike@mma.com' },
          { id: '3', name: 'Alex Rodriguez', role: 'Developer', avatar: '/api/placeholder/40/40', email: 'alex@mma.com' }
        ],
        files: [
          { id: '1', name: 'Design_Mockups_v1.pdf', type: 'PDF', size: '2.4 MB', uploadedBy: 'Mike Chen', uploadDate: '2024-01-28', version: '1.0', url: '#' },
          { id: '2', name: 'Content_Outline.docx', type: 'Word', size: '156 KB', uploadedBy: 'Sarah Johnson', uploadDate: '2024-01-25', version: '1.0', url: '#' }
        ],
        feedback: [
          { id: '1', type: 'comment', message: 'Love the new design direction! The color scheme is perfect.', author: 'Client', timestamp: '2024-01-29 14:30', status: 'resolved' },
          { id: '2', type: 'approval', message: 'Design concepts approved for development phase.', author: 'Client', timestamp: '2024-01-29 14:30', status: 'resolved' }
        ]
      },
      {
        id: '2',
        name: 'Marketing Campaign',
        status: 'planning',
        progress: 25,
        startDate: '2024-02-01',
        endDate: '2024-04-01',
        milestones: [
          { id: '1', title: 'Strategy Development', description: 'Campaign strategy and planning', dueDate: '2024-02-15', status: 'in-progress' },
          { id: '2', title: 'Content Creation', description: 'Create marketing materials', dueDate: '2024-03-01', status: 'pending' },
          { id: '3', title: 'Launch & Monitor', description: 'Campaign launch and performance tracking', dueDate: '2024-04-01', status: 'pending' }
        ],
        team: [
          { id: '1', name: 'Sarah Johnson', role: 'Project Manager', avatar: '/api/placeholder/40/40', email: 'sarah@mma.com' },
          { id: '2', name: 'Mike Chen', role: 'Designer', avatar: '/api/placeholder/40/40', email: 'mike@mma.com' }
        ],
        files: [
          { id: '1', name: 'Campaign_Strategy.pdf', type: 'PDF', size: '1.2 MB', uploadedBy: 'Sarah Johnson', uploadDate: '2024-02-01', version: '1.0', url: '#' }
        ],
        feedback: [
          { id: '1', type: 'comment', message: 'Great strategy outline! Looking forward to seeing the creative concepts.', author: 'Client', timestamp: '2024-02-02 10:15', status: 'resolved' }
        ]
      }
    ];
    setProjects(mockProjects);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'review': return 'text-yellow-600 bg-yellow-100';
      case 'planning': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Client Portal</h1>
              <p className="text-gray-600">Manage your projects and collaborate with our team</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <Bell className="h-6 w-6" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Settings className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'projects', label: 'Projects', icon: FileText },
              { id: 'files', label: 'Files', icon: Upload },
              { id: 'team', label: 'Team', icon: Users },
              { id: 'calendar', label: 'Calendar', icon: Calendar },
              { id: 'feedback', label: 'Feedback', icon: MessageSquare }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Projects</p>
                    <p className="text-2xl font-semibold text-gray-900">{projects.filter(p => p.status !== 'completed').length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-semibold text-gray-900">{projects.filter(p => p.status === 'completed').length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Feedback</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {projects.reduce((acc, p) => acc + p.feedback.filter(f => f.status === 'pending').length, 0)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Team Members</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {new Set(projects.flatMap(p => p.team.map(t => t.id))).size}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {projects.flatMap(p => p.feedback).slice(0, 5).map((feedback) => (
                    <div key={feedback.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {feedback.author.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{feedback.author}</span> {feedback.message}
                        </p>
                        <p className="text-sm text-gray-500">{feedback.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">All Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                      {project.status.replace('-', ' ')}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getProgressColor(project.progress)}`}
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-4">
                    <p>Start: {new Date(project.startDate).toLocaleDateString()}</p>
                    <p>End: {new Date(project.endDate).toLocaleDateString()}</p>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedProject(project)}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Files Tab */}
        {activeTab === 'files' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Project Files</h2>
            </div>
            
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">All Files</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded By</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {projects.flatMap(p => p.files.map(f => ({ ...f, projectName: p.name }))).map((file) => (
                      <tr key={file.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-600">{file.type}</span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{file.name}</div>
                              <div className="text-sm text-gray-500">v{file.version}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{file.projectName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{file.size}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{file.uploadedBy}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.uploadDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">Download</button>
                          <button className="text-gray-600 hover:text-gray-900">Share</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Team Tab */}
        {activeTab === 'team' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Project Team</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from(new Set(projects.flatMap(p => p.team.map(t => t.id)))).map(teamId => {
                const member = projects.flatMap(p => p.team).find(t => t.id === teamId)!;
                const memberProjects = projects.filter(p => p.team.some(t => t.id === teamId));
                
                return (
                  <div key={member.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="h-16 w-16 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-xl font-medium text-gray-700">{member.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                        <p className="text-sm text-gray-600">{member.role}</p>
                        <p className="text-sm text-blue-600">{member.email}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Active Projects</h4>
                      <div className="space-y-1">
                        {memberProjects.slice(0, 3).map((project) => (
                          <div key={project.id} className="text-sm text-gray-600">
                            • {project.name}
                          </div>
                        ))}
                        {memberProjects.length > 3 && (
                          <div className="text-sm text-gray-500">
                            +{memberProjects.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700">
                        Message
                      </button>
                      <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200">
                        Schedule Call
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Calendar Tab */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Project Calendar</h2>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="grid grid-cols-7 gap-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
                
                {/* Calendar days would be populated here */}
                {Array.from({ length: 35 }, (_, i) => {
                  const date = new Date(2024, 1, i - 3); // February 2024
                  const dayEvents = projects.flatMap(p => 
                    p.milestones.filter(m => 
                      new Date(m.dueDate).toDateString() === date.toDateString()
                    )
                  );
                  
                  return (
                    <div key={i} className="min-h-[80px] p-2 border border-gray-200">
                      <div className="text-sm text-gray-900 mb-1">{date.getDate()}</div>
                      {dayEvents.map((event) => (
                        <div key={event.id} className="text-xs bg-blue-100 text-blue-800 p-1 rounded mb-1 truncate">
                          {event.title}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Feedback Tab */}
        {activeTab === 'feedback' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Project Feedback</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">Feedback workflow component will be implemented here.</p>
            </div>
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">{selectedProject.name}</h3>
              <button 
                onClick={() => setSelectedProject(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Project Overview</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedProject.status)}`}>
                      {selectedProject.status.replace('-', ' ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Progress:</span>
                    <span className="ml-2">{selectedProject.progress}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Start Date:</span>
                    <span className="ml-2">{new Date(selectedProject.startDate).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">End Date:</span>
                    <span className="ml-2">{new Date(selectedProject.endDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Milestones</h4>
                <div className="space-y-2">
                  {selectedProject.milestones.map((milestone) => (
                    <div key={milestone.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium text-gray-900">{milestone.title}</div>
                        <div className="text-sm text-gray-600">{milestone.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Due: {new Date(milestone.dueDate).toLocaleDateString()}</div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(milestone.status)}`}>
                          {milestone.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Contact Team
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientPortal;
