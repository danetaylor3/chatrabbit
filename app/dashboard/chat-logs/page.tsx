"use client";

import React, { useState } from "react";
import { Badge } from "../../../components/ui/shadcn/badge";
import { Button } from "../../../components/ui/shadcn/button";
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface Conversation {
  id: string;
  chatbotId: string;
  chatbotName: string;
  userQuery: string;
  aiResponse: string;
  timestamp: Date;
  feedback?: 'positive' | 'negative';
}

export default function ChatLogsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "conv1",
      chatbotId: "chatbot-1",
      chatbotName: "Help Center Assistant",
      userQuery: "How do I reset my password?",
      aiResponse: "To reset your password, please click on the 'Forgot Password' link on the login page. You'll receive an email with instructions to create a new password.",
      timestamp: new Date('2023-11-01T14:32:00'),
      feedback: 'positive',
    },
    {
      id: "conv2",
      chatbotId: "chatbot-1",
      chatbotName: "Help Center Assistant",
      userQuery: "Where can I download the mobile app?",
      aiResponse: "Our mobile app is available on both iOS and Android platforms. You can download it from the Apple App Store or Google Play Store by searching for 'ChatRabbit'.",
      timestamp: new Date('2023-11-01T13:18:00'),
    },
    {
      id: "conv3",
      chatbotId: "chatbot-2",
      chatbotName: "Sales Assistant",
      userQuery: "What's included in the Pro plan?",
      aiResponse: "The Pro plan includes all features from the Basic plan plus advanced analytics, lead capture, API access, and up to 5 chatbots. You also get priority support and custom branding options.",
      timestamp: new Date('2023-11-01T11:45:00'),
      feedback: 'positive',
    },
    {
      id: "conv4",
      chatbotId: "chatbot-2",
      chatbotName: "Sales Assistant",
      userQuery: "Do you offer a free trial?",
      aiResponse: "Yes, we offer a 14-day free trial of our Pro plan with no credit card required. You can upgrade anytime during or after the trial period to continue using premium features.",
      timestamp: new Date('2023-11-01T10:22:00'),
      feedback: 'negative',
    },
  ]);
  
  const [selectedChatbot, setSelectedChatbot] = useState<string>('all');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  
  const filteredConversations = selectedChatbot === 'all' 
    ? conversations 
    : conversations.filter(conv => conv.chatbotId === selectedChatbot);
  
  const chatbots = Array.from(new Set(conversations.map(conv => conv.chatbotId)))
    .map(id => {
      const conv = conversations.find(c => c.chatbotId === id);
      return {
        id,
        name: conv?.chatbotName || 'Unknown Chatbot'
      };
    });

  const viewConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Chat Logs
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            View conversation history and monitor chatbot interactions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Filter by chatbot:</span>
          <select
            value={selectedChatbot}
            onChange={(e) => setSelectedChatbot(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-1.5 text-sm"
          >
            <option value="all">All Chatbots</option>
            {chatbots.map(bot => (
              <option key={bot.id} value={bot.id}>{bot.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Conversations</p>
              <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mt-1">{conversations.length}</p>
            </div>
            <div className="rounded-full p-2 bg-blue-100 dark:bg-blue-900/50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Chatbots</p>
              <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mt-1">{chatbots.length}</p>
            </div>
            <div className="rounded-full p-2 bg-blue-100 dark:bg-blue-900/50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9"></path>
                <circle cx="18" cy="5" r="3"></circle>
                <rect x="2" y="14" width="6" height="8" rx="1"></rect>
                <path d="M14 14v4a1 1 0 0 0 1 1h1"></path>
                <path d="M18 19h1a1 1 0 0 0 1-1v-1"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Satisfaction Rate</p>
              <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mt-1">
                {(() => {
                  const withFeedback = conversations.filter(c => c.feedback);
                  const positive = conversations.filter(c => c.feedback === 'positive').length;
                  return withFeedback.length > 0 
                    ? Math.round((positive / withFeedback.length) * 100) + '%'
                    : 'N/A';
                })()}
              </p>
            </div>
            <div className="rounded-full p-2 bg-blue-100 dark:bg-blue-900/50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Based on user feedback</p>
        </div>
      </div>
      
      {/* Conversations Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Chatbot
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User Query
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  AI Response
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Feedback
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredConversations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    <p className="text-base font-medium mb-1">No conversations yet</p>
                    <p className="text-sm">Conversations will appear here once users start interacting with your chatbots</p>
                  </td>
                </tr>
              ) : (
                filteredConversations.map((conversation) => (
                  <tr key={conversation.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {conversation.chatbotName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-gray-100 line-clamp-2">
                        {conversation.userQuery}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-gray-100 line-clamp-2">
                        {conversation.aiResponse}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {conversation.timestamp.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {conversation.feedback ? (
                        <Badge
                          variant={conversation.feedback === 'positive' ? 'success' : 'danger'}
                        >
                          {conversation.feedback === 'positive' ? 'Positive' : 'Negative'}
                        </Badge>
                      ) : (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          No feedback
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => viewConversation(conversation)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <Button variant="outline">
          Export Logs
        </Button>
      </div>

      {/* Conversation Detail Modal */}
      <Transition appear show={!!selectedConversation} as={Fragment}>
        <Dialog 
          as="div" 
          className="relative z-50" 
          onClose={() => setSelectedConversation(null)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25 dark:bg-black/40" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-100"
                    >
                      Conversation Details
                    </Dialog.Title>
                    
                    <button
                      onClick={() => setSelectedConversation(null)}
                      className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18"></path>
                        <path d="m6 6 12 12"></path>
                      </svg>
                    </button>
                  </div>

                  {selectedConversation && (
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Chatbot:</span>
                          <span className="ml-2 text-gray-900 dark:text-gray-100">{selectedConversation.chatbotName}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Time:</span>
                          <span className="ml-2 text-gray-900 dark:text-gray-100">{selectedConversation.timestamp.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4 border border-blue-100 dark:border-blue-800">
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">User Query:</div>
                        <div className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">{selectedConversation.userQuery}</div>
                      </div>
                      
                      <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4 border border-green-100 dark:border-green-800">
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">AI Response:</div>
                        <div className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">{selectedConversation.aiResponse}</div>
                      </div>
                      
                      {selectedConversation.feedback && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">User Feedback:</span>
                          <Badge
                            variant={selectedConversation.feedback === 'positive' ? 'success' : 'danger'}
                          >
                            {selectedConversation.feedback === 'positive' ? 'Positive' : 'Negative'}
                          </Badge>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-6 flex justify-end">
                    <Button onClick={() => setSelectedConversation(null)}>
                      Close
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
} 