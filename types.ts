
export enum IssueStatus {
  SUBMITTED = 'Submitted',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved'
}

export enum UserRole {
  CITIZEN = 'Citizen',
  OFFICER = 'Officer'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  officerId?: string;
  mobile?: string;
}

export interface Complaint {
  id: string;
  uid: string;
  name: string;
  mobile: string;
  email: string;
  address: string;
  description: string;
  category: string;
  department: string;
  helpline: string;
  imageUrl: string;
  status: IssueStatus;
  location: {
    lat: number;
    lng: number;
    addressLine?: string;
  };
  createdAt: number;
  resolutionImage?: string;
}

export interface AICategorization {
  category: string;
  department: string;
  helpline: string;
  summary: string;
}
