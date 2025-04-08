import React, { useState } from 'react';

interface PlatformGuide {
  id: string;
  name: string;
  logo: React.ReactNode;
  instructions: React.ReactNode;
}

interface EmbedStepProps {
  onBack: () => void;
  onFinish: () => void;
  chatbotId: string;
  chatbotName: string;
}

export const EmbedStep = ({ onBack, onFinish, chatbotId, chatbotName }: EmbedStepProps) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('manual');
  
  const embedCode = `<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://chatrabbit.com/api/widget/${chatbotId}.js';
    script.async = true;
    document.head.appendChild(script);
  })();
</script>`;

  const platforms: PlatformGuide[] = [
    {
      id: 'manual',
      name: 'Manual',
      logo: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
        </svg>
      ),
      instructions: (
        <div className="space-y-4">
          <p>Add the following script to your website&apos;s HTML, just before the closing <code className="text-primary">{'<'}/body{'>'}</code> tag:</p>
          <div className="bg-base-200 p-4 rounded-lg">
            <pre className="whitespace-pre-wrap break-all text-sm">{embedCode}</pre>
            <button 
              className="btn btn-sm btn-outline mt-2"
              onClick={() => navigator.clipboard.writeText(embedCode)}
            >
              Copy Code
            </button>
          </div>
        </div>
      )
    },
    {
      id: 'gtm',
      name: 'Google Tag Manager',
      logo: (
        <svg className="w-6 h-6" viewBox="0 0 128 128" fill="#4285f4" xmlns="http://www.w3.org/2000/svg">
          <path d="M83.051 59.945c-6.395 0-11.581 5.188-11.581 11.584s5.186 11.581 11.581 11.581 11.584-5.185 11.584-11.581-5.188-11.584-11.584-11.584M56.946 64.013v.062L59.295 73.406v.068c.939 2.716 3.53 4.639 6.563 4.636 3.809-.004 6.893-3.091 6.895-6.9.003-1.929-.792-3.774-2.197-5.092l-.052-.051-8.44-7.457-.069-.055c-.742-.668-1.713-1.045-2.716-1.06-2.328-.035-4.24 1.829-4.275 4.158-.012.784.193 1.555.594 2.235l.348.125M64 0C28.654 0 0 28.654 0 64s28.654 64 64 64 64-28.654 64-64S99.346 0 64 0" />
        </svg>
      ),
      instructions: (
        <div className="space-y-4">
          <ol className="list-decimal list-inside space-y-2">
            <li>Log in to your Google Tag Manager account</li>
            <li>Create a new Custom HTML tag</li>
            <li>Paste the following code into the HTML field:</li>
          </ol>
          <div className="bg-base-200 p-4 rounded-lg">
            <pre className="whitespace-pre-wrap break-all text-sm">{embedCode}</pre>
            <button 
              className="btn btn-sm btn-outline mt-2"
              onClick={() => navigator.clipboard.writeText(embedCode)}
            >
              Copy Code
            </button>
          </div>
          <ol className="list-decimal list-inside space-y-2" start={4}>
            <li>Set the trigger to "All Pages"</li>
            <li>Save and publish your container</li>
          </ol>
        </div>
      )
    },
    {
      id: 'wordpress',
      name: 'WordPress',
      logo: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.158.15c-6.614 0-12 5.387-12 12 0 6.614 5.386 12 12 12s12-5.386 12-12c0-6.613-5.386-12-12-12zm0 23.144c-6.142 0-11.144-5-11.144-11.144C1.014 6.01 6.016 1.01 12.158 1.01c6.142 0 11.143 5 11.143 11.142 0 6.143-5 11.143-11.143 11.143zM2.55 12.15c0 5.29 3.072 9.855 7.53 12.012L3.52 8.24c-.63 1.205-.97 2.57-.97 4.02zm17.483-1.178c0-1.654-.594-2.8-1.104-3.69-.68-1.1-1.317-2.03-1.317-3.132 0-1.226.93-2.367 2.242-2.367.06 0 .115.007.17.01-2.37-2.17-5.52-3.498-8.98-3.498-4.65 0-8.74 2.382-11.125 5.996.313.01.607.016.857.016 1.39 0 3.545-.17 3.545-.17.717-.04.8 1.01.085 1.104 0 0-.72.084-1.52.126l4.834 14.374 2.902-8.704-2.066-5.67c-.718-.042-1.394-.126-1.394-.126-.72-.042-.636-1.146.082-1.104 0 0 2.194.17 3.502.17 1.39 0 3.544-.17 3.544-.17.72-.04.803 1.01.086 1.104 0 0-.72.084-1.52.126l4.797 14.263 1.324-4.432c.575-1.835 1.01-3.156 1.01-4.293zm-6.838 1.81l-3.985 11.582c1.192.35 2.45.546 3.748.546 1.548 0 3.028-.268 4.407-.757-.035-.056-.066-.113-.093-.177L13.2 12.78zm8.282-5.456c.057.42.09.87.09 1.353 0 1.34-.25 2.84-1.002 4.72l-4.022 11.636c3.915-2.282 6.552-6.51 6.552-11.38 0-2.273-.58-4.415-1.62-6.278z" />
        </svg>
      ),
      instructions: (
        <div className="space-y-4">
          <ol className="list-decimal list-inside space-y-2">
            <li>Log in to your WordPress admin dashboard</li>
            <li>Go to Appearance > Theme Editor (or use a header/footer plugin)</li>
            <li>Edit your theme&apos;s footer.php file</li>
            <li>Paste the code before the closing <code className="text-primary">{'<'}/body{'>'}</code> tag:</li>
          </ol>
          <div className="bg-base-200 p-4 rounded-lg">
            <pre className="whitespace-pre-wrap break-all text-sm">{embedCode}</pre>
            <button 
              className="btn btn-sm btn-outline mt-2"
              onClick={() => navigator.clipboard.writeText(embedCode)}
            >
              Copy Code
            </button>
          </div>
          <ol className="list-decimal list-inside space-y-2" start={5}>
            <li>Save the changes</li>
          </ol>
        </div>
      )
    },
    {
      id: 'shopify',
      name: 'Shopify',
      logo: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.9973 4.07528L13.8183 4.26386C13.639 4.14573 13.3493 4.0843 13.0348 4.06458C13.0248 4.04266 12.8358 3.0765 12.6465 2.06753C12.4569 1.05878 12.3775 0.58545 12.3775 0.58545C12.3775 0.58545 11.3687 0.550203 10.9146 0.544566C10.4604 0.539293 10.2609 0.594198 10.0518 0.665884C9.84201 0.73757 8.10499 1.25799 7.25473 1.53804L7.20434 1.55359C7.04506 1.99879 6.8857 2.48195 6.72642 2.99783L3.39428 4.00679C3.39428 4.00679 2.94004 4.12709 2.71023 4.35131C2.4805 4.57554 2.36011 5.36038 2.36011 5.36038L0.24362 17.8379C0.24362 17.8379 1.73324 19.5749 3.49473 20.9454C5.2563 22.3157 6.92336 23.3145 7.30355 23.5284C7.64359 23.2298 12.3528 20.6147 15.4333 16.5367C15.5233 16.5464 15.6231 16.551 15.7234 16.551C17.8295 16.551 19.5357 14.844 19.5357 12.7371C19.5357 11.4341 18.9515 10.2734 18.0259 9.5228C17.9909 9.44172 17.9855 9.38264 18.0205 9.33831C18.1359 9.18678 18.2561 9.00622 18.3713 8.79645C18.8559 7.92196 19.1559 6.64417 19.0405 5.46377C18.9058 4.10343 18.3158 2.85351 17.8056 3.02396C16.4359 3.43108 14.8162 3.97688 13.9973 4.07528ZM15.2234 9.23791C15.2234 9.23791 14.9088 11.2909 13.5242 11.9177C13.4993 11.5796 13.4743 11.2514 13.4394 10.8937C14.2286 10.5653 14.8187 9.78073 15.0936 8.8358C15.1635 8.96135 15.2234 9.23791 15.2234 9.23791ZM14.7139 8.30999C14.6193 8.76507 14.4347 9.18657 14.1745 9.55569C13.6154 9.19102 13.1408 8.68987 12.8009 8.04293C13.7057 7.94463 14.2739 7.09799 14.5248 6.39918C14.6295 6.08545 14.7042 5.67842 14.7338 5.2614C14.9584 5.97957 15.0139 6.83621 14.9538 7.61089C14.874 7.88755 14.7985 8.1367 14.7139 8.30999Z" />
        </svg>
      ),
      instructions: (
        <div className="space-y-4">
          <ol className="list-decimal list-inside space-y-2">
            <li>Log in to your Shopify admin dashboard</li>
            <li>Go to Online Store > Themes</li>
            <li>Click "Actions" on your current theme and select "Edit code"</li>
            <li>Look for the theme.liquid file under Layout</li>
            <li>Add the code just before the closing <code className="text-primary">{'<'}/body{'>'}</code> tag:</li>
          </ol>
          <div className="bg-base-200 p-4 rounded-lg">
            <pre className="whitespace-pre-wrap break-all text-sm">{embedCode}</pre>
            <button 
              className="btn btn-sm btn-outline mt-2"
              onClick={() => navigator.clipboard.writeText(embedCode)}
            >
              Copy Code
            </button>
          </div>
          <ol className="list-decimal list-inside space-y-2" start={6}>
            <li>Save the changes</li>
          </ol>
        </div>
      )
    },
    {
      id: 'webflow',
      name: 'Webflow',
      logo: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.802 8.56s-1.717 6.114-1.972 7.023c-.046-.625-.485-6.886-.485-6.886-2.326 0-3.5 1.587-4.16 3.264 0 0-1.654 4.36-1.894 5.004-.026-.557-.374-4.9-.374-4.9.008-1.498-2.335-3.038-4.339-3.038l1.67 9.884c2.515 0 3.77-1.584 4.484-3.265 0 0 1.442-3.752 1.613-4.184.026.437.502 7.454.502 7.454 2.534 0 3.8-1.352 4.557-2.936 0 0 2.946-8.424 3.005-8.547.214-.35.317-.604.317-.872-.007-1.27-2.926-1.27-2.926-1.27l.002.27z" />
        </svg>
      ),
      instructions: (
        <div className="space-y-4">
          <ol className="list-decimal list-inside space-y-2">
            <li>Open your Webflow project</li>
            <li>Click on the project settings (gear icon)</li>
            <li>Navigate to the "Custom Code" tab</li>
            <li>Paste the code in the "Footer Code" section:</li>
          </ol>
          <div className="bg-base-200 p-4 rounded-lg">
            <pre className="whitespace-pre-wrap break-all text-sm">{embedCode}</pre>
            <button 
              className="btn btn-sm btn-outline mt-2"
              onClick={() => navigator.clipboard.writeText(embedCode)}
            >
              Copy Code
            </button>
          </div>
          <ol className="list-decimal list-inside space-y-2" start={5}>
            <li>Save and publish your site</li>
          </ol>
        </div>
      )
    },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Add {chatbotName} to Your Website</h2>
      
      <div className="alert alert-success shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h3 className="font-bold">Your chatbot is ready!</h3>
          <div className="text-xs">Follow the instructions below to add it to your website.</div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <div className="bg-base-100 rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <h3 className="font-medium">Choose Your Platform</h3>
            </div>
            <div className="p-2">
              {platforms.map(platform => (
                <button
                  key={platform.id}
                  className={`w-full text-left p-3 rounded-lg flex items-center gap-3 hover:bg-base-200 transition-colors ${selectedPlatform === platform.id ? 'bg-primary/10 text-primary' : ''}`}
                  onClick={() => setSelectedPlatform(platform.id)}
                >
                  <span className="flex-shrink-0">{platform.logo}</span>
                  <span>{platform.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="md:w-2/3">
          <div className="bg-base-100 rounded-lg p-6 h-full">
            <h3 className="font-medium mb-4">
              {platforms.find(p => p.id === selectedPlatform)?.name} Installation Guide
            </h3>
            {platforms.find(p => p.id === selectedPlatform)?.instructions}
          </div>
        </div>
      </div>

      <div className="border-t pt-6 mt-8">
        <div className="flex justify-between">
          <button 
            className="btn btn-ghost"
            onClick={onBack}
          >
            Back
          </button>
          <button 
            className="btn btn-primary"
            onClick={onFinish}
          >
            Finish Setup
          </button>
        </div>
      </div>
    </div>
  );
}; 