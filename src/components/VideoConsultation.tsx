'use client';

import { useState, useEffect } from 'react';
import { Video, Phone, Calendar, Users, Clock, CheckCircle, ExternalLink, Copy, Share2 } from 'lucide-react';

interface VideoMeeting {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  platform: 'zoom' | 'teams' | 'google-meet';
  meetingUrl: string;
  meetingId: string;
  password?: string;
  host: string;
  attendees: string[];
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
}

interface PlatformConfig {
  id: 'zoom' | 'teams' | 'google-meet';
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  features: string[];
}

const platforms: PlatformConfig[] = [
  {
    id: 'zoom',
    name: 'Zoom',
    description: 'High-quality video conferencing with screen sharing',
    icon: Video,
    color: 'bg-blue-500',
    features: ['HD Video', 'Screen Sharing', 'Recording', 'Breakout Rooms']
  },
  {
    id: 'teams',
    name: 'Microsoft Teams',
    description: 'Professional collaboration platform with chat',
    icon: Users,
    color: 'bg-purple-500',
    features: ['Video Calls', 'Chat Integration', 'File Sharing', 'Calendar Sync']
  },
  {
    id: 'google-meet',
    name: 'Google Meet',
    description: 'Simple and reliable video meetings',
    icon: Calendar,
    color: 'bg-green-500',
    features: ['Easy Access', 'Live Captions', 'Screen Sharing', 'Mobile App']
  }
];

export default function VideoConsultation() {
  const [selectedPlatform, setSelectedPlatform] = useState<'zoom' | 'teams' | 'google-meet'>('zoom');
  const [meetings, setMeetings] = useState<VideoMeeting[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<VideoMeeting | null>(null);

  // Generate sample meetings
  useEffect(() => {
    const sampleMeetings: VideoMeeting[] = [
      {
        id: '1',
        title: 'MMA Strategy Consultation',
        description: 'Discuss your marketing strategy and business goals',
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '14:00',
        duration: 60,
        platform: 'zoom',
        meetingUrl: 'https://zoom.us/j/123456789',
        meetingId: '123 456 789',
        password: 'mma2025',
        host: 'John Smith',
        attendees: ['john@mma.com', 'client@example.com'],
        status: 'scheduled'
      },
      {
        id: '2',
        title: 'Campaign Review Session',
        description: 'Review current campaign performance and optimization',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '10:00',
        duration: 45,
        platform: 'teams',
        meetingUrl: 'https://teams.microsoft.com/l/meetup-join/...',
        meetingId: 'Teams Meeting',
        host: 'Sarah Johnson',
        attendees: ['sarah@mma.com', 'marketing@example.com'],
        status: 'scheduled'
      }
    ];
    setMeetings(sampleMeetings);
  }, []);

  const handleCreateMeeting = async () => {
    setIsCreating(true);
    
    // Simulate API call to create meeting
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newMeeting: VideoMeeting = {
      id: Date.now().toString(),
      title: 'New MMA Consultation',
      description: 'Custom consultation meeting',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '15:00',
      duration: 60,
      platform: selectedPlatform,
      meetingUrl: generateMeetingUrl(selectedPlatform),
      meetingId: generateMeetingId(selectedPlatform),
      password: selectedPlatform === 'zoom' ? generatePassword() : undefined,
      host: 'MMA Team',
      attendees: [],
      status: 'scheduled'
    };
    
    setMeetings(prev => [newMeeting, ...prev]);
    setIsCreating(false);
  };

  const generateMeetingUrl = (platform: string): string => {
    switch (platform) {
      case 'zoom':
        return 'https://zoom.us/j/987654321';
      case 'teams':
        return 'https://teams.microsoft.com/l/meetup-join/...';
      case 'google-meet':
        return 'https://meet.google.com/abc-defg-hij';
      default:
        return '#';
    }
  };

  const generateMeetingId = (platform: string): string => {
    switch (platform) {
      case 'zoom':
        return '987 654 321';
      case 'teams':
        return 'Teams Meeting';
      case 'google-meet':
        return 'abc-defg-hij';
      default:
        return 'N/A';
    }
  };

  const generatePassword = (): string => {
    return Math.random().toString(36).substring(2, 6).toUpperCase();
  };

  const handleJoinMeeting = (meeting: VideoMeeting) => {
    setSelectedMeeting(meeting);
    setShowJoinModal(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderPlatformSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Video Platform</h3>
        <p className="text-gray-600">Select your preferred video conferencing platform</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-4">
        {platforms.map((platform) => {
          const IconComponent = platform.icon;
          const isSelected = selectedPlatform === platform.id;
          
          return (
            <button
              key={platform.id}
              onClick={() => setSelectedPlatform(platform.id)}
              className={`p-6 border-2 rounded-xl transition-all duration-300 text-left ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${platform.color} text-white`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">{platform.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{platform.description}</p>
                  <ul className="space-y-1">
                    {platform.features.map((feature, index) => (
                      <li key={index} className="text-xs text-gray-500 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                {isSelected && (
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                )}
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="text-center">
        <button
          onClick={handleCreateMeeting}
          disabled={isCreating}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center mx-auto"
        >
          {isCreating ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              Create New Meeting
              <Video className="w-4 h-4 ml-2" />
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderMeetingsList = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Video Meetings</h3>
        <p className="text-gray-600">Manage and join your scheduled consultations</p>
      </div>
      
      {meetings.length === 0 ? (
        <div className="text-center py-12">
          <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No meetings scheduled</h3>
          <p className="text-gray-500">Create your first video consultation meeting</p>
        </div>
      ) : (
        <div className="space-y-4">
          {meetings.map((meeting) => {
            const platform = platforms.find(p => p.id === meeting.platform);
            const IconComponent = platform?.icon || Video;
            
            return (
              <div key={meeting.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${platform?.color} text-white`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <h4 className="font-semibold text-gray-900">{meeting.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
                        {meeting.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{meeting.description}</p>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(meeting.date)} at {meeting.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {meeting.duration} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {meeting.attendees.length} attendees
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleJoinMeeting(meeting)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Video className="w-4 h-4" />
                      Join
                    </button>
                    <button
                      onClick={() => copyToClipboard(meeting.meetingUrl)}
                      className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                      title="Copy meeting link"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {meeting.password && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Meeting Password:</span>
                      <div className="flex items-center gap-2">
                        <code className="bg-white px-2 py-1 rounded text-sm font-mono">{meeting.password}</code>
                        <button
                          onClick={() => copyToClipboard(meeting.password!)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderJoinModal = () => {
    if (!selectedMeeting || !showJoinModal) return null;
    
    const platform = platforms.find(p => p.id === selectedMeeting.platform);
    const IconComponent = platform?.icon || Video;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6">
          <div className="text-center mb-6">
            <div className={`w-16 h-16 ${platform?.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <IconComponent className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Join Meeting</h3>
            <p className="text-gray-600">{selectedMeeting.title}</p>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Platform:</span>
              <span className="font-medium">{platform?.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{formatDate(selectedMeeting.date)} at {selectedMeeting.time}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium">{selectedMeeting.duration} minutes</span>
            </div>
            {selectedMeeting.password && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Password:</span>
                <span className="font-medium font-mono">{selectedMeeting.password}</span>
              </div>
            )}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowJoinModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                window.open(selectedMeeting.meetingUrl, '_blank');
                setShowJoinModal(false);
              }}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Join Now
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-12">
      {renderPlatformSelection()}
      {renderMeetingsList()}
      {renderJoinModal()}
    </div>
  );
}
