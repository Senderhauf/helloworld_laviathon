export class Contact {
  _id: string; // This may change to type number depending on how mongodb handles indexing
  firstName: string;
  lastName: string;
  email: string;
  team: string;
  position: string;
  intimacyScore: number;
  dateCreated: Date;
  lastInteraction: Date;
}
