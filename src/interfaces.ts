// interface for event logging

export interface Event {
  timestamp: Date;
  eventType: string;
  userId?: string;
  eventData?: any;
}

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  createdAt: string;
  scores: number;
}
