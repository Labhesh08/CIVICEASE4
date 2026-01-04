
import { Complaint, IssueStatus } from "../types";

const STORAGE_KEY = 'civicease_complaints_v1';

export const getComplaints = (): Complaint[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveComplaint = (complaint: Complaint) => {
  const current = getComplaints();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([complaint, ...current]));
};

export const updateComplaintStatus = (id: string, status: IssueStatus, resolutionImage?: string) => {
  const current = getComplaints();
  const updated = current.map(c => 
    c.id === id ? { ...c, status, resolutionImage: resolutionImage || c.resolutionImage } : c
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getComplaintById = (id: string): Complaint | undefined => {
  return getComplaints().find(c => c.id === id);
};
