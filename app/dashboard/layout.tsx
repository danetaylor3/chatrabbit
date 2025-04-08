"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import bunnyIcon from '@/app/icon.png';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const isCreateChatbotPage = usePathname().includes('/create-chatbot');
  const pathname = usePathname();

  // Initialize theme on mount
  useEffect(() => {
    // Check if user has a theme preference in localStorage
    const storedTheme = localStorage.getItem('theme');
    // Check if user has a system preference
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    
    // Use stored theme if it exists, otherwise use system preference
    const initialTheme = storedTheme || systemTheme;
    
    // Apply theme to document
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <rect width="7" height="9" x="3" y="3" rx="1" />
          <rect width="7" height="5" x="14" y="3" rx="1" />
          <rect width="7" height="9" x="14" y="12" rx="1" />
          <rect width="7" height="5" x="3" y="16" rx="1" />
        </svg>
      ),
      exact: true,
    },
    {
      name: "Chat Logs",
      href: "/dashboard/chat-logs",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <line x1="9" x2="15" y1="10" y2="10" />
          <line x1="12" x2="12" y1="7" y2="13" />
        </svg>
      ),
      exact: false,
    },
    {
      name: "Leads",
      href: "/dashboard/leads",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      exact: false,
    },
    {
      name: "Account",
      href: "/dashboard/account",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="10" r="3" />
          <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
        </svg>
      ),
      exact: false,
    },
  ];

  const isActive = (item: { href: string, exact: boolean }) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-inter">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 z-20 flex h-full flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-all duration-300 ${
          isSidebarCollapsed ? 'w-16' : 'w-64'
        } md:relative`}
      >
        {/* Sidebar header */}
        <div className="border-b border-gray-200 dark:border-gray-800 px-4 py-4 flex h-14 items-center">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex items-center justify-center rounded-md bg-blue-600 w-8 h-8 text-white overflow-hidden">
              {/* Bunny icon from app folder */}
              <Image 
                src={bunnyIcon}
                alt="ChatRabbit Logo"
                width={24}
                height={24}
                className="w-6 h-6 object-contain"
                priority
              />
            </div>
            {!isSidebarCollapsed && (
              <span className="font-semibold text-xl text-blue-600 dark:text-blue-400" style={{ fontFamily: "'Inter', sans-serif" }}>ChatRabbit</span>
            )}
          </Link>
        </div>

        {/* Sidebar content */}
        <div className="flex-1 overflow-auto py-6">
          <nav className="grid gap-3 px-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center rounded-md px-4 py-3 text-sm font-medium transition-colors duration-150 ease-in-out hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-800/50 dark:hover:text-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                  ${isActive(item) 
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' 
                    : 'text-gray-700 dark:text-gray-300'
                  }
                `}
                aria-current={isActive(item) ? 'page' : undefined}
              >
                <span className={`mr-4 flex-shrink-0 ${isActive(item) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>{item.icon}</span>
                {!isSidebarCollapsed && <span>{item.name}</span>}
              </Link>
            ))}
          </nav>
        </div>

        {/* Usage Indicator */}
        {!isSidebarCollapsed && (
          <div className="px-3 pb-4">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-medium text-gray-700 dark:text-gray-300">Free Trial Usage</h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">18/25</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-2">
                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '72%' }}></div>
              </div>
              <button 
                onClick={async () => {
                  try {
                    const response = await fetch('/api/stripe/create-checkout', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        priceId: 'price_starter', // Default to starter plan for sidebar upgrade
                        mode: 'subscription',
                        successUrl: `${window.location.origin}/dashboard?checkout=success`,
                        cancelUrl: `${window.location.origin}/dashboard/account?checkout=canceled`,
                      }),
                    });
                    
                    const data = await response.json();
                    
                    if (data.url) {
                      window.location.href = data.url;
                    }
                  } catch (error) {
                    console.error('Error creating checkout:', error);
                  }
                }}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center"
              >
                <span>Upgrade Plan</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* User account info */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-4">
          <Link
            href="/dashboard/account"
            className="flex items-center gap-3 rounded-md p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors duration-150 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <div className="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium">
              DT
            </div>
            {!isSidebarCollapsed && (
              <div className="flex-1">
                <span className="text-sm font-medium block">Dane Taylor</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Free Trial</span>
              </div>
            )}
          </Link>
        </div>

        {/* Sidebar toggle */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-4">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="flex w-full items-center justify-center rounded-md p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors duration-150 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`h-5 w-5 transition-transform ${isSidebarCollapsed ? 'rotate-180' : ''}`}
            >
              <path d="m11 17-5-5 5-5" />
              <path d="m18 17-5-5 5-5" />
            </svg>
            {!isSidebarCollapsed && <span className="ml-2 text-sm">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top navbar */}
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 sm:px-6">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="inline-flex md:hidden items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
              <span className="sr-only">Toggle Menu</span>
            </button>
            
            {/* Page title based on active nav item */}
            <div className="ml-4 md:ml-0">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
                {isCreateChatbotPage 
                  ? 'Create New Chatbot'
                  : navigation.find(item => isActive(item))?.name || 'Dashboard'}
              </h1>
            </div>
          </div>
          
          {/* Light/Dark mode toggle */}
          <ThemeToggle />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">{children}</main>
      </div>
    </div>
  );
}
