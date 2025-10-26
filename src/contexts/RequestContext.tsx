import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ItemRequest {
  id: string;
  userId: string;
  productName: string;
  productUrl: string;
  storeName: string;
  priceRange: string;
  description: string;
  quantity: string;
  date: string;
  status: 'Pending Review' | 'Approved' | 'Rejected';
  adminNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

interface RequestContextType {
  requests: ItemRequest[];
  addRequest: (request: Omit<ItemRequest, 'id' | 'date' | 'status'>) => void;
  updateRequestStatus: (id: string, status: ItemRequest['status'], adminNotes?: string, reviewedBy?: string) => void;
  getUserRequests: (userId: string) => ItemRequest[];
  getRequestStats: () => {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

const RequestContext = createContext<RequestContextType | undefined>(undefined);

export function RequestProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<ItemRequest[]>(() => {
    const savedRequests = localStorage.getItem('itemRequests');
    return savedRequests ? JSON.parse(savedRequests) : [];
  });

  useEffect(() => {
    localStorage.setItem('itemRequests', JSON.stringify(requests));
  }, [requests]);

  const addRequest = (request: Omit<ItemRequest, 'id' | 'date' | 'status'>) => {
    const newRequest: ItemRequest = {
      ...request,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      status: 'Pending Review',
    };
    setRequests(prev => [newRequest, ...prev]);
  };

  const updateRequestStatus = (
    id: string,
    status: ItemRequest['status'],
    adminNotes?: string,
    reviewedBy?: string
  ) => {
    setRequests(prev =>
      prev.map(request =>
        request.id === id
          ? {
              ...request,
              status,
              adminNotes,
              reviewedBy,
              reviewedAt: new Date().toISOString(),
            }
          : request
      )
    );
  };

  const getUserRequests = (userId: string) => {
    return requests.filter(request => request.userId === userId);
  };

  const getRequestStats = () => {
    return {
      total: requests.length,
      pending: requests.filter(r => r.status === 'Pending Review').length,
      approved: requests.filter(r => r.status === 'Approved').length,
      rejected: requests.filter(r => r.status === 'Rejected').length,
    };
  };

  return (
    <RequestContext.Provider
      value={{
        requests,
        addRequest,
        updateRequestStatus,
        getUserRequests,
        getRequestStats,
      }}
    >
      {children}
    </RequestContext.Provider>
  );
}

export function useRequests() {
  const context = useContext(RequestContext);
  if (context === undefined) {
    throw new Error('useRequests must be used within a RequestProvider');
  }
  return context;
}
