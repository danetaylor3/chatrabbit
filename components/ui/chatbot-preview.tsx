import { ChatbotCustomization } from './customization-step';
import React, { useState } from 'react';

interface ChatbotPreviewProps {
  customization: ChatbotCustomization;
}

export const ChatbotPreview = ({ customization }: ChatbotPreviewProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Array<{type: 'user' | 'bot', text: string}>>([
    { type: 'bot', text: customization.welcomeMessage || 'Hi there! How can I help you today?' }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Add user message to conversation
    setConversation([...conversation, { type: 'user', text: message }]);
    setMessage('');
    
    // Simulate bot response after a short delay
    setTimeout(() => {
      setConversation(prev => [
        ...prev, 
        { type: 'bot', text: 'This is a preview of how your chatbot will respond. Customize the appearance and behavior in the settings.' }
      ]);
    }, 1000);
  };

  const getIconComponent = () => {
    switch (customization.iconType) {
      case 'robot':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="10" rx="2"></rect>
            <circle cx="12" cy="5" r="2"></circle>
            <path d="M12 7v4"></path>
            <line x1="8" y1="16" x2="8" y2="16"></line>
            <line x1="16" y1="16" x2="16" y2="16"></line>
          </svg>
        );
      case 'dialog':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        );
      case 'messages':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
        );
      case 'custom':
        if (customization.logoUrl) {
          return <img src={customization.logoUrl} alt="Logo" className="w-7 h-7 object-contain" />;
        }
        return (
          <div className="w-7 h-7 bg-primary/20 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold">CR</span>
          </div>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        );
    }
  };

  const positionClasses = customization.position === 'bottom-left' 
    ? 'left-4 flex-row-reverse' 
    : 'right-4';

  return (
    <div className="relative flex flex-col h-full w-full bg-gray-100 dark:bg-gray-800 overflow-hidden rounded-xl border dark:border-gray-700 shadow-sm">
      <div className="bg-white dark:bg-gray-800 p-4 border-b dark:border-gray-700 flex justify-between items-center">
        <div className="text-sm font-medium dark:text-gray-200">Live Preview</div>
        <div className="flex items-center gap-2">
          <div className="badge badge-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            {customization.position === 'bottom-left' ? 'Bottom Left' : 'Bottom Right'}
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col p-8 relative">
        {/* Emulated website content */}
        <div className="p-4 bg-white dark:bg-gray-700 rounded-lg mb-4 border dark:border-gray-600">
          <div className="bg-gray-200 dark:bg-gray-600 h-8 w-3/4 rounded mb-4"></div>
          <div className="bg-gray-200 dark:bg-gray-600 h-4 w-full rounded mb-2"></div>
          <div className="bg-gray-200 dark:bg-gray-600 h-4 w-full rounded mb-2"></div>
          <div className="bg-gray-200 dark:bg-gray-600 h-4 w-2/3 rounded"></div>
        </div>
        
        <div className="p-4 bg-white dark:bg-gray-700 rounded-lg border dark:border-gray-600">
          <div className="bg-gray-200 dark:bg-gray-600 h-32 w-full rounded mb-4"></div>
          <div className="bg-gray-200 dark:bg-gray-600 h-4 w-full rounded mb-2"></div>
          <div className="bg-gray-200 dark:bg-gray-600 h-4 w-full rounded mb-2"></div>
          <div className="bg-gray-200 dark:bg-gray-600 h-4 w-full rounded mb-2"></div>
        </div>

        {/* Chatbot UI */}
        <div className={`absolute bottom-4 ${positionClasses} flex items-end gap-2`}>
          {!isOpen && (
            <button 
              className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
              style={{ 
                backgroundColor: customization.accentColor || '#10b981',
                color: 'white'
              }}
              onClick={() => setIsOpen(true)}
            >
              {getIconComponent()}
            </button>
          )}
          
          {isOpen && (
            <div 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col w-80 h-96 overflow-hidden border dark:border-gray-700"
              style={{ 
                fontFamily: customization.fontFamily || 'Inter'
              }}
            >
              {/* Chat header */}
              <div 
                className="p-4 flex justify-between items-center"
                style={{ 
                  backgroundColor: customization.accentColor || '#10b981', 
                  color: 'white' 
                }}
              >
                <div className="flex items-center gap-2">
                  {customization.logoUrl && (
                    <div className="avatar">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                        <img src={customization.logoUrl} alt="Logo" className="object-contain" />
                      </div>
                    </div>
                  )}
                  <div className="font-medium">
                    {customization.welcomeMessage ? 'ChatRabbit Bot' : 'ChatRabbit Bot'}
                  </div>
                </div>
                <button 
                  className="p-1 rounded-md hover:bg-white/20 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              {/* Chat messages */}
              <div 
                className="flex-1 p-4 overflow-y-auto space-y-4"
                style={{ 
                  color: customization.textColor || '#333333'
                }}
              >
                {conversation.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`${
                      msg.type === 'user' 
                        ? 'ml-auto bg-gray-100 dark:bg-gray-700' 
                        : `${customization.accentColor ? 'bg-opacity-10' : 'bg-primary/10'}`
                    } p-3 rounded-lg max-w-[80%]`}
                    style={
                      msg.type === 'bot' 
                        ? { 
                            backgroundColor: `${customization.accentColor}20` || '#10b98120',
                            color: customization.textColor || '#333333'
                          } 
                        : { 
                            color: customization.textColor || '#333333' 
                          }
                    }
                  >
                    {msg.text}
                  </div>
                ))}
              </div>
              
              {/* Chat input */}
              <form onSubmit={handleSendMessage} className="border-t dark:border-gray-700 p-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={customization.placeholderText || "Type a message..."}
                    className="flex-1 p-2 border dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-gray-200"
                    style={{ 
                      color: customization.textColor || '#333333'
                    }}
                  />
                  <button 
                    type="submit"
                    className="p-2 rounded-md"
                    style={{ 
                      backgroundColor: customization.accentColor || '#10b981',
                      color: 'white'
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </button>
                </div>
                {!customization.hideBranding && (
                  <div className="text-xs text-center mt-2 text-gray-500 dark:text-gray-400">
                    Powered by ChatRabbit
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 