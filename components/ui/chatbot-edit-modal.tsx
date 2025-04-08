"use client";

import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Button } from './shadcn/button';

interface ChatbotEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ChatbotEditData) => void;
  chatbot: {
    id: string;
    name: string;
    description: string;
    greetingMessage: string;
    responseLength: 'short' | 'medium' | 'long';
    type: 'support' | 'sales' | 'general';
    accentColor?: string;
    iconType?: 'robot' | 'dialog' | 'messages' | 'custom';
    position?: 'bottom-right' | 'bottom-left';
  };
}

export interface ChatbotEditData {
  id: string;
  name: string;
  description: string;
  greetingMessage: string;
  responseLength: 'short' | 'medium' | 'long';
  type: 'support' | 'sales' | 'general';
  accentColor: string;
  iconType: 'robot' | 'dialog' | 'messages' | 'custom';
  position: 'bottom-right' | 'bottom-left';
}

export const ChatbotEditModal = ({ isOpen, onClose, onSubmit, chatbot }: ChatbotEditModalProps) => {
  const [formData, setFormData] = useState<ChatbotEditData>({
    id: chatbot.id,
    name: chatbot.name,
    description: chatbot.description,
    greetingMessage: chatbot.greetingMessage || 'Hi there! How can I help you today?',
    responseLength: chatbot.responseLength || 'medium',
    type: chatbot.type || 'general',
    accentColor: chatbot.accentColor || '#3B82F6',
    iconType: chatbot.iconType || 'robot',
    position: chatbot.position || 'bottom-right'
  });

  const [activeTab, setActiveTab] = useState<'basic' | 'appearance'>('basic');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (color: string) => {
    setFormData(prev => ({ ...prev, accentColor: color }));
  };

  const handleIconTypeChange = (iconType: 'robot' | 'dialog' | 'messages' | 'custom') => {
    setFormData(prev => ({ ...prev, iconType }));
  };

  const handlePositionChange = (position: 'bottom-right' | 'bottom-left') => {
    setFormData(prev => ({ ...prev, position }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const predefinedColors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#000000', // Black
  ];

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
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-100"
                  >
                    Edit Chatbot
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

                {/* Tabs */}
                <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setActiveTab('basic')}
                      className={`pb-2 px-1 ${activeTab === 'basic' ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
                    >
                      Basic Information
                    </button>
                    <button
                      onClick={() => setActiveTab('appearance')}
                      className={`pb-2 px-1 ${activeTab === 'appearance' ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
                    >
                      Appearance
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  {activeTab === 'basic' && (
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
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="greetingMessage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Greeting Message
                        </label>
                        <textarea
                          id="greetingMessage"
                          name="greetingMessage"
                          value={formData.greetingMessage}
                          onChange={handleInputChange}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Chatbot Type
                        </label>
                        <select
                          id="type"
                          name="type"
                          value={formData.type}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="general">General</option>
                          <option value="support">Customer Support</option>
                          <option value="sales">Sales</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="responseLength" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Response Length
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
                  )}

                  {activeTab === 'appearance' && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Accent Color
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {predefinedColors.map(color => (
                            <button
                              key={color}
                              type="button"
                              className={`w-8 h-8 rounded-full border-2 ${formData.accentColor === color ? 'border-gray-400 dark:border-gray-300' : 'border-transparent'}`}
                              style={{ backgroundColor: color }}
                              onClick={() => handleColorChange(color)}
                              aria-label={`Select color ${color}`}
                            />
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <label htmlFor="customColor" className="text-xs text-gray-500 dark:text-gray-400">
                            Custom:
                          </label>
                          <input
                            type="color"
                            id="customColor"
                            value={formData.accentColor}
                            onChange={(e) => handleColorChange(e.target.value)}
                            className="w-8 h-8 p-0 border-0 rounded-md cursor-pointer"
                          />
                          <input
                            type="text"
                            value={formData.accentColor}
                            onChange={(e) => handleColorChange(e.target.value)}
                            className="w-24 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            placeholder="#000000"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Icon Type
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          <button
                            type="button"
                            onClick={() => handleIconTypeChange('robot')}
                            className={`p-2 border rounded-md flex flex-col items-center ${formData.iconType === 'robot' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect width="18" height="10" x="3" y="11" rx="2" />
                              <circle cx="12" cy="5" r="2" />
                              <path d="M12 7v4" />
                              <line x1="8" y1="16" x2="8" y2="16" />
                              <line x1="16" y1="16" x2="16" y2="16" />
                            </svg>
                            <span className="text-xs">Robot</span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => handleIconTypeChange('dialog')}
                            className={`p-2 border rounded-md flex flex-col items-center ${formData.iconType === 'dialog' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
                              <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
                            </svg>
                            <span className="text-xs">Dialog</span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => handleIconTypeChange('messages')}
                            className={`p-2 border rounded-md flex flex-col items-center ${formData.iconType === 'messages' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                            <span className="text-xs">Message</span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => handleIconTypeChange('custom')}
                            className={`p-2 border rounded-md flex flex-col items-center ${formData.iconType === 'custom' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10" />
                              <line x1="12" y1="8" x2="12" y2="16" />
                              <line x1="8" y1="12" x2="16" y2="12" />
                            </svg>
                            <span className="text-xs">Custom</span>
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Widget Position
                        </label>
                        <div className="flex gap-4">
                          <button
                            type="button"
                            onClick={() => handlePositionChange('bottom-right')}
                            className={`flex-1 p-3 border rounded-md text-center ${formData.position === 'bottom-right' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}`}
                          >
                            <div className="relative h-20 w-full border border-dashed border-gray-300 dark:border-gray-600 rounded mb-1">
                              <div className="absolute bottom-2 right-2 h-4 w-4 bg-blue-600 rounded-full"></div>
                            </div>
                            <span className="text-xs">Bottom Right</span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => handlePositionChange('bottom-left')}
                            className={`flex-1 p-3 border rounded-md text-center ${formData.position === 'bottom-left' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}`}
                          >
                            <div className="relative h-20 w-full border border-dashed border-gray-300 dark:border-gray-600 rounded mb-1">
                              <div className="absolute bottom-2 left-2 h-4 w-4 bg-blue-600 rounded-full"></div>
                            </div>
                            <span className="text-xs">Bottom Left</span>
                          </button>
                        </div>
                      </div>

                      <div className="border p-3 rounded-md bg-gray-50 dark:bg-gray-900">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Preview with your selected options:</p>
                        <div className="relative h-32 w-full border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                          <div 
                            className={`absolute w-10 h-10 rounded-full flex items-center justify-center text-white ${formData.position === 'bottom-right' ? 'bottom-3 right-3' : 'bottom-3 left-3'}`}
                            style={{ backgroundColor: formData.accentColor }}
                          >
                            {formData.iconType === 'robot' && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="18" height="10" x="3" y="11" rx="2" />
                                <circle cx="12" cy="5" r="2" />
                                <path d="M12 7v4" />
                                <line x1="8" y1="16" x2="8" y2="16" />
                                <line x1="16" y1="16" x2="16" y2="16" />
                              </svg>
                            )}
                            {formData.iconType === 'dialog' && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
                                <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
                              </svg>
                            )}
                            {formData.iconType === 'messages' && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                              </svg>
                            )}
                            {formData.iconType === 'custom' && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                    >
                      Save Changes
                    </Button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}; 