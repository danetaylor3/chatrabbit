import React from 'react';

interface TabItem {
  id: string;
  title: string;
}

interface TabNavigationProps {
  tabs: TabItem[];
  currentTab: string;
  onChange: (tabId: string) => void;
}

export const TabNavigation = ({ tabs, currentTab, onChange }: TabNavigationProps) => {
  return (
    <div className="tabs tabs-boxed bg-base-200 p-1 mb-6">
      {tabs.map((tab) => (
        <a 
          key={tab.id}
          className={`tab ${currentTab === tab.id ? 'tab-active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.title}
        </a>
      ))}
    </div>
  );
}; 