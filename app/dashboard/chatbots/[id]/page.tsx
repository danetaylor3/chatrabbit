"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type ChatbotData = {
  id: string;
  name: string;
  description?: string;
  status: "active" | "inactive" | "training";
  createdAt: string;
  trainingSource?: string;
  conversations: number;
  averageRating?: number;
  personality?: string;
};

export default function ChatbotDetail() {
  const params = useParams();
  const [chatbot, setChatbot] = useState<ChatbotData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "conversations", label: "Conversations" },
    { id: "settings", label: "Settings" },
    { id: "embed", label: "Embed & Share" },
  ];

  useEffect(() => {
    // Simulating API call to get chatbot data
    setTimeout(() => {
      setChatbot({
        id: params.id as string,
        name: "Customer Support Bot",
        description: "This chatbot helps customers with common questions about our products and services.",
        status: "active",
        createdAt: "2023-04-15T10:30:00Z",
        trainingSource: "https://example.com",
        conversations: 128,
        averageRating: 4.7,
        personality: "Friendly",
      });
      setLoading(false);
    }, 800);
  }, [params.id]);

  if (loading) {
    return (
      <div className="h-full flex flex-col">
        <div className="navbar bg-base-100 border-b h-16 px-6">
          <div className="flex items-center">
            <Link href="/dashboard" className="btn btn-ghost btn-sm mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
            <h1 className="text-xl font-semibold">Loading chatbot...</h1>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </div>
    );
  }

  if (!chatbot) {
    return (
      <div className="h-full flex flex-col">
        <div className="navbar bg-base-100 border-b h-16 px-6">
          <div className="flex items-center">
            <Link href="/dashboard" className="btn btn-ghost btn-sm mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
            <h1 className="text-xl font-semibold">Chatbot not found</h1>
          </div>
        </div>
        <div className="flex-1 p-6">
          <div className="card bg-base-100 shadow-sm max-w-4xl mx-auto">
            <div className="card-body items-center text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-base-content/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-xl font-semibold mb-2">Chatbot Not Found</h2>
              <p className="text-base-content/70 mb-6">The chatbot you're looking for doesn't exist or has been deleted.</p>
              <Link 
                href="/dashboard" 
                className="btn btn-primary"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="navbar bg-base-100 border-b h-16 px-6">
        <div className="flex items-center">
          <Link href="/dashboard" className="btn btn-ghost btn-sm mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
          <h1 className="text-xl font-semibold">{chatbot.name}</h1>
          
          <div className={`badge ml-3 ${
            chatbot.status === "active" ? "badge-success" : 
            chatbot.status === "training" ? "badge-warning" : 
            "badge-ghost"
          }`}>
            {chatbot.status === "active" ? "Active" : 
            chatbot.status === "training" ? "Training" : 
            "Inactive"}
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-auto bg-base-200">
        <div className="max-w-6xl mx-auto">
          {/* Tabs */}
          <div className="tabs tabs-boxed bg-base-100 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab ${activeTab === tab.id ? "tab-active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="stat bg-base-100 shadow-sm rounded-box">
                  <div className="stat-title">Total Conversations</div>
                  <div className="stat-value">{chatbot.conversations}</div>
                </div>
                <div className="stat bg-base-100 shadow-sm rounded-box">
                  <div className="stat-title">User Satisfaction</div>
                  <div className="stat-value">{chatbot.averageRating || "N/A"}</div>
                </div>
                <div className="stat bg-base-100 shadow-sm rounded-box">
                  <div className="stat-title">Response Time</div>
                  <div className="stat-value">0.4s</div>
                </div>
                <div className="stat bg-base-100 shadow-sm rounded-box">
                  <div className="stat-title">Status</div>
                  <div className="stat-value capitalize">{chatbot.status}</div>
                </div>
              </div>

              {/* Details Card */}
              <div className="card bg-base-100 shadow-sm">
                <div className="card-title p-6 border-b">
                  Chatbot Details
                </div>
                <div className="card-body">
                  <dl className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <dt className="text-sm font-medium text-base-content/60">Name</dt>
                      <dd className="mt-1 text-sm">{chatbot.name}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-base-content/60">Created</dt>
                      <dd className="mt-1 text-sm">
                        {new Date(chatbot.createdAt).toLocaleDateString()}
                      </dd>
                    </div>
                    <div className="col-span-1 lg:col-span-2">
                      <dt className="text-sm font-medium text-base-content/60">Description</dt>
                      <dd className="mt-1 text-sm">{chatbot.description || "No description provided."}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-base-content/60">Training Source</dt>
                      <dd className="mt-1 text-sm">{chatbot.trainingSource || "N/A"}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-base-content/60">Personality</dt>
                      <dd className="mt-1 text-sm">{chatbot.personality || "Standard"}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Conversation Chart (Placeholder) */}
              <div className="card bg-base-100 shadow-sm">
                <div className="flex justify-between items-center p-6 border-b">
                  <h2 className="card-title">Conversation History</h2>
                  <select className="select select-bordered select-sm">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                  </select>
                </div>
                <div className="card-body">
                  <div className="h-64 bg-base-200 rounded-box flex items-center justify-center">
                    <div className="text-center p-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-base-content/30 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <p className="text-base-content/50 text-sm">Chart visualization will appear here</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "conversations" && (
            <div className="card bg-base-100 shadow-sm">
              <div className="card-title p-6 border-b">
                Recent Conversations
              </div>
              <div className="card-body">
                <div className="border rounded-box">
                  <div className="bg-base-200 px-4 py-3 border-b">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">No conversations yet</h3>
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-base-content/30 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="text-base-content/60 mb-4">Your chatbot hasn't had any conversations yet.</p>
                    <button className="btn btn-outline btn-sm">
                      Test Chatbot
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="card bg-base-100 shadow-sm">
              <div className="card-title p-6 border-b">
                Chatbot Settings
              </div>
              <div className="card-body">
                <form className="space-y-6">
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Chatbot Name</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      defaultValue={chatbot.name}
                      className="input input-bordered w-full"
                    />
                  </div>
                  
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Description</span>
                    </label>
                    <textarea
                      id="description"
                      rows={3}
                      defaultValue={chatbot.description || ""}
                      className="textarea textarea-bordered w-full"
                    />
                  </div>
                  
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Status</span>
                    </label>
                    <select
                      id="status"
                      defaultValue={chatbot.status}
                      className="select select-bordered w-full"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  
                  <div className="border-t pt-5">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="btn btn-ghost"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === "embed" && (
            <div className="card bg-base-100 shadow-sm">
              <div className="card-title p-6 border-b">
                Embed Your Chatbot
              </div>
              <div className="card-body">
                <p className="text-sm text-base-content/70 mb-6">
                  Copy and paste this code snippet into your website's HTML to embed your chatbot.
                </p>
                
                <div className="bg-base-200 p-4 rounded-box">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium">Embed Code</h3>
                    <button className="btn btn-sm btn-ghost text-primary">
                      Copy to Clipboard
                    </button>
                  </div>
                  <pre className="bg-base-300 p-3 rounded-box text-xs overflow-x-auto">
                    {`<!-- ChatRabbit Widget -->
<script>
  window.chatRabbitConfig = {
    botId: "${chatbot.id}",
    position: "bottom-right",
    theme: "light"
  }
</script>
<script src="https://cdn.chatrabbit.ai/widget.js" async></script>`}
                  </pre>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-sm font-medium mb-3">Customize Appearance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text">Position</span>
                      </label>
                      <select
                        id="position"
                        className="select select-bordered w-full"
                        defaultValue="bottom-right"
                      >
                        <option value="bottom-right">Bottom Right</option>
                        <option value="bottom-left">Bottom Left</option>
                        <option value="top-right">Top Right</option>
                        <option value="top-left">Top Left</option>
                      </select>
                    </div>
                    
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text">Theme</span>
                      </label>
                      <select
                        id="theme"
                        className="select select-bordered w-full"
                        defaultValue="light"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto (follows user's system)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 