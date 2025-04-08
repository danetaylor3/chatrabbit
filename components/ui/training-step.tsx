import React, { useState } from 'react';

export interface TrainingSource {
  id: string;
  name: string;
  type: 'url' | 'file' | 'drive' | 'notion';
  size?: string;
  createdAt: Date;
  path?: string;
  url?: string;
}

interface TrainingStepProps {
  onNext: () => void;
  onBack: () => void;
  onAddSources: (sources: TrainingSource[]) => void;
  sources: TrainingSource[];
}

export const TrainingStep = ({ onNext, onBack, onAddSources, sources = [] }: TrainingStepProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState('');
  const [scanOptions, setScanOptions] = useState({
    termsOfService: true,
    faqs: true,
    blogs: true,
    tips: true,
    deals: false
  });

  const handleScanWebsite = () => {
    setIsLoading(true);
    // Simulate loading
    setTimeout(() => {
      // Simulate adding a new source after scanning
      const newSource: TrainingSource = {
        id: `url-${Date.now()}`,
        name: selectedUrl,
        type: 'url',
        createdAt: new Date(),
        url: selectedUrl,
        size: '~250KB'
      };
      onAddSources([...sources, newSource]);
      setIsLoading(false);
    }, 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newSources: TrainingSource[] = [];
    
    Array.from(files).forEach(file => {
      // Check file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        alert(`File ${file.name} exceeds the 2MB limit.`);
        return;
      }
      
      newSources.push({
        id: `file-${Date.now()}-${file.name}`,
        name: file.name,
        type: 'file',
        size: formatFileSize(file.size),
        createdAt: new Date(),
        path: URL.createObjectURL(file)
      });
    });

    if (newSources.length > 0) {
      onAddSources([...sources, ...newSources]);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setScanOptions(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleRemoveSource = (id: string) => {
    onAddSources(sources.filter(source => source.id !== id));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Training Your Chatbot</h2>
      
      {isLoading && (
        <div className="alert shadow-lg mb-6">
          <div className="loading loading-spinner loading-sm"></div>
          <div>
            <h3 className="font-bold">Training in progress...</h3>
            <div className="text-xs">This may take a few minutes. You'll be notified when it's complete.</div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Website URL to Scan</span>
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={selectedUrl}
              onChange={(e) => setSelectedUrl(e.target.value)}
              placeholder="https://example.com"
              className="input input-bordered flex-grow"
            />
            <button 
              className="btn btn-primary" 
              onClick={handleScanWebsite}
              disabled={!selectedUrl || isLoading}
            >
              {isLoading ? <span className="loading loading-spinner loading-xs"></span> : 'Scan'}
            </button>
          </div>
          <label className="label">
            <span className="label-text-alt">We'll crawl this website to train your chatbot</span>
          </label>
        </div>

        <div className="bg-base-200 p-4 rounded-lg">
          <label className="label">
            <span className="label-text font-medium">Pages to Scrape</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-2">
                <input 
                  type="checkbox" 
                  className="checkbox checkbox-sm checkbox-primary" 
                  name="termsOfService"
                  checked={scanOptions.termsOfService}
                  onChange={handleCheckboxChange}
                />
                <span className="label-text">Terms of Service</span>
              </label>
            </div>
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-2">
                <input 
                  type="checkbox" 
                  className="checkbox checkbox-sm checkbox-primary" 
                  name="faqs"
                  checked={scanOptions.faqs}
                  onChange={handleCheckboxChange}
                />
                <span className="label-text">FAQs</span>
              </label>
            </div>
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-2">
                <input 
                  type="checkbox" 
                  className="checkbox checkbox-sm checkbox-primary" 
                  name="blogs"
                  checked={scanOptions.blogs}
                  onChange={handleCheckboxChange}
                />
                <span className="label-text">Blog Posts</span>
              </label>
            </div>
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-2">
                <input 
                  type="checkbox" 
                  className="checkbox checkbox-sm checkbox-primary" 
                  name="tips"
                  checked={scanOptions.tips}
                  onChange={handleCheckboxChange}
                />
                <span className="label-text">Tips & Guides</span>
              </label>
            </div>
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-2">
                <input 
                  type="checkbox" 
                  className="checkbox checkbox-sm checkbox-primary" 
                  name="deals"
                  checked={scanOptions.deals}
                  onChange={handleCheckboxChange}
                />
                <span className="label-text">Deals & Promotions</span>
              </label>
            </div>
          </div>
          <p className="text-xs mt-2 text-base-content/70">We'll estimate around 25-100 URLs based on your site structure.</p>
        </div>

        <div className="divider text-sm">OR</div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Upload Files</span>
            <span className="label-text-alt">Max 2MB each</span>
          </label>
          <div className="border-2 border-dashed border-base-300 rounded-lg p-8 text-center bg-base-200/50 hover:bg-base-200 transition-colors cursor-pointer">
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              accept=".pdf,.doc,.docx,.txt,.md"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="mt-2 text-sm">Drag and drop files here, or click to browse</p>
              <p className="mt-1 text-xs text-base-content/50">
                Supports PDF, DOCX, TXT (max 2MB per file)
              </p>
            </label>
          </div>
        </div>

        <div className="divider text-sm">OR</div>

        <div className="flex flex-col gap-2">
          <button className="btn btn-outline btn-sm gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.974 17.557v-.235h-1.988v-6.5h.222l-3.475 6.5h-.211l-3.481-6.5h.222v6.5h-1.988v.235h3.211v-.235h-.6v-5.172l3.449 6.53h.193l3.424-6.607v5.249h-.599v.235h1.621z"/>
            </svg>
            Import from Notion
          </button>
          <button className="btn btn-outline btn-sm gap-2">
            <svg className="w-4 h-4" viewBox="0 0 87.3 78" fill="currentColor">
              <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
              <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
              <path d="m73.55 53-13.75-23.8-16.15 27.95 13.75 23.8c1.35-.8 2.5-1.9 3.3-3.3l13.75-23.8c.8-1.4 1.2-2.95 1.2-4.5 0-1.55-.4-3.1-1.2-4.5z" fill="#ea4335"/>
              <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
              <path d="m59.8 53-16.15-28-16.15 28z" fill="#2684fc"/>
              <path d="m43.65 53 16.15-28-13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-9.25v.05-.05h-9.25c-1.6 0-3.15.45-4.5 1.2l13.75 23.8z" fill="#ffba00"/>
            </svg>
            Import from Google Drive
          </button>
        </div>
      </div>

      {sources.length > 0 && (
        <div className="overflow-x-auto">
          <h3 className="font-medium mb-2">Uploaded Sources</h3>
          <table className="table table-zebra table-compact w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Size</th>
                <th>Date Added</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sources.map(source => (
                <tr key={source.id}>
                  <td className="max-w-xs truncate">{source.name}</td>
                  <td>{source.type.toUpperCase()}</td>
                  <td>{source.size || 'N/A'}</td>
                  <td>{source.createdAt.toLocaleDateString()}</td>
                  <td>
                    <button 
                      className="btn btn-ghost btn-xs"
                      onClick={() => handleRemoveSource(source.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-between mt-8">
        <button 
          className="btn btn-ghost"
          onClick={onBack}
        >
          Back
        </button>
        <button 
          className="btn btn-primary"
          onClick={onNext}
          disabled={isLoading}
        >
          {sources.length > 0 ? 'Continue' : 'Skip for now'}
        </button>
      </div>
    </div>
  );
}; 