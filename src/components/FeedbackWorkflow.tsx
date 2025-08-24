'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, CheckCircle, XCircle, Clock, AlertCircle, ThumbsUp, ThumbsDown, Edit, Reply, Send } from 'lucide-react';

interface FeedbackItem {
  id: string;
  projectId: string;
  projectName: string;
  type: 'comment' | 'approval' | 'revision' | 'question';
  message: string;
  author: string;
  authorRole: 'client' | 'team';
  timestamp: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  attachments: Attachment[];
  replies: Reply[];
  assignee?: string;
  dueDate?: string;
  tags: string[];
}

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: string;
  url: string;
}

interface Reply {
  id: string;
  message: string;
  author: string;
  authorRole: 'client' | 'team';
  timestamp: string;
  isInternal: boolean;
}

const FeedbackWorkflow: React.FC = () => {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<FeedbackItem | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [replyText, setReplyText] = useState('');

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockFeedback: FeedbackItem[] = [
      {
        id: '1',
        projectId: '1',
        projectName: 'Website Redesign',
        type: 'approval',
        message: 'The new design looks great! I love the modern layout and color scheme. Ready to move forward with development.',
        author: 'John Smith',
        authorRole: 'client',
        timestamp: '2024-01-29 14:30',
        status: 'resolved',
        priority: 'high',
        attachments: [
          { id: '1', name: 'design_approval.pdf', type: 'PDF', size: '2.1 MB', url: '#' }
        ],
        replies: [
          {
            id: '1',
            message: 'Excellent! We\'ll proceed with development. Expect the first build in 2 weeks.',
            author: 'Sarah Johnson',
            authorRole: 'team',
            timestamp: '2024-01-29 15:00',
            isInternal: false
          }
        ],
        tags: ['Design', 'Approval', 'Development']
      },
      {
        id: '2',
        projectId: '1',
        projectName: 'Website Redesign',
        type: 'revision',
        message: 'The contact form needs some adjustments. Can we make the fields larger and add validation messages?',
        author: 'John Smith',
        authorRole: 'client',
        timestamp: '2024-01-28 10:15',
        status: 'in-progress',
        priority: 'medium',
        attachments: [
          { id: '2', name: 'contact_form_screenshot.png', type: 'PNG', size: '890 KB', url: '#' }
        ],
        replies: [
          {
            id: '2',
            message: 'I\'ll update the contact form with larger fields and better validation. Should have this ready by tomorrow.',
            author: 'Alex Rodriguez',
            authorRole: 'team',
            timestamp: '2024-01-28 11:00',
            isInternal: false
          }
        ],
        tags: ['Form', 'UI', 'Validation']
      },
      {
        id: '3',
        projectId: '2',
        projectName: 'Marketing Campaign',
        type: 'question',
        message: 'What\'s the timeline for the content creation phase? Need to coordinate with our internal team.',
        author: 'Jane Doe',
        authorRole: 'client',
        timestamp: '2024-01-27 16:45',
        status: 'pending',
        priority: 'low',
        attachments: [],
        replies: [],
        tags: ['Timeline', 'Content', 'Planning']
      }
    ];
    setFeedbackItems(mockFeedback);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'approval': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'revision': return <Edit className="h-5 w-5 text-yellow-500" />;
      case 'question': return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'comment': return <MessageSquare className="h-5 w-5 text-gray-500" />;
      default: return <MessageSquare className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredFeedback = feedbackItems.filter(item => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesSearch = item.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  const handleCreateFeedback = (feedbackData: Partial<FeedbackItem>) => {
    const newFeedback: FeedbackItem = {
      id: Date.now().toString(),
      projectId: feedbackData.projectId || '',
      projectName: feedbackData.projectName || '',
      type: feedbackData.type || 'comment',
      message: feedbackData.message || '',
      author: 'Client', // This would come from user context
      authorRole: 'client',
      timestamp: new Date().toISOString(),
      status: 'pending',
      priority: feedbackData.priority || 'medium',
      attachments: feedbackData.attachments || [],
      replies: [],
      tags: feedbackData.tags || []
    };
    setFeedbackItems(prev => [newFeedback, ...prev]);
    setShowCreateModal(false);
  };

  const handleUpdateStatus = (itemId: string, newStatus: FeedbackItem['status']) => {
    setFeedbackItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, status: newStatus } : item
    ));
  };

  const handleAddReply = (itemId: string, message: string) => {
    if (!message.trim()) return;
    
    const newReply: Reply = {
      id: Date.now().toString(),
      message,
      author: 'Client', // This would come from user context
      authorRole: 'client',
      timestamp: new Date().toISOString(),
      isInternal: false
    };

    setFeedbackItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, replies: [...item.replies, newReply] }
        : item
    ));
    setReplyText('');
  };

  const handleApprove = (itemId: string) => {
    handleUpdateStatus(itemId, 'resolved');
  };

  const handleReject = (itemId: string) => {
    handleUpdateStatus(itemId, 'rejected');
  };

  const handleRequestRevision = (itemId: string) => {
    handleUpdateStatus(itemId, 'in-progress');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Feedback & Approvals</h2>
          <p className="text-gray-600">Review, approve, and provide feedback on project deliverables</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <MessageSquare className="h-4 w-4" />
          <span>New Feedback</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search feedback..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Types</option>
          <option value="approval">Approval</option>
          <option value="revision">Revision</option>
          <option value="question">Question</option>
          <option value="comment">Comment</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredFeedback.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                {getTypeIcon(item.type)}
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{item.projectName}</h3>
                  <p className="text-sm text-gray-600">by {item.author} • {new Date(item.timestamp).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                  {item.status.replace('-', ' ')}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(item.priority)}`}>
                  {item.priority}
                </span>
              </div>
            </div>

            {/* Message */}
            <div className="mb-4">
              <p className="text-gray-700">{item.message}</p>
            </div>

            {/* Tags */}
            {item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {item.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Attachments */}
            {item.attachments.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Attachments</h4>
                <div className="flex flex-wrap gap-2">
                  {item.attachments.map((attachment) => (
                    <a
                      key={attachment.id}
                      href={attachment.url}
                      className="flex items-center space-x-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 text-sm text-gray-700"
                    >
                      <span>📎</span>
                      <span>{attachment.name}</span>
                      <span className="text-gray-500">({attachment.size})</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Replies */}
            {item.replies.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Replies</h4>
                <div className="space-y-3">
                  {item.replies.map((reply) => (
                    <div key={reply.id} className={`p-3 rounded-lg ${
                      reply.authorRole === 'client' ? 'bg-blue-50 border-l-4 border-blue-400' : 'bg-gray-50 border-l-4 border-gray-400'
                    }`}>
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-sm text-gray-900">{reply.author}</span>
                        <span className="text-xs text-gray-500">{new Date(reply.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-gray-700">{reply.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="flex space-x-2">
                {item.status === 'pending' && item.type === 'approval' && (
                  <>
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleReject(item.id)}
                      className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                    >
                      <ThumbsDown className="h-4 w-4" />
                      <span>Reject</span>
                    </button>
                  </>
                )}
                {item.status === 'pending' && item.type === 'revision' && (
                  <button
                    onClick={() => handleRequestRevision(item.id)}
                    className="flex items-center space-x-2 px-3 py-2 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Start Revision</span>
                  </button>
                )}
                {item.status === 'in-progress' && (
                  <button
                    onClick={() => handleUpdateStatus(item.id, 'resolved')}
                    className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Mark Resolved</span>
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedItem(item)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View Details
                </button>
                <button
                  onClick={() => setSelectedItem(item)}
                  className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                >
                  Reply
                </button>
              </div>
            </div>

            {/* Quick Reply */}
            <div className="mt-4 pt-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Add a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => handleAddReply(item.id, replyText)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Feedback Modal */}
      {showCreateModal && (
        <CreateFeedbackModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateFeedback}
        />
      )}

      {/* Feedback Detail Modal */}
      {selectedItem && (
        <FeedbackDetailModal
          feedback={selectedItem}
          onClose={() => setSelectedItem(null)}
          onStatusUpdate={handleUpdateStatus}
          onAddReply={handleAddReply}
        />
      )}
    </div>
  );
};

// Modal Components
const CreateFeedbackModal: React.FC<{
  onClose: () => void;
  onSubmit: (data: Partial<FeedbackItem>) => void;
}> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    projectName: '',
    type: 'comment' as FeedbackItem['type'],
    message: '',
    priority: 'medium' as FeedbackItem['priority'],
    tags: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Create New Feedback</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <input
              type="text"
              required
              value={formData.projectName}
              onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as FeedbackItem['type'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="comment">Comment</option>
                <option value="approval">Approval</option>
                <option value="revision">Revision</option>
                <option value="question">Question</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as FeedbackItem['priority'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="Design, UI, Feedback"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const FeedbackDetailModal: React.FC<{
  feedback: FeedbackItem;
  onClose: () => void;
  onStatusUpdate: (itemId: string, status: FeedbackItem['status']) => void;
  onAddReply: (itemId: string, message: string) => void;
}> = ({ feedback, onClose, onStatusUpdate, onAddReply }) => {
  const [replyText, setReplyText] = useState('');

  const handleSubmitReply = () => {
    if (replyText.trim()) {
      onAddReply(feedback.id, replyText);
      setReplyText('');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Feedback Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Feedback Header */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-gray-900">{feedback.projectName}</h4>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(feedback.status)}`}>
                  {feedback.status.replace('-', ' ')}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(feedback.priority)}`}>
                  {feedback.priority}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600">by {feedback.author} • {new Date(feedback.timestamp).toLocaleString()}</p>
          </div>

          {/* Message */}
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Message</h5>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{feedback.message}</p>
          </div>

          {/* Attachments */}
          {feedback.attachments.length > 0 && (
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Attachments</h5>
              <div className="space-y-2">
                {feedback.attachments.map((attachment) => (
                  <a
                    key={attachment.id}
                    href={attachment.url}
                    className="flex items-center space-x-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 text-sm text-gray-700"
                  >
                    <span>📎</span>
                    <span>{attachment.name}</span>
                    <span className="text-gray-500">({attachment.size})</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Replies */}
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Replies</h5>
            <div className="space-y-3">
              {feedback.replies.map((reply) => (
                <div key={reply.id} className={`p-3 rounded-lg ${
                  reply.authorRole === 'client' ? 'bg-blue-50 border-l-4 border-blue-400' : 'bg-gray-50 border-l-4 border-gray-400'
                }`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-sm text-gray-900">{reply.author}</span>
                    <span className="text-xs text-gray-500">{new Date(reply.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-700">{reply.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Add Reply */}
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Add Reply</h5>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Type your reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSubmitReply}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end pt-4 border-t mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper functions for the modal
const getStatusColor = (status: string) => {
  switch (status) {
    case 'resolved': return 'text-green-600 bg-green-100';
    case 'in-progress': return 'text-blue-600 bg-blue-100';
    case 'pending': return 'text-yellow-600 bg-yellow-100';
    case 'rejected': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'text-red-600 bg-red-100';
    case 'medium': return 'text-yellow-600 bg-yellow-100';
    case 'low': return 'text-green-600 bg-green-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

export default FeedbackWorkflow;
