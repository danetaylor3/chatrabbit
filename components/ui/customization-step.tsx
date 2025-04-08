import React, { useState } from 'react';

export interface ChatbotCustomization {
  welcomeMessage: string;
  placeholderText: string;
  instructions: string;
  logoUrl: string | null;
  iconType: 'robot' | 'dialog' | 'messages' | 'custom';
  position: 'bottom-right' | 'bottom-left';
  accentColor: string;
  fontFamily: string;
  textColor: string;
  hideBranding: boolean;
  captureLeads: boolean;
  targeting: {
    devices: {
      desktop: boolean;
      mobile: boolean;
      tablet: boolean;
    };
    allPages: boolean;
    specificUrls: string[];
  };
}

interface CustomizationStepProps {
  onNext: () => void;
  onBack: () => void;
  customization: ChatbotCustomization;
  onCustomizationChange: (customization: ChatbotCustomization) => void;
  isPremium: boolean;
}

const FONT_OPTIONS = [
  { value: 'Inter', label: 'Inter (Modern Sans-Serif)' },
  { value: 'Roboto', label: 'Roboto (Clean Sans-Serif)' },
  { value: 'Merriweather', label: 'Merriweather (Classic Serif)' },
  { value: 'Poppins', label: 'Poppins (Friendly Sans-Serif)' },
  { value: 'Montserrat', label: 'Montserrat (Elegant Sans-Serif)' },
  { value: 'Open Sans', label: 'Open Sans (Readable Sans-Serif)' },
];

