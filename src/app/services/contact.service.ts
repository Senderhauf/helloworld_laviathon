import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Contact } from '../models/Contact';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactsURL: string = 'http://localhost:3001/api/contacts';
  constructor(private http: HttpClient) { }

  // getContacts(): Observable<Contact[]> {
  //   return this.http.get<Contact[]>(this.contactsURL);
  // }

  getContacts(): Contact[] {
    return [
      {
        id: '123',
        firstName: 'jon',
        lastName: 'doe',
        email: 'jon.doe@outlook.com',
        team: 'D1',
        position: 'PO',
        intimacyScore: 42,
        dateCreated: new Date(),
        lastInteraction: new Date()
      },
      {
        id: '234',
        firstName: 'jane',
        lastName: 'smith',
        email: 'jane.smith@outlook.com',
        team: 'D1',
        position: 'PM',
        intimacyScore: 32,
        dateCreated: new Date(),
        lastInteraction: new Date()
      }
    ];
  }

  deleteContact(contact: Contact): Observable<Contact> {
    const url = `${this.contactsURL}/${contact.id}`;
    return this.http.delete<Contact>(url, httpOptions);
  }

  addContact(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(this.contactsURL, contact, httpOptions);
  }


  //TODO: create method 'editContact()'

}
