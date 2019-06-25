import { Component, OnInit } from '@angular/core';
import { ContactService } from '../../../services/contact.service';

import { Contact } from '../../../models/Contact';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
  contacts: Contact[];

  constructor(private contactService: ContactService) { }

  ngOnInit() {
    this.contactService.getContacts().subscribe(contacts => {
      this.contacts = contacts['contacts'];
    });
  }

  deleteContact(contact: Contact) {
    // remove from ui
    this.contacts = this.contacts.filter(c => c._id !== contact._id);
    // remove from server
    this.contactService.deleteContact(contact).subscribe();
  }

  addContact(contact: Contact) {
    this.contactService.addContact(contact).subscribe(contact => {
      this.contacts.push(contact);
    });
  }

}
