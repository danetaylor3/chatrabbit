"use client";

import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface ChatbotCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ChatbotFormData) => void;
}

export interface ChatbotFormData {
  name: string;
  url: string;
  ignoreUrls: string;
  greetingMessage: string;
  responseLength: 'short' | 'medium' | 'long';
}

export const ChatbotCreationModal = ({ isOpen, onClose, onSubmit }: ChatbotCreationModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [formData, setFormData] = useState<ChatbotFormData>({
    name: '',
    url: '',
    ignoreUrls: '',
    greetingMessage: 'Hi there! How can I help you today?',
    responseLength: 'medium',
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.url) {
      alert('Please fill in the required fields');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate web scraping progress
    const interval = setInterval(() => {
      setCurrentProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 500);
    
    // Simulate API call to create chatbot
    setTimeout(() => {
      clearInterval(interval);
      setCurrentProgress(100);
      
      // Call the onSubmit prop with the form data
      onSubmit(formData);
      
      // Reset form and close modal
      setTimeout(() => {
        setIsLoading(false);
        setCurrentProgress(0);
        onClose();
      }, 1000);
    }, 5000);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-100"
                  >
                    Create New Chatbot
                  </Dialog.Title>
                  
                  <button
                    onClick={onClose}
                    className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6 6 18"></path>
                      <path d="m6 6 12 12"></path>
                    </svg>
                  </button>
                </div>

                {isLoading ? (
                  <div className="py-6 space-y-4">
                    <p className="text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                      {currentProgress < 100 
                        ? 'Training your chatbot...' 
                        : 'Chatbot created successfully!'}
                    </p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                        style={{ width: `${currentProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                      {currentProgress < 100 
                        ? `Scraping website data... ${currentProgress}%` 
                        : 'Redirecting to dashboard...'}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Chatbot Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter a name for your chatbot"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Knowledge Base URL *
                        </label>
                        <input
                          type="url"
                          id="url"
                          name="url"
                          value={formData.url}
                          onChange={handleInputChange}
                          placeholder="https://example.com"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          We'll scan this website to train your chatbot
                        </p>
                      </div>
                      
                      <div>
                        <label htmlFor="ignoreUrls" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Ignore URLs (optional)
                        </label>
                        <input
                          type="text"
                          id="ignoreUrls"
                          name="ignoreUrls"
                          value={formData.ignoreUrls}
                          onChange={handleInputChange}
                          placeholder="login, admin, cart (comma separated)"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="greetingMessage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Greeting Message
                        </label>
                        <input
                          type="text"
                          id="greetingMessage"
                          name="greetingMessage"
                          value={formData.greetingMessage}
                          onChange={handleInputChange}
                          placeholder="Hi there! How can I help you today?"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="responseLength" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Chatbot Response Length
                        </label>
                        <select
                          id="responseLength"
                          name="responseLength"
                          value={formData.responseLength}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="short">Short</option>
                          <option value="medium">Medium</option>
                          <option value="long">Long</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-2">
                      <button
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={onClose}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Create Chatbot
                      </button>
                    </div>
                  </form>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}; 