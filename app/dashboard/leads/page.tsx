"use client";

import React, { useState } from "react";

interface Lead {
  id: string;
  name: string;
  email: string;
  chatbotId: string;
  chatbotName: string;
  query: string;
  timestamp: Date;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed';
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: "1",
      name: "Michael Johnson",
      email: "michael.j@example.com",
      chatbotId: "1",
      chatbotName: "Rental Inquiry Assistant",
      query: "Looking for a 3-bedroom house in the Westside neighborhood",
      timestamp: new Date('2023-10-28T14:32:00'),
      status: 'new'
    },
    {
      id: "2",
      name: "Sarah Williams",
      email: "sarah.w@example.com",
      chatbotId: "2",
      chatbotName: "Maintenance Request Bot",
      query: "Interested in a 1-bedroom apartment close to downtown with parking",
      timestamp: new Date('2023-10-27T10:15:00'),
      status: 'contacted'
    },
    {
      id: "3",
      name: "David Brown",
      email: "david.b@example.com",
      chatbotId: "1",
      chatbotName: "Rental Inquiry Assistant",
      query: "Looking for a pet-friendly condo with 2 bedrooms under $1,800/month",
      timestamp: new Date('2023-10-26T16:45:00'),
      status: 'qualified'
    },
    {
      id: "4",
      name: "Emma Davis",
      email: "emma.d@example.com",
      chatbotId: "2",
      chatbotName: "Maintenance Request Bot",
      query: "Need a 2-bedroom with a home office space and garage",
      timestamp: new Date('2023-10-25T11:22:00'),
      status: 'converted'
    },
    {
      id: "5",
      name: "James Wilson",
      email: "james.w@example.com",
      chatbotId: "1",
      chatbotName: "Rental Inquiry Assistant",
      query: "Searching for a short-term lease (6 months) for a furnished apartment",
      timestamp: new Date('2023-10-24T09:18:00'),
      status: 'closed'
    }
  ]);

  // Filters
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedChatbot, setSelectedChatbot] = useState<string>("all");

  // Pagination (simplified for demo)
  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 10;

  // Chatbots
  const chatbots = [
    { id: "1", name: "Rental Inquiry Assistant" },
    { id: "2", name: "Maintenance Request Bot" },
  ];

  // Filter leads based on filters
  const filteredLeads = leads.filter(lead => {
    // Filter by status
    if (filterStatus !== "all" && lead.status !== filterStatus) {
      return false;
    }
    
    // Filter by chatbot
    if (selectedChatbot !== "all" && lead.chatbotId !== selectedChatbot) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        lead.name.toLowerCase().includes(query) || 
        lead.email.toLowerCase().includes(query) || 
        lead.query.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  // Sort leads by timestamp (most recent first)
  const sortedLeads = [...filteredLeads].sort((a, b) => 
    b.timestamp.getTime() - a.timestamp.getTime()
  );
  
  // Get current leads for pagination
  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = sortedLeads.slice(indexOfFirstLead, indexOfLastLead);

  // Update lead status
  const updateLeadStatus = (id: string, newStatus: Lead['status']) => {
    setLeads(leads.map(lead => 
      lead.id === id ? { ...lead, status: newStatus } : lead
    ));
  };

  // Export leads as CSV
  const exportLeadsToCsv = () => {
    const headers = ['Name', 'Email', 'Chatbot', 'Query', 'Timestamp', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredLeads.map(lead => [
        lead.name,
        lead.email,
        lead.chatbotName,
        `"${lead.query.replace(/"/g, '""')}"`, // Escape quotes in CSV
        lead.timestamp.toISOString(),
        lead.status
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leads_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadgeClass = (status: Lead['status']) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'qualified':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'converted':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'closed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Leads</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and track potential customers</p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-4 flex-1">
          <div className="max-w-xs w-full">
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              id="status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          
          <div className="max-w-xs w-full">
            <label htmlFor="chatbot-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Chatbot
            </label>
            <select
              id="chatbot-filter"
              value={selectedChatbot}
              onChange={(e) => setSelectedChatbot(e.target.value)}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
            >
              <option value="all">All Chatbots</option>
              {chatbots.map((bot) => (
                <option key={bot.id} value={bot.id}>{bot.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-1">
            <label htmlFor="search-leads" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search-leads"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or query..."
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
            />
          </div>
        </div>
        
        <div className="flex items-end">
          <button
            onClick={exportLeadsToCsv}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
              Export CSV
            </span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source Chatbot</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Query</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {currentLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {lead.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <a href={`mailto:${lead.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                      {lead.email}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {lead.chatbotName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-[250px] truncate">
                    {lead.query}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {lead.timestamp.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(lead.status)}`}>
                      {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <select
                      value={lead.status}
                      onChange={(e) => updateLeadStatus(lead.id, e.target.value as Lead['status'])}
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="converted">Converted</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredLeads.length === 0 ? (
          <div className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
            No leads found matching your filters.
          </div>
        ) : (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing {currentLeads.length} of {filteredLeads.length} leads
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 