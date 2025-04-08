"use client";

import { useState } from "react";
import Image from "next/image";

export default function Settings() {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john@example.com");
  const [company, setCompany] = useState("ACME Inc.");
  const [website, setWebsite] = useState("https://example.com");
  const [apiKey, setApiKey] = useState("sk_live_*****************************");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Show success notification in a real app
    setIsLoading(false);
  };
  
  const generateNewApiKey = async () => {
    if (window.confirm("Are you sure you want to generate a new API key? This will invalidate your current key.")) {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Generate a new fake API key
      setApiKey(`sk_live_${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`);
      setIsLoading(false);
      
      // Show success notification in a real app
    }
  };
  
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className="card bg-base-100 shadow-md">
        <div className="card-body p-0">
          <div className="tabs tabs-boxed bg-base-200 p-1 mb-6">
            <button 
              className={`tab ${activeTab === "profile" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              Profile
            </button>
            <button 
              className={`tab ${activeTab === "api" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("api")}
            >
              API Keys
            </button>
            <button 
              className={`tab ${activeTab === "billing" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("billing")}
            >
              Billing
            </button>
          </div>
          
          {activeTab === "profile" && (
            <div className="p-4">
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="avatar">
                    <div className="w-24 rounded-full">
                      <Image 
                        src="/avatar-placeholder.png" 
                        alt="Profile" 
                        width={96} 
                        height={96}
                        className="rounded-full"
                      />
                    </div>
                  </div>
                  <div>
                    <button type="button" className="btn btn-sm btn-outline mb-2">
                      Change Avatar
                    </button>
                    <div className="text-xs text-base-content/60">
                      JPG, GIF or PNG. Max size 1MB.
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Full Name</span>
                    </label>
                    <input 
                      type="text" 
                      className="input input-bordered" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Email Address</span>
                    </label>
                    <input 
                      type="email" 
                      className="input input-bordered" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled
                    />
                    <label className="label">
                      <span className="label-text-alt">Email address cannot be changed</span>
                    </label>
                  </div>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Company Name</span>
                    </label>
                    <input 
                      type="text" 
                      className="input input-bordered" 
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Website</span>
                    </label>
                    <input 
                      type="url" 
                      className="input input-bordered" 
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="mt-8">
                  <button 
                    type="submit" 
                    className={`btn btn-primary ${isLoading ? 'loading' : ''}`} 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {activeTab === "api" && (
            <div className="p-4">
              <div className="alert alert-info mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>
                  Your API key grants full access to your account. Keep it secure and never share it in public repositories or client-side code.
                </span>
              </div>
              
              <div className="card bg-base-200 p-4 mb-6">
                <div className="text-sm mb-2 text-base-content/70">API Key</div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-base-300 p-3 rounded">{apiKey}</code>
                  <button 
                    type="button" 
                    className="btn btn-sm btn-ghost"
                    onClick={() => navigator.clipboard.writeText(apiKey)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <button 
                className={`btn btn-outline btn-error ${isLoading ? 'loading' : ''}`}
                onClick={generateNewApiKey}
                disabled={isLoading}
              >
                Generate New API Key
              </button>
            </div>
          )}
          
          {activeTab === "billing" && (
            <div className="p-4">
              <div className="card bg-base-200 p-6 mb-6">
                <h3 className="font-bold text-lg mb-2">Current Plan</h3>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="text-xl font-bold text-primary">Pro Plan</div>
                    <div className="text-base-content/70">$49/month • Renews on May 12, 2023</div>
                  </div>
                  <div className="space-x-2">
                    <button className="btn btn-sm btn-outline">Change Plan</button>
                    <button className="btn btn-sm btn-error btn-outline">Cancel Subscription</button>
                  </div>
                </div>
              </div>
              
              <div className="card bg-base-200 p-6">
                <h3 className="font-bold text-lg mb-4">Payment Method</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-base-100 p-2 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold">Visa ending in 4242</div>
                    <div className="text-sm text-base-content/70">Expires 12/2025</div>
                  </div>
                  <div className="ml-auto">
                    <button className="btn btn-sm btn-ghost">Edit</button>
                  </div>
                </div>
                
                <button className="btn btn-sm btn-outline">Add Payment Method</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 