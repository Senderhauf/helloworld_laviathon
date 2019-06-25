export class Contact {
  id: string; // This may change to type number depending on how mongodb handles indexing
  name: string;
  email: string;
  team: string;
  position: string;
  intimacyScore: number;
  dateCreated: Date;
  lastInteraction: Date;
}
