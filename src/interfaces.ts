// interface for event logging

interface Event {
  timestamp: Date;
  eventType: string;
  userId?: string;
  eventData?: any;
}
