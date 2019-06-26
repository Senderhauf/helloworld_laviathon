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
  contactsURL = 'http://localhost:3000/api/contacts';
  constructor(private http: HttpClient) { }

  getContacts() {
    return this.http.get(this.contactsURL);
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
