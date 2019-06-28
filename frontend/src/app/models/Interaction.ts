import {Contact} from './Contact';

export class Interaction {
  id: string;
  eventType: string;
  eventQualtity: number;
  eventLocation: string;
  members: Contact[];
  startTime: Date;
  endTime: Date;
}
