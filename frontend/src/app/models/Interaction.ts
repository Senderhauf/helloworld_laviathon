import {Contact} from './Contact';

export class Interaction {
  id?: string;
  uniqueStamp: string; //combination of the Event location and starting date+time
  eventType: string;
  eventQuality: number;
  eventLocation: string;
  members: Contact[];
  startTime: Date;
  endTime: Date;
  notes: object;
}
