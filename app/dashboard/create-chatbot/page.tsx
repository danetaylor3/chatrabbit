"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChatbotPreview } from '../../../components/ui/chatbot-preview';
import { ProgressStepper } from '../../../components/ui/progress-stepper';

// Define the steps
const steps = [
  { id: 'training', title: 'Training Data' },
  { id: 'customize', title: 'Customize' },
  { id: 'deploy', title: 'Deploy' }
];

export default function CreateChatbot() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Identification
    name: '',
    description: '',
    websiteUrl: '',
    
    // Training data
    trainingFiles: [] as File[],
    trainingUrls: [] as string[],
    
    // General customization
    welcomeMessage: "Hello! I'm your AI assistant. How can I help you today?",
    instructions: "You are a helpful and friendly AI assistant. Provide concise and accurate information to the user's questions. If you don't know the answer, be honest and say so rather than guessing. Always be polite and maintain a positive tone.",
    customPrompt: "As an AI chatbot, I'm designed to answer questions about the content on this website. I'll provide helpful and concise information related to the website's topics.",
    placeholderText: 'Type your message here...',
    
    // Appearance
    primaryColor: '#3B82F6',
    textColor: '#111827',
    chatPosition: 'bottom-right' as 'bottom-right' | 'bottom-left',
    iconType: 'robot' as 'robot' | 'dialog' | 'messages' | 'custom',
    logoUrl: null as string | null,
    fontFamily: 'Inter',
    
    // Integration
    apiKey: '',
    apiKeyValid: true,
    
    // User guidance
    suggestedQuestions: [
      'What services do you offer?',
      'How can I contact you?',
      'What makes your product unique?'
    ],
    
    // Additional options
    hideBranding: false,
    captureLeads: true,
    
    // Deployment
    embedCode: '',
    deployed: false,
    active: true
  });

  // Load initial data from URL params
  useEffect(() => {
    const name = searchParams?.get('name') || '';
    const description = searchParams?.get('description') || '';
    const websiteUrl = searchParams?.get('url') || '';
    
    if (name || description || websiteUrl) {
      setFormData(prev => ({
        ...prev,
        name,
        description,
        websiteUrl
      }));
    }
  }, [searchParams]);

  // Training data state
  const [trainingData, setTrainingData] = useState<{
    sources: Array<{
      id: string;
      name: string;
      type: 'url' | 'file';
      size?: string;
      createdAt: Date;
    }>;
    isScanning: boolean;
    scanProgress: number;
    autoCaptureSections: {
      faq: boolean;
      blog: boolean;
      contactInfo: boolean;
      pricing: boolean;
      productInfo: boolean;
    };
  }>({
    sources: [],
    isScanning: false,
    scanProgress: 0,
    autoCaptureSections: {
      faq: true,
      blog: true,
      contactInfo: true,
      pricing: false,
      productInfo: true
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (color: string) => {
    setFormData(prev => ({ ...prev, primaryColor: color }));
  };

  const handlePositionChange = (position: 'bottom-right' | 'bottom-left') => {
    setFormData(prev => ({ ...prev, chatPosition: position }));
  };

  const handleIconTypeChange = (iconType: 'robot' | 'dialog' | 'messages' | 'custom') => {
    setFormData(prev => ({ ...prev, iconType }));
  };

  const handleSuggestedQuestionChange = (index: number, value: string) => {
    setFormData(prev => {
      const newQuestions = [...prev.suggestedQuestions];
      newQuestions[index] = value;
      return { ...prev, suggestedQuestions: newQuestions };
    });
  };

  const addSuggestedQuestion = () => {
    setFormData(prev => ({
      ...prev,
      suggestedQuestions: [...prev.suggestedQuestions, '']
    }));
  };

  const removeSuggestedQuestion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      suggestedQuestions: prev.suggestedQuestions.filter((_, i) => i !== index)
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else {
      finishSetup();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const finishSetup = () => {
    // Save the chatbot and redirect to dashboard
    router.push('/dashboard');
  };

  // Add OpenAI key parser with improved validation
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.trim();
    
    // Check if input is a valid OpenAI key format (sk-...)
    let formattedKey = input;
    
    // If user entered a key but forgot the sk- prefix, add it
    if (input && !input.startsWith('sk-') && input.length > 0) {
      formattedKey = `sk-${input}`;
    }
    
    // Basic validation check for OpenAI key format (they're typically 51 chars in format: sk-[48 chars])
    const isValidFormat = !formattedKey || (formattedKey.startsWith('sk-') && formattedKey.length >= 20);
    
    setFormData(prev => ({
      ...prev,
      apiKey: formattedKey,
      apiKeyValid: isValidFormat
    }));
  };

  // Stepper UI Component
  const Stepper = () => (
    <ProgressStepper steps={steps} currentStep={currentStep} />
  );

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <TrainingDataStep />;
      case 1:
        return <CustomizeStep />;
      case 2:
        return <DeployStep />;
      default:
        return null;
    }
  };

  // Step components
  const TrainingDataStep = () => {
    const startScan = () => {
      if (!formData.websiteUrl) return;
      
      setTrainingData({
        ...trainingData,
        isScanning: true,
        scanProgress: 0
      });

      // Simulate scanning progress
      const interval = setInterval(() => {
        setTrainingData(prev => {
          const newProgress = prev.scanProgress + (Math.random() * 15);
          
          if (newProgress >= 100) {
            clearInterval(interval);
            // Add some sample discovered sources when completed
            return {
              ...prev,
              isScanning: false,
              scanProgress: 100,
              sources: [
                ...prev.sources,
                {
                  id: `url-${Date.now()}-1`,
                  name: `${formData.websiteUrl}/about`,
                  type: 'url',
                  size: '127 KB',
                  createdAt: new Date()
                },
                {
                  id: `url-${Date.now()}-2`,
                  name: `${formData.websiteUrl}/faq`,
                  type: 'url',
                  size: '245 KB',
                  createdAt: new Date()
                },
                {
                  id: `url-${Date.now()}-3`,
                  name: `${formData.websiteUrl}/contact`,
                  type: 'url',
                  size: '98 KB',
                  createdAt: new Date()
                }
              ]
            };
          }
          
          return {
            ...prev,
            scanProgress: newProgress
          };
        });
      }, 800);
    };

    const handleAutoCaptureSectionChange = (section: keyof typeof trainingData.autoCaptureSections) => {
      setTrainingData(prev => ({
        ...prev,
        autoCaptureSections: {
          ...prev.autoCaptureSections,
          [section]: !prev.autoCaptureSections[section]
        }
      }));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;
      
      const newSources = Array.from(files).map(file => ({
        id: `file-${Date.now()}-${file.name}`,
        name: file.name,
        type: 'file' as 'url' | 'file',
        size: `${(file.size / 1024).toFixed(0)} KB`,
        createdAt: new Date()
      }));
      
      setTrainingData(prev => ({
        ...prev,
        sources: [...prev.sources, ...newSources]
      }));
    };

    const removeSource = (id: string) => {
      setTrainingData(prev => ({
        ...prev,
        sources: prev.sources.filter(source => source.id !== id)
      }));
    };

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium mb-4">Training Your Chatbot</h3>

        {trainingData.isScanning ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <div className="animate-spin mr-3 h-5 w-5 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <span className="font-medium">Scanning {formData.websiteUrl}</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${trainingData.scanProgress}%` }}></div>
            </div>
            
            <div className="flex justify-between text-sm text-gray-500">
              <span>Found {Math.floor(trainingData.scanProgress / 10)} pages</span>
              <span>{Math.floor(trainingData.scanProgress)}%</span>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white border rounded-lg p-6 mb-6">
              <h4 className="font-medium mb-3">Scan Website</h4>
              <p className="text-sm text-gray-500 mb-4">
                We'll crawl your website and extract content to train your AI chatbot.
              </p>
              
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <span className="text-sm font-medium min-w-32">Website URL:</span>
                  <div className="flex-1 flex">
                    <input
                      type="text"
                      value={formData.websiteUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, websiteUrl: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://example.com"
                    />
                    <button
                      onClick={startScan}
                      disabled={!formData.websiteUrl}
                      className="px-4 py-2 text-white bg-blue-600 border border-blue-600 rounded-r-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Start Scan
                    </button>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-2">Auto-capture sections:</div>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={trainingData.autoCaptureSections.faq}
                        onChange={() => handleAutoCaptureSectionChange('faq')}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">FAQ Pages</span>
                    </label>
                    
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={trainingData.autoCaptureSections.blog}
                        onChange={() => handleAutoCaptureSectionChange('blog')}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">Blog Content</span>
                    </label>
                    
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={trainingData.autoCaptureSections.contactInfo}
                        onChange={() => handleAutoCaptureSectionChange('contactInfo')}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">Contact Info</span>
                    </label>
                    
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={trainingData.autoCaptureSections.productInfo}
                        onChange={() => handleAutoCaptureSectionChange('productInfo')}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">Product Info</span>
                    </label>
                    
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={trainingData.autoCaptureSections.pricing}
                        onChange={() => handleAutoCaptureSectionChange('pricing')}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">Pricing Information</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <h4 className="font-medium mb-3">Upload Files</h4>
              <p className="text-sm text-gray-500 mb-4">
                Upload documents to train your AI chatbot with specific information.
              </p>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  multiple
                  accept=".pdf,.doc,.docx,.txt,.csv"
                  onChange={handleFileUpload}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mt-1 text-sm text-gray-600">Drag and drop files here, or click to select files</p>
                  <p className="mt-1 text-xs text-gray-500">PDF, Word, TXT, CSV (max 5MB)</p>
                </label>
              </div>
            </div>
          </>
        )}
        
        {trainingData.sources.length > 0 && (
          <div className="mt-8">
            <h4 className="font-medium mb-3">Training Sources ({trainingData.sources.length})</h4>
            <div className="bg-white overflow-hidden border rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Added</th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Remove</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {trainingData.sources.map(source => (
                    <tr key={source.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 max-w-[200px] truncate">
                        {source.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {source.type === 'url' ? 'Website' : 'File'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {source.size || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {source.createdAt.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => removeSource(source.id)} 
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  const CustomizeStep = () => {
    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData(prev => ({
            ...prev,
            logoUrl: event.target.result as string
          }));
        }
      };
      reader.readAsDataURL(file);
    };

    const handleTextColorChange = (color: string) => {
      setFormData(prev => ({
        ...prev,
        textColor: color
      }));
    };

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium mb-4">Customize Your Chatbot</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-6 space-y-4">
              <h4 className="font-medium">Appearance</h4>
              
              <div>
                <label htmlFor="welcomeMessage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Welcome Message
                </label>
                <textarea
                  id="welcomeMessage"
                  name="welcomeMessage"
                  value={formData.welcomeMessage}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                />
              </div>
              
              <div>
                <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Instructions (AI Prompt)
                </label>
                <textarea
                  id="instructions"
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Customize how your chatbot responds to user queries
                </p>
              </div>
              
              <div>
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Primary Color
                </span>
                <div className="flex flex-wrap gap-2">
                  {['#0066cc', '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f97316', '#22c55e'].map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleColorChange(color)}
                      className={`w-8 h-8 rounded-full ${formData.primaryColor === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                      style={{ backgroundColor: color }}
                      aria-label={`Set color to ${color}`}
                    />
                  ))}
                  
                  <div className="relative">
                    <input
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="sr-only"
                      id="custom-color"
                    />
                    <label 
                      htmlFor="custom-color"
                      className="w-8 h-8 rounded-full bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 flex items-center justify-center cursor-pointer hover:border-gray-400"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 dark:text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2v20M2 12h20"/>
                      </svg>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Text Color
                </label>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 overflow-hidden cursor-pointer"
                    style={{ backgroundColor: formData.textColor || '#000000' }}
                    onClick={() => {
                      document.getElementById('text-color-picker')?.click();
                    }}
                  />
                  <input
                    id="text-color-picker"
                    type="color"
                    value={formData.textColor || '#000000'}
                    onChange={(e) => handleTextColorChange(e.target.value)}
                    className="hidden"
                  />
                  <input
                    type="text"
                    value={formData.textColor || '#000000'}
                    onChange={(e) => handleTextColorChange(e.target.value)}
                    className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="#000000"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="logo-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Chatbot Logo
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-600">
                    {formData.logoUrl ? (
                      <img src={formData.logoUrl as string} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <input
                      type="file"
                      id="logo-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleLogoUpload}
                    />
                    <label
                      htmlFor="logo-upload"
                      className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Upload Logo
                    </label>
                    {formData.logoUrl && (
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, logoUrl: null }))}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-xs mt-1 flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2h3.382l.724 1.447A1 1 0 009 8h3a1 1 0 001-1V4a1 1 0 00-1-1H9zM5 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H7a2 2 0 01-2-2V5z" clipRule="evenodd" />
                        </svg>
                        Remove
                      </button>
                    )}
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Upload a square image for best results (JPG, PNG, or SVG)
                </p>
              </div>
              
              <div>
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Chat Icon
                </span>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => handleIconTypeChange('robot')}
                    className={`p-3 border dark:border-gray-600 rounded-md flex items-center justify-center aspect-square ${formData.iconType === 'robot' ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700' : 'border-gray-300 dark:border-gray-600'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                      <circle cx="12" cy="5" r="2"></circle>
                      <path d="M12 7v4"></path>
                      <line x1="8" y1="16" x2="8" y2="16"></line>
                      <line x1="16" y1="16" x2="16" y2="16"></line>
                    </svg>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleIconTypeChange('dialog')}
                    className={`p-3 border dark:border-gray-600 rounded-md flex items-center justify-center aspect-square ${formData.iconType === 'dialog' ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700' : 'border-gray-300 dark:border-gray-600'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleIconTypeChange('messages')}
                    className={`p-3 border dark:border-gray-600 rounded-md flex items-center justify-center aspect-square ${formData.iconType === 'messages' ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700' : 'border-gray-300 dark:border-gray-600'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleIconTypeChange('custom')}
                    className={`p-3 border dark:border-gray-600 rounded-md flex items-center justify-center aspect-square ${formData.iconType === 'custom' ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700' : 'border-gray-300 dark:border-gray-600'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <circle cx="15.5" cy="8.5" r="1.5"></circle>
                      <path d="M7 15a5 5 0 0 0 10 0"></path>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div>
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Widget Position
                </span>
                <div className="flex gap-4">
                  <button
                    type="button" 
                    onClick={() => handlePositionChange('bottom-right')}
                    className={`flex-1 border dark:border-gray-600 rounded-md p-3 flex flex-col items-center gap-2 ${formData.chatPosition === 'bottom-right' ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700' : 'border-gray-300 dark:border-gray-600'}`}
                  >
                    <div className="w-full h-20 bg-gray-100 dark:bg-gray-700 rounded relative">
                      <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-blue-500"></div>
                    </div>
                    <span className="text-sm">Bottom Right</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handlePositionChange('bottom-left')}
                    className={`flex-1 border dark:border-gray-600 rounded-md p-3 flex flex-col items-center gap-2 ${formData.chatPosition === 'bottom-left' ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700' : 'border-gray-300 dark:border-gray-600'}`}
                  >
                    <div className="w-full h-20 bg-gray-100 dark:bg-gray-700 rounded relative">
                      <div className="absolute bottom-2 left-2 w-6 h-6 rounded-full bg-blue-500"></div>
                    </div>
                    <span className="text-sm">Bottom Left</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-6 space-y-4">
              <h4 className="font-medium">Suggested Questions</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Add questions to help guide users when they first open the chat
              </p>
              
              {formData.suggestedQuestions.map((question, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => handleSuggestedQuestionChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add a question"
                  />
                  <button
                    type="button"
                    onClick={() => removeSuggestedQuestion(index)}
                    className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400"
                    aria-label="Remove question"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6L6 18M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              ))}
              
              {formData.suggestedQuestions.length < 5 && (
                <button
                  type="button"
                  onClick={addSuggestedQuestion}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 inline-flex items-center text-sm font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14"></path>
                  </svg>
                  Add Question
                </button>
              )}
            </div>
            
            <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-6 space-y-4">
              <h4 className="font-medium">OpenAI Integration</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Connect your OpenAI API key to enhance chatbot capabilities
              </p>
              
              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  OpenAI API Key (Optional)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="apiKey"
                    name="apiKey"
                    value={formData.apiKey}
                    onChange={handleApiKeyChange}
                    placeholder="sk-..."
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                      ${formData.apiKey && !formData.apiKeyValid 
                        ? 'border-red-300 dark:border-red-600 dark:bg-red-900/20 dark:text-red-100' 
                        : formData.apiKey && formData.apiKeyValid
                          ? 'border-green-300 dark:border-green-600 dark:bg-green-900/10 dark:text-green-100'
                          : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100'
                      }`}
                  />
                  {formData.apiKey && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      {formData.apiKeyValid ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {formData.apiKey && !formData.apiKeyValid 
                    ? "Please enter a valid OpenAI API key starting with 'sk-'"
                    : "Your API key is securely stored and never shared"}
                </p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-6 space-y-4">
              <h4 className="font-medium">Additional Options</h4>
              
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="hideBranding" className="text-sm font-medium text-gray-700 dark:text-gray-300">Hide Branding</label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Remove "Powered by ChatRabbit" from the widget</p>
                </div>
                <div className="relative inline-flex items-center">
                  <input
                    type="checkbox"
                    id="hideBranding"
                    name="hideBranding"
                    checked={formData.hideBranding}
                    onChange={handleCheckboxChange}
                    className="sr-only"
                  />
                  <div className={`w-11 h-6 rounded-full transition ${formData.hideBranding ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}>
                    <div
                      className={`w-5 h-5 rounded-full bg-white dark:bg-gray-300 transform transition duration-300 ease-in-out shadow ${
                        formData.hideBranding ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="captureLeads" className="text-sm font-medium text-gray-700 dark:text-gray-300">Capture Leads</label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Ask for name and email after helpful conversations</p>
                </div>
                <div className="relative inline-flex items-center">
                  <input
                    type="checkbox"
                    id="captureLeads"
                    name="captureLeads"
                    checked={formData.captureLeads}
                    onChange={handleCheckboxChange}
                    className="sr-only"
                  />
                  <div className={`w-11 h-6 rounded-full transition ${formData.captureLeads ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}>
                    <div
                      className={`w-5 h-5 rounded-full bg-white dark:bg-gray-300 transform transition duration-300 ease-in-out shadow ${
                        formData.captureLeads ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:sticky lg:top-6 h-full">
            <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4 h-full">
              <h4 className="font-medium mb-4 text-center">Live Preview</h4>
              <div className="h-[550px] overflow-hidden rounded border dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <ChatbotPreview
                  customization={{
                    welcomeMessage: formData.welcomeMessage,
                    placeholderText: formData.placeholderText,
                    instructions: formData.instructions,
                    logoUrl: formData.logoUrl as string | null,
                    iconType: formData.iconType,
                    position: formData.chatPosition as "bottom-right" | "bottom-left",
                    accentColor: formData.primaryColor,
                    fontFamily: formData.fontFamily,
                    textColor: formData.textColor,
                    hideBranding: formData.hideBranding,
                    captureLeads: formData.captureLeads,
                    targeting: {
                      devices: {
                        desktop: true,
                        mobile: true,
                        tablet: true,
                      },
                      allPages: true,
                      specificUrls: [],
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const DeployStep = () => {
    const [deployStatus, setDeployStatus] = useState<'idle' | 'deploying' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [copied, setCopied] = useState(false);
    
    const generateEmbedCode = () => {
      // Generate a unique ID for the chatbot
      const botId = `chat_${Math.random().toString(36).substring(2, 10)}`;
      
      // Create a more professional embed code with the configured options
      return `<!-- ChatRabbit Widget -->
<script>
  window.chatrabbitConfig = {
    botId: "${botId}",
    primaryColor: "${formData.primaryColor}",
    textColor: "${formData.textColor}",
    position: "${formData.chatPosition}",
    welcome: "${formData.welcomeMessage.replace(/"/g, '\\"')}",
    icon: "${formData.iconType}",
    logoUrl: "${formData.logoUrl || ''}",
    suggestedQuestions: ${JSON.stringify(formData.suggestedQuestions)},
    showBranding: ${!formData.hideBranding},
    captureLeads: ${formData.captureLeads}
  };
</script>
<script src="https://app.chatrabbit.ai/widget.js" async defer></script>
<!-- End ChatRabbit Widget -->`;
    };
    
    const handleDeploy = async () => {
      setDeployStatus('deploying');
      setErrorMessage('');
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // In a real implementation, this would make an API call to save the chatbot configuration
        // and return the deployment status
        
        // Generate the embed code if not already generated
        if (!formData.embedCode) {
          const code = generateEmbedCode();
          setFormData(prev => ({ ...prev, embedCode: code }));
        }
        
        // Simulate successful deployment
        setFormData(prev => ({ ...prev, deployed: true }));
        setDeployStatus('success');
      } catch (error) {
        console.error('Deployment error:', error);
        setDeployStatus('error');
        setErrorMessage('An error occurred during deployment. Please try again.');
      }
    };
    
    const copyToClipboard = () => {
      if (formData.embedCode) {
        navigator.clipboard.writeText(formData.embedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    };
    
    return (
      <div className="space-y-8">
        <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-6 space-y-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Deploy Your Chatbot</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Ready to deploy?</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Your chatbot is ready to be deployed to your website
                </p>
              </div>
              
              <button
                type="button"
                onClick={handleDeploy}
                disabled={deployStatus === 'deploying'}
                className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed
                  ${deployStatus === 'deploying' ? 'opacity-75 cursor-wait' : ''}
                  ${deployStatus === 'success' ? 'bg-green-600 hover:bg-green-700' : ''}
                  ${deployStatus === 'error' ? 'bg-red-600 hover:bg-red-700' : ''}
                `}
              >
                {deployStatus === 'deploying' && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {deployStatus === 'idle' && 'Deploy Chatbot'}
                {deployStatus === 'deploying' && 'Deploying...'}
                {deployStatus === 'success' && 'Deployed Successfully'}
                {deployStatus === 'error' && 'Retry Deployment'}
              </button>
            </div>
            
            {errorMessage && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-700 dark:text-red-400 text-sm">
                {errorMessage}
              </div>
            )}
            
            {formData.deployed && (
              <div className="mt-6">
                <h4 className="font-medium mb-2">Add to your website</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Copy and paste this code just before the closing &lt;/body&gt; tag of your website.
                </p>
                
                <div className="relative">
                  <pre className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md p-4 text-xs overflow-x-auto">
                    {formData.embedCode}
                  </pre>
                  
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="absolute top-2 right-2 p-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {copied ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2h3.382l.724 1.447A1 1 0 009 8h3a1 1 0 001-1V4a1 1 0 00-1-1H9zM5 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H7a2 2 0 01-2-2V5z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                        <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-6 space-y-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Platform Installation Guides</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <h4 className="font-medium">WordPress</h4>
              </div>
              <ol className="list-decimal list-inside text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>Go to your WordPress dashboard</li>
                <li>Navigate to Appearance &gt; Theme Editor</li>
                <li>Select your theme's footer.php file</li>
                <li>Paste the embed code before the &lt;/body&gt; tag</li>
                <li>Save the changes</li>
              </ol>
            </div>
            
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <h4 className="font-medium">Shopify</h4>
              </div>
              <ol className="list-decimal list-inside text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>Go to your Shopify admin</li>
                <li>Navigate to Online Store &gt; Themes</li>
                <li>Click "Actions" &gt; "Edit code"</li>
                <li>Open the theme.liquid file</li>
                <li>Paste the embed code before the &lt;/body&gt; tag</li>
                <li>Save the changes</li>
              </ol>
            </div>
            
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h4 className="font-medium">Wix</h4>
              </div>
              <ol className="list-decimal list-inside text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>Go to your Wix editor</li>
                <li>Click "+" and select "Add Apps"</li>
                <li>Search for "Custom HTML/JS" and add it</li>
                <li>Click on the widget &gt; "Enter Code"</li>
                <li>Paste the embed code and apply</li>
                <li>Position the widget and publish your site</li>
              </ol>
            </div>
            
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <h4 className="font-medium">Other Platforms</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                For any other platform, simply add the embed code to your website's HTML, just before the closing &lt;/body&gt; tag. If you need assistance, please contact our support team.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-6 py-4">
        <div className="flex items-center">
          <Link 
            href="/dashboard" 
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center mr-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </div>
      
      <div className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <Stepper />
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
            {renderStepContent()}
            
            <div className="mt-6 flex justify-between border-t dark:border-gray-700 pt-4">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  currentStep === 0
                    ? 'text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 cursor-not-allowed'
                    : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                }`}
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 