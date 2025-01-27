import React, { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import axios from 'axios';
import { XCircle } from 'lucide-react';
import Modal from '../components/Modal';
import { toast } from 'react-toastify';
import axiosInstance from '../axios';

interface Lead {
  LeadID: number;
  FirstName: string;
  LastName: string;
  Email: string;
  PhoneNumber: string;
  Status: string;
}

const LeadsList = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axiosInstance.get('api/leads/');
        setLeads(response.data);
      } catch (err) {
        setError('Failed to fetch leads');
        toast.error('Failed to fetch leads');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  if (loading) {
    return <p>Loading leads...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const handleDisplayLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">Recent Leads</h2>
      <div className="space-y-4">
        {leads.map((lead) => (
          <div key={lead.LeadID} className="flex items-center justify-between border-b pb-4 cursor-pointer" onClick={() => handleDisplayLead(lead)}>
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <User className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium">{`${lead.FirstName} ${lead.LastName}`}</p>
                <p className="text-sm text-gray-500">Email: {lead.Email}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm font-medium ${lead.Status === 'New' ? 'text-red-500' : 'text-yellow-500'}`}>
                {lead.Status}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedLead && (
          <div>
            <div className="flex justify-between">
              <h3 className="text-xl font-semibold mb-4">Lead Details</h3>
              <XCircle className="cursor-pointer" onClick={() => setIsModalOpen(false)} />
            </div>
            <div className="space-y-2">
              <p><strong>Name:</strong> {selectedLead.FirstName} {selectedLead.LastName}</p>
              <p><strong>Email:</strong> {selectedLead.Email}</p>
              <p><strong>Phone:</strong> {selectedLead.PhoneNumber}</p>
              </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LeadsList;