"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Badge } from "../../components/ui/shadcn/badge";
import { Button } from "../../components/ui/shadcn/button";
import { SimpleDropdown, SimpleDropdownItem } from "../../components/ui/simple-dropdown";
import { ChatbotCreationModal, type ChatbotFormData } from "../../components/ui/chatbot-creation-modal";
import { ChatbotEmbedModal } from "../../components/ui/chatbot-embed-modal";
import { ChatbotPreviewModal } from "../../components/ui/chatbot-preview-modal";
import { ChatbotEditModal, type ChatbotEditData } from "../../components/ui/chatbot-edit-modal";

interface Chatbot {
  id: string;
  name: string;
  description: string;
  status: 'online' | 'offline';
  createdAt: Date;
  lastUpdated: Date;
  interactions: number;
  pagesCrawled: number;
  type: 'support' | 'sales' | 'general';
  url: string;
  greetingMessage: string;
  responseLength: 'short' | 'medium' | 'long';
  accentColor?: string;
  iconType?: 'robot' | 'dialog' | 'messages' | 'custom';
  position?: 'bottom-right' | 'bottom-left';
}

export default function Dashboard() {
  const [chatbots, setChatbots] = useState<Chatbot[]>([
    {
      id: "chatbot-1",
      name: "Rental Inquiry Assistant",
      description: "Answers questions about available properties and application process",
      status: "online",
      createdAt: new Date(2023, 6, 15),
      lastUpdated: new Date(2023, 8, 10),
      interactions: 1254,
      pagesCrawled: 72,
      type: "sales",
      url: "https://example.com/properties",
      greetingMessage: "Hi there! I can help you find the perfect rental property. What are you looking for today?",
      responseLength: "medium",
      accentColor: "#3B82F6",
      iconType: "robot",
      position: "bottom-right"
    },
    {
      id: "chatbot-2",
      name: "Maintenance Request Bot",
      description: "Handles tenant maintenance requests and scheduling",
      status: "offline",
      createdAt: new Date(2023, 7, 22),
      lastUpdated: new Date(2023, 9, 5),
      interactions: 872,
      pagesCrawled: 45,
      type: "support",
      url: "https://example.com/tenant-portal",
      greetingMessage: "Hello! I can help you submit a maintenance request or check the status of an existing one. How can I assist you today?",
      responseLength: "long",
      accentColor: "#10B981",
      iconType: "dialog",
      position: "bottom-left"
    }
  ]);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedChatbot, setSelectedChatbot] = useState<Chatbot | null>(null);
  
  const messagesUsed = 18;
  const messagesTotal = 25;
  const tenantsAssisted = 14;
  const propertiesListed = 8;
  const messagesPercentage = (messagesUsed / messagesTotal) * 100;
  
  const toggleStatus = (id: string) => {
    setChatbots(prev => prev.map(bot => {
      if (bot.id === id) {
        return {
          ...bot,
          status: bot.status === 'online' ? 'offline' : 'online',
          lastUpdated: new Date()
        };
      }
      return bot;
    }));
  };
  
  const deleteChatbot = (id: string) => {
    if (window.confirm("Are you sure you want to delete this chatbot?")) {
      setChatbots(prev => prev.filter(bot => bot.id !== id));
    }
  };
  
  const handleCreateChatbot = (data: ChatbotFormData) => {
    const newChatbot: Chatbot = {
      id: `chatbot-${Date.now()}`,
      name: data.name,
      description: "",
      status: "online",
      createdAt: new Date(),
      lastUpdated: new Date(),
      interactions: 0,
      pagesCrawled: 0,
      type: "general",
      url: data.url,
      greetingMessage: data.greetingMessage || "Hello! How can I help you with your property management needs today?",
      responseLength: data.responseLength,
      accentColor: "#3B82F6",
      iconType: "robot",
      position: "bottom-right"
    };
    
    setChatbots(prev => [...prev, newChatbot]);
    setIsCreateModalOpen(false);
  };
  
  const handleEmbedChatbot = (chatbot: Chatbot) => {
    setSelectedChatbot(chatbot);
    setIsEmbedModalOpen(true);
  };
  
  const handlePreviewChatbot = (chatbot: Chatbot) => {
    setSelectedChatbot(chatbot);
    setIsPreviewModalOpen(true);
  };
  
  const handleEditChatbot = (chatbot: Chatbot) => {
    setSelectedChatbot(chatbot);
    setIsEditModalOpen(true);
  };
  
  const handleSaveEdit = (data: ChatbotEditData) => {
    setChatbots(prev => prev.map(bot => 
      bot.id === data.id 
        ? { 
            ...bot, 
            name: data.name, 
            description: data.description,
            greetingMessage: data.greetingMessage,
            responseLength: data.responseLength,
            type: data.type,
            accentColor: data.accentColor,
            iconType: data.iconType,
            position: data.position,
            lastUpdated: new Date()
          } 
        : bot
    ));
    
    // Here you would make an API call to update the chatbot on the backend
    console.log("Updating chatbot:", data);
  };
  
  const getBotTypeLabel = (type: string) => {
    switch (type) {
      case 'support':
        return 'Tenant Support';
      case 'sales':
        return 'Rental Inquiries';
      case 'general':
      default:
        return 'General';
    }
  };
  
  const getResponseLengthLabel = (length: string) => {
    switch (length) {
      case 'short':
        return 'Short';
      case 'medium':
        return 'Medium';
      case 'long':
        return 'Long';
      default:
        return 'Medium';
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Property Management Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your property chatbots and track tenant interactions
          </p>
        </div>
        <div className="mt-4 lg:mt-0">
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14"></path>
            </svg>
            New Property Bot
          </Button>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-center justify-center gap-12">
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Chatbots
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {chatbots.length}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              active bots
            </p>
          </div>

          <div className="hidden sm:block w-px h-16 bg-gray-200 dark:bg-gray-700"></div>

          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Plan
            </p>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Free Trial
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              7 days remaining
            </p>
          </div>
        </div>
      </div>
      
      {/* Chatbots Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Bot Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Pages Crawled
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {chatbots.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    <p className="text-base font-medium mb-1">No chatbots yet</p>
                    <p className="text-sm mb-4">Create your first chatbot to get started</p>
                    <Button
                      onClick={() => setIsCreateModalOpen(true)}
                      variant="outline"
                      className="mx-auto"
                    >
                      Create Property Bot
                    </Button>
                  </td>
                </tr>
              ) : (
                chatbots.map((chatbot) => (
                  <tr key={chatbot.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-md flex items-center justify-center ${
                          chatbot.type === 'sales' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 
                          chatbot.type === 'support' ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 
                          'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                          {chatbot.type === 'sales' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                              <polyline points="9 22 9 12 15 12 15 22"></polyline>
                            </svg>
                          ) : chatbot.type === 'support' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                              <line x1="3" y1="9" x2="21" y2="9"></line>
                              <line x1="9" y1="21" x2="9" y2="9"></line>
                            </svg>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">{chatbot.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Created {chatbot.createdAt.toLocaleDateString()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={chatbot.status === 'online' ? 'success' : 'secondary'}
                        >
                          {chatbot.status === 'online' ? 'Online' : 'Offline'}
                        </Badge>
                        <button
                          onClick={() => toggleStatus(chatbot.id)}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {chatbot.status === 'online' ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900 dark:text-gray-100">{chatbot.pagesCrawled}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900 dark:text-gray-100">{getBotTypeLabel(chatbot.type)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <SimpleDropdown
                          trigger={
                            <Button variant="outline" size="sm">
                              Actions
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                              </svg>
                            </Button>
                          }
                          align="right"
                        >
                          <SimpleDropdownItem onClick={() => handleEditChatbot(chatbot)}>
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 20h9"></path>
                                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                              </svg>
                              <span>Edit</span>
                            </div>
                          </SimpleDropdownItem>
                          <SimpleDropdownItem onClick={() => handlePreviewChatbot(chatbot)}>
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                              </svg>
                              <span>Preview</span>
                            </div>
                          </SimpleDropdownItem>
                          <SimpleDropdownItem onClick={() => handleEmbedChatbot(chatbot)}>
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m8 3 4 8 5-5 5 15H2L8 3z"></path>
                              </svg>
                              <span>Embed</span>
                            </div>
                          </SimpleDropdownItem>
                          <SimpleDropdownItem onClick={() => deleteChatbot(chatbot.id)} className="text-red-600 dark:text-red-400">
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-red-500 dark:text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                              </svg>
                              <span>Delete</span>
                            </div>
                          </SimpleDropdownItem>
                        </SimpleDropdown>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Modals */}
      <ChatbotCreationModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateChatbot}
      />
      
      {selectedChatbot && (
        <>
          <ChatbotEmbedModal 
            isOpen={isEmbedModalOpen}
            onClose={() => setIsEmbedModalOpen(false)}
            chatbotId={selectedChatbot.id}
            chatbotName={selectedChatbot.name}
          />
          
          <ChatbotPreviewModal 
            isOpen={isPreviewModalOpen}
            onClose={() => setIsPreviewModalOpen(false)}
            chatbotId={selectedChatbot.id}
            chatbotName={selectedChatbot.name}
          />
          
          <ChatbotEditModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSubmit={handleSaveEdit}
            chatbot={selectedChatbot}
          />
        </>
      )}
    </div>
  );
}
