import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ContactService } from '../../../services/contact.service';

import { Contact } from '../../../models/Contact';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  @Input() contact: Contact;
  @Output() deleteContact: EventEmitter<Contact> = new EventEmitter();
  panelOpenState: string;

  constructor(private contactService: ContactService) { }

  ngOnInit() {
  }

  onDelete(contact) {
    this.deleteContact.emit(contact);
  }
}
