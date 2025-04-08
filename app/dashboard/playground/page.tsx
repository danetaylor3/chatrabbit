"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface ChatMessage {
  role: "user" | "bot";
  content: string;
  timestamp: Date;
}

interface Chatbot {
  id: string;
  name: string;
  description: string;
}

export default function Playground() {
  const [userMessage, setUserMessage] = useState('');
  const [conversation, setConversation] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedChatbot, setSelectedChatbot] = useState<Chatbot | null>(null);
  const [chatbots, setChatbots] = useState<Chatbot[]>([
    { id: 'cb_1', name: 'Customer Support Bot', description: 'Handles common customer service questions' },
    { id: 'cb_2', name: 'Sales Assistant', description: 'Helps visitors with product information and guides through purchasing' },
    { id: 'cb_3', name: 'FAQ Bot', description: 'Answers frequently asked questions about our services' }
  ]);
  const [settings, setSettings] = useState({
    temperature: 0.7,
    maxTokens: 500,
    topP: 0.9,
    frequencyPenalty: 0.1,
    presencePenalty: 0.1,
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If there's a chatbot in the list, select the first one by default
    if (chatbots.length > 0 && !selectedChatbot) {
      setSelectedChatbot(chatbots[0]);
      setConversation([{
        role: 'bot',
        content: `Hi there! I'm the ${chatbots[0].name}. How can I help you today?`,
        timestamp: new Date()
      }]);
    }
  }, [chatbots, selectedChatbot]);

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMessage.trim() || !selectedChatbot) return;

    // Add user message to conversation
    const newMessage: ChatMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    setConversation([...conversation, newMessage]);
    setUserMessage('');
    setIsTyping(true);

    // Simulate bot response after a delay
    setTimeout(() => {
      // This would be replaced with an actual API call in production
      const botResponse: ChatMessage = {
        role: 'bot',
        content: generateFakeResponse(userMessage, selectedChatbot),
        timestamp: new Date()
      };
      setConversation(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  };

  const generateFakeResponse = (message: string, chatbot: Chatbot): string => {
    // Very basic response generation based on message content and selected chatbot
    const lowerMessage = message.toLowerCase();
    
    if (chatbot.id === 'cb_1') { // Customer Support Bot
      if (lowerMessage.includes('return') || lowerMessage.includes('refund')) {
        return "Our return policy allows returns within 30 days of purchase. To initiate a return, please go to your order history and select the item you'd like to return.";
      } else if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
        return "Standard shipping takes 3-5 business days. Express shipping is available for an additional fee and typically delivers within 1-2 business days.";
      }
    } else if (chatbot.id === 'cb_2') { // Sales Assistant
      if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
        return "Our pricing varies based on the product and any current promotions. Can you tell me which specific product you're interested in?";
      } else if (lowerMessage.includes('discount') || lowerMessage.includes('sale')) {
        return "We're currently offering a 15% discount on your first purchase when you sign up for our newsletter. Would you like to know more about our current promotions?";
      }
    }
    
    // Default responses if no specific match
    const defaultResponses = [
      "I'd be happy to help with that. Could you provide more details?",
      "Thank you for your question. Let me find that information for you.",
      "I understand what you're asking. Here's what I can tell you...",
      "That's a great question. Based on what I know, I'd recommend...",
      "I'm here to assist with that. Could you clarify what you're looking for specifically?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'number' ? parseFloat(value) : value
    });
  };

  const clearConversation = () => {
    if (selectedChatbot) {
      setConversation([{
        role: 'bot',
        content: `Hi there! I'm the ${selectedChatbot.name}. How can I help you today?`,
        timestamp: new Date()
      }]);
    } else {
      setConversation([]);
    }
  };

  const handleChatbotChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const botId = e.target.value;
    const bot = chatbots.find(b => b.id === botId) || null;
    setSelectedChatbot(bot);
    if (bot) {
      clearConversation();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-background border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Playground</h1>
          <div className="flex items-center space-x-2">
            <select
              value={selectedChatbot?.id || ''}
              onChange={handleChatbotChange}
              className="select h-9 min-h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              {chatbots.map(bot => (
                <option key={bot.id} value={bot.id}>{bot.name}</option>
              ))}
            </select>
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="inline-flex items-center justify-center rounded-md border border-input h-9 px-3 text-sm text-muted-foreground shadow-sm hover:bg-accent"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-1">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {conversation.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted border'
                  }`}
                >
                  <div className="prose-sm">
                    {message.content}
                  </div>
                  <div className={`text-xs mt-1 ${
                    message.role === 'user' 
                      ? 'text-primary-foreground/70' 
                      : 'text-muted-foreground'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg px-4 py-2 bg-muted border">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <input
                type="text"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
              <button
                type="submit"
                disabled={!userMessage.trim() || !selectedChatbot}
                className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="m22 2-7 20-4-9-9-4 20-7Z" />
                  <path d="M22 2 11 13" />
                </svg>
                <span className="sr-only">Send</span>
              </button>
            </form>
          </div>
        </div>

        {/* Settings sidebar */}
        {isSettingsOpen && (
          <div className="w-72 border-l bg-card overflow-y-auto flex flex-col">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h2 className="font-medium">Settings</h2>
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="rounded-full p-1 hover:bg-accent"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                  <span className="sr-only">Close</span>
                </button>
              </div>
            </div>
            <div className="p-4 space-y-4 flex-1">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Temperature: {settings.temperature}
                </label>
                <input
                  type="range"
                  name="temperature"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.temperature}
                  onChange={handleSettingChange}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Higher values make output more random, lower values make it more focused and deterministic.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Max Tokens: {settings.maxTokens}
                </label>
                <input
                  type="range"
                  name="maxTokens"
                  min="100"
                  max="2000"
                  step="100"
                  value={settings.maxTokens}
                  onChange={handleSettingChange}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  The maximum number of tokens to generate in the response.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Top P: {settings.topP}
                </label>
                <input
                  type="range"
                  name="topP"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.topP}
                  onChange={handleSettingChange}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Controls diversity via nucleus sampling.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Frequency Penalty: {settings.frequencyPenalty}
                </label>
                <input
                  type="range"
                  name="frequencyPenalty"
                  min="0"
                  max="2"
                  step="0.1"
                  value={settings.frequencyPenalty}
                  onChange={handleSettingChange}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Reduces repetition of token sequences.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Presence Penalty: {settings.presencePenalty}
                </label>
                <input
                  type="range"
                  name="presencePenalty"
                  min="0"
                  max="2"
                  step="0.1"
                  value={settings.presencePenalty}
                  onChange={handleSettingChange}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Reduces repetition of topics.
                </p>
              </div>
            </div>
            <div className="p-4 border-t">
              <button
                onClick={clearConversation}
                className="w-full inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-accent"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-1.5">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
                Clear Conversation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 