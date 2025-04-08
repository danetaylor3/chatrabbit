"use client";

import React, { useState } from "react";
import { Button } from "../../../components/ui/shadcn/button";
import { Badge } from "../../../components/ui/shadcn/badge";

interface User {
  name: string;
  email: string;
  profileImage: string | null;
  company: string | null;
  plan: 'free' | 'starter' | 'basic' | 'professional';
  billingCycle: 'monthly' | 'annual';
  nextBillingDate: Date;
}

export default function AccountPage() {
  const [user, setUser] = useState<User>({
    name: "John Doe",
    email: "john.doe@example.com",
    profileImage: null,
    company: "Acme Inc.",
    plan: 'free',
    billingCycle: 'monthly',
    nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  });
  
  const [notifications, setNotifications] = useState({
    emailDigest: true,
    chatbotActivity: true,
    productUpdates: false,
    securityAlerts: true,
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    company: user.company || "",
  });

  const plans = [
    {
      id: 'free',
      name: 'Free Trial',
      price: '$0',
      features: [
        '1 Chatbot',
        '25 Messages per month',
        '50 Web pages',
        '50K Character limit',
        'Basic analytics',
        'Email support',
      ],
      isCurrentPlan: user.plan === 'free',
    },
    {
      id: 'starter',
      name: 'Starter',
      price: user.billingCycle === 'monthly' ? '$29/month' : '$290/year',
      features: [
        '3 Chatbots',
        '1,000 Messages per month',
        'Unlimited web pages',
        '500K Character limit',
        'Advanced analytics',
        'Priority email support',
        'Custom branding',
      ],
      isCurrentPlan: user.plan === 'starter',
    },
    {
      id: 'basic',
      name: 'Basic',
      price: user.billingCycle === 'monthly' ? '$99/month' : '$990/year',
      features: [
        '10 Chatbots',
        '5,000 Messages per month',
        'Unlimited web pages',
        '5M Character limit',
        'Advanced analytics',
        'Priority chat support',
        'Custom branding',
        'API access',
        'Lead capture',
      ],
      isCurrentPlan: user.plan === 'basic',
    },
    {
      id: 'professional',
      name: 'Professional',
      price: user.billingCycle === 'monthly' ? '$249/month' : '$2,490/year',
      features: [
        'Unlimited Chatbots',
        'Unlimited Messages',
        'Unlimited web pages',
        'Unlimited Character limit',
        'Advanced analytics',
        '24/7 priority support',
        'Custom branding',
        'API access',
        'Lead capture',
        'SSO authentication',
        'Custom integrations',
      ],
      isCurrentPlan: user.plan === 'professional',
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const saveProfileChanges = () => {
    setUser(prev => ({
      ...prev,
      name: formData.name,
      company: formData.company,
    }));
    setIsEditing(false);
  };

  const handleNotificationChange = (setting: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleSignOut = () => {
    // In a real app, this would call a signOut function from your auth provider
    console.log("User signed out");
    // window.location.href = "/login";
  };

  const handleUpgradePlan = async () => {
    try {
      // Create a checkout session for the specified product
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: user.plan === 'free' ? 'price_starter' : 'price_basic', // Use next tier by default
          mode: 'subscription',
          successUrl: `${window.location.origin}/dashboard?checkout=success`,
          cancelUrl: `${window.location.origin}/dashboard/account?checkout=canceled`,
        }),
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('No checkout URL returned');
        alert('Failed to create checkout session. Please try again.');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to create checkout session. Please try again.');
    }
  };

  const handleManageBilling = () => {
    // In a real app, this would redirect to a Stripe customer portal
    window.open("https://billing.stripe.com", "_blank");
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Account Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Profile Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Profile Information</h2>
              
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company</label>
                    <input 
                      type="text" 
                      id="company" 
                      name="company" 
                      value={formData.company} 
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <Button onClick={saveProfileChanges}>Save Changes</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 text-xl font-semibold overflow-hidden">
                      {user.profileImage ? (
                        <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        user.name.substring(0, 1).toUpperCase()
                      )}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{user.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                      {user.company && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.company}</p>
                      )}
                    </div>
                  </div>
                  
                  <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-850 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium">Connected with Google:</span> {user.email}
              </p>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Notification Preferences</h2>
              
              <div className="space-y-4">
                {Object.entries(notifications).map(([key, enabled]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {key === 'emailDigest' && 'Weekly Email Digest'}
                        {key === 'chatbotActivity' && 'Chatbot Activity Reports'}
                        {key === 'productUpdates' && 'Product Updates'}
                        {key === 'securityAlerts' && 'Security Alerts'}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {key === 'emailDigest' && 'Receive a weekly summary of chatbot performance and leads.'}
                        {key === 'chatbotActivity' && 'Get notified about important chatbot interactions.'}
                        {key === 'productUpdates' && 'Stay updated on new features and improvements.'}
                        {key === 'securityAlerts' && 'Receive notifications about security-related events.'}
                      </p>
                    </div>
                    <div className="relative inline-flex items-center">
                      <input 
                        type="checkbox" 
                        id={key} 
                        checked={enabled} 
                        onChange={() => handleNotificationChange(key as keyof typeof notifications)}
                        className="sr-only peer" 
                      />
                      <label 
                        htmlFor={key}
                        className="block h-6 w-11 cursor-pointer rounded-full bg-gray-200 dark:bg-gray-700 peer-checked:bg-blue-600 transition-colors"
                      >
                        <span 
                          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0'}`}
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Subscription Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Subscription</h2>
                <Badge variant={
                  user.plan === 'free' ? 'secondary' : 
                  user.plan === 'starter' ? 'default' : 
                  user.plan === 'basic' ? 'success' : 'default'
                }>
                  {user.plan === 'free' ? 'Free Trial' : 
                   user.plan === 'starter' ? 'Starter' : 
                   user.plan === 'basic' ? 'Basic' : 'Professional'}
                </Badge>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Billing Cycle</p>
                  <p className="font-medium">{user.billingCycle === 'monthly' ? 'Monthly' : 'Annual'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Next Billing Date</p>
                  <p className="font-medium">
                    {user.nextBillingDate.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                
                <div className="pt-2">
                  {user.plan === 'free' ? (
                    <Button onClick={handleUpgradePlan}>Upgrade Plan</Button>
                  ) : (
                    <Button onClick={handleManageBilling}>Manage Billing</Button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Account Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Account Actions</h2>
              
              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => alert('Feature coming soon!')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Change Password
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => alert('Your data has been exported!')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" x2="12" y1="15" y2="3" />
                  </svg>
                  Export Your Data
                </Button>
                
                <Button 
                  variant="destructive" 
                  className="w-full justify-start"
                  onClick={handleSignOut}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" x2="9" y1="12" y2="12" />
                  </svg>
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 