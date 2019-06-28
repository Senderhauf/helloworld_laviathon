export class Contact {
  id: string; // This may change to type number depending on how mongodb handles indexing
  name: string;
  email: string;
  team: string;
  position: string;
  rapport: number;
  dateCreated: Date;
  lastInteraction: Date;
  notes: object;
}
