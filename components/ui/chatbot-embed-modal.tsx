"use client";

import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface ChatbotEmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatbotId: string;
  chatbotName: string;
}

export const ChatbotEmbedModal = ({ isOpen, onClose, chatbotId, chatbotName }: ChatbotEmbedModalProps) => {
  const [copied, setCopied] = useState(false);

  // Generate embed code
  const embedCode = `<script>
  (function(c,h,a,t,r,a,b){
    c[r]=c[r]||function(){(c[r].q=c[r].q||[]).push(arguments)};
    a=h.createElement('script');b=h.getElementsByTagName('script')[0];
    a.async=1;a.src=t;b.parentNode.insertBefore(a,b);
  })(window,document,'https://app.chatrabbit.ai/api/chatbot.js','chatrabbit');
  
  chatrabbit('init', '${chatbotId}');
</script>`;

  const handleCopyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
                    Embed Chatbot: {chatbotName}
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

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      Add this code to your website to embed your chatbot:
                    </p>
                    
                    <div className="relative">
                      <pre className="p-3 bg-gray-100 dark:bg-gray-900 rounded-md text-xs text-gray-800 dark:text-gray-200 overflow-x-auto">
                        {embedCode}
                      </pre>
                      
                      <button
                        onClick={handleCopyEmbedCode}
                        className="absolute top-2 right-2 p-1 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none"
                        aria-label="Copy embed code"
                      >
                        {copied ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 dark:text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6 9 17l-5-5"></path>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Installation Instructions</h4>
                    
                    <ol className="text-xs text-gray-600 dark:text-gray-400 space-y-2 list-decimal pl-4">
                      <li>Copy the code above</li>
                      <li>Paste it before the closing <code className="bg-gray-100 dark:bg-gray-900 px-1 py-0.5 rounded">&lt;/body&gt;</code> tag on your website</li>
                      <li>Your chatbot will appear in the bottom right corner of your website</li>
                      <li>You can customize the appearance of your chatbot from the dashboard</li>
                    </ol>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={onClose}
                  >
                    Done
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}; 