export const CustomizationStep = ({ 
  onNext, 
  onBack, 
  customization, 
  onCustomizationChange,
  isPremium 
}: CustomizationStepProps) => {
  const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'targeting'>('general');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onCustomizationChange({
      ...customization,
      [name]: value
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    if (name.startsWith('targeting.devices.')) {
      const device = name.split('.')[2];
      onCustomizationChange({
        ...customization,
        targeting: {
          ...customization.targeting,
          devices: {
            ...customization.targeting.devices,
            [device]: checked
          }
        }
      });
    } else if (name === 'targeting.allPages') {
      onCustomizationChange({
        ...customization,
        targeting: {
          ...customization.targeting,
          allPages: checked
        }
      });
    } else {
      onCustomizationChange({
        ...customization,
        [name]: checked
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      onCustomizationChange({
        ...customization,
        logoUrl: event.target?.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  const handleIconChange = (iconType: 'robot' | 'dialog' | 'messages' | 'custom') => {
    onCustomizationChange({
      ...customization,
      iconType
    });
  };

  const handlePositionChange = (position: 'bottom-right' | 'bottom-left') => {
    onCustomizationChange({
      ...customization,
      position
    });
  };

  return (
    <div className="flex flex-col space-y-6">
      <h2 className="text-xl font-semibold">Customize Your Chatbot</h2>
      
      <div className="tabs">
        <a 
          className={`tab tab-lifted ${activeTab === 'general' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          General
        </a>
        <a 
          className={`tab tab-lifted ${activeTab === 'appearance' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('appearance')}
        >
          Appearance
        </a>
        <a 
          className={`tab tab-lifted ${activeTab === 'targeting' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('targeting')}
        >
          Targeting
        </a>
      </div>

      <div className="bg-base-100 p-6 rounded-lg">
        {activeTab === 'general' && (
          <div className="space-y-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Welcome Message</span>
              </label>
              <input
                type="text"
                name="welcomeMessage"
                value={customization.welcomeMessage}
                onChange={handleInputChange}
                placeholder="Hi there! How can I help you today?"
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Placeholder Text</span>
              </label>
              <input
                type="text"
                name="placeholderText"
                value={customization.placeholderText}
                onChange={handleInputChange}
                placeholder="Ask me anything..."
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Instructions (AI Prompt)</span>
              </label>
              <textarea
                name="instructions"
                value={customization.instructions}
                onChange={handleInputChange}
                placeholder="You are a helpful assistant that answers questions about our products and services..."
                className="textarea textarea-bordered w-full"
                rows={4}
              />
              <label className="label">
                <span className="label-text-alt">Customize how your chatbot responds to queries</span>
              </label>
            </div>

            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-2">
                <input 
                  type="checkbox" 
                  className="checkbox checkbox-primary" 
                  name="captureLeads"
                  checked={customization.captureLeads}
                  onChange={handleCheckboxChange}
                />
                <div>
                  <span className="label-text">Capture Leads</span>
                  <p className="text-xs text-base-content/70 mt-1">
                    Automatically collect user's contact information when they interact with your chatbot
                  </p>
                </div>
              </label>
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="space-y-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Chatbot Logo</span>
              </label>
              <div className="flex items-center gap-4">
                <div className="avatar">
                  <div className="w-16 h-16 rounded-full bg-base-300 flex items-center justify-center overflow-hidden">
                    {customization.logoUrl ? (
                      <img src={customization.logoUrl} alt="Logo" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                </div>
                <div>
                  <input
                    type="file"
                    id="logo-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="logo-upload" className="btn btn-sm btn-outline">
                    Upload Logo
                  </label>
                </div>
              </div>
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Icon Type</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {[
                  { id: 'robot', label: 'Robot' },
                  { id: 'dialog', label: 'Dialog' },
                  { id: 'messages', label: 'Messages' },
                  { id: 'custom', label: 'Custom Logo' }
                ].map(icon => (
                  <div
                    key={icon.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      customization.iconType === icon.id ? 'border-primary bg-primary/10' : 'border-base-300'
                    }`}
                    onClick={() => handleIconChange(icon.id as any)}
                  >
                    {icon.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Position</span>
              </label>
              <div className="flex gap-3">
                {[
                  { id: 'bottom-right', label: 'Bottom Right' },
                  { id: 'bottom-left', label: 'Bottom Left' }
                ].map(pos => (
                  <div
                    key={pos.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      customization.position === pos.id ? 'border-primary bg-primary/10' : 'border-base-300'
                    }`}
                    onClick={() => handlePositionChange(pos.id as any)}
                  >
                    {pos.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Accent Color</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="accentColor"
                  value={customization.accentColor}
                  onChange={handleInputChange}
                  className="h-10 w-20"
                />
                <input
                  type="text"
                  name="accentColor"
                  value={customization.accentColor}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="#10b981"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Font Family</span>
                </label>
                <select
                  name="fontFamily"
                  value={customization.fontFamily}
                  onChange={handleInputChange}
                  className="select select-bordered w-full"
                >
                  {FONT_OPTIONS.map(font => (
                    <option key={font.value} value={font.value}>{font.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Text Color</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    name="textColor"
                    value={customization.textColor}
                    onChange={handleInputChange}
                    className="h-10 w-20"
                  />
                  <input
                    type="text"
                    name="textColor"
                    value={customization.textColor}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    placeholder="#000000"
                  />
                </div>
              </div>
            </div>

            <div className="form-control mt-2">
              <label className={`label cursor-pointer justify-start gap-2 ${!isPremium ? 'opacity-50' : ''}`}>
                <input 
                  type="checkbox" 
                  className="checkbox checkbox-primary" 
                  name="hideBranding"
                  checked={customization.hideBranding}
                  onChange={handleCheckboxChange}
                  disabled={!isPremium}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="label-text">Hide ChatRabbit Branding</span>
                    {!isPremium && (
                      <div className="badge badge-primary badge-sm">Premium</div>
                    )}
                  </div>
                  <p className="text-xs text-base-content/70 mt-1">
                    Remove "Powered by ChatRabbit" text from the chatbot
                  </p>
                </div>
              </label>
            </div>
          </div>
        )}

        {activeTab === 'targeting' && (
          <div className="space-y-6">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Devices</span>
                <span className="label-text-alt">Select where your chatbot appears</span>
              </label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: 'desktop', label: 'Desktop', icon: 'M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm0 2v8h16V7H4zm-3 12h22v2H1v-2z' },
                  { id: 'mobile', label: 'Mobile', icon: 'M15 2H9a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm-3 18a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm3-3H9V5h6v12z' },
                  { id: 'tablet', label: 'Tablet', icon: 'M18 2a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h12zm0 18V4H6v16h12zm-6-5a1 1 0 1 1 0 2 1 1 0 0 1 0-2z' },
                ].map(device => (
                  <label key={device.id} className="cursor-pointer border rounded-lg p-4 flex flex-col items-center justify-center gap-2 transition-all hover:border-primary">
                    <input 
                      type="checkbox" 
                      className="checkbox checkbox-primary checkbox-sm" 
                      name={`targeting.devices.${device.id}`}
                      checked={customization.targeting.devices[device.id as keyof typeof customization.targeting.devices]}
                      onChange={handleCheckboxChange}
                    />
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="currentColor" 
                      className="w-7 h-7 text-base-content/70"
                    >
                      <path d={device.icon} />
                    </svg>
                    <span className="text-sm mt-1">{device.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Pages</span>
              </label>
              <div className="space-y-3">
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-2">
                    <input 
                      type="checkbox" 
                      className="radio radio-primary radio-sm" 
                      name="targeting.allPages"
                      checked={customization.targeting.allPages}
                      onChange={handleCheckboxChange}
                    />
                    <span className="label-text">All pages</span>
                  </label>
                </div>
                
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-2">
                    <input 
                      type="checkbox" 
                      className="radio radio-primary radio-sm" 
                      name="targeting.allPages"
                      checked={!customization.targeting.allPages}
                      onChange={(e) => handleCheckboxChange({
                        ...e,
                        target: { ...e.target, name: 'targeting.allPages', checked: !e.target.checked }
                      } as any)}
                    />
                    <span className="label-text">Specific URLs only</span>
                  </label>
                </div>

                {!customization.targeting.allPages && (
                  <div className="pl-7">
                    <div className="form-control w-full">
                      <input
                        type="text"
                        placeholder="Enter URL patterns (e.g., /pricing/*, /blog/*)"
                        className="input input-bordered w-full"
                      />
                      <label className="label">
                        <span className="label-text-alt">Add multiple patterns separated by commas</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-between mt-4">
        <button 
          className="btn btn-ghost"
          onClick={onBack}
        >
          Back
        </button>
        <button 
          className="btn btn-primary"
          onClick={onNext}
        >
          Continue
        </button>
      </div>
    </div>
  );
}; 