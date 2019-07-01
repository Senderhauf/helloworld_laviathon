import { Component, OnInit, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Contact } from '../../../models/Contact';
import { FormControl, Validators } from '@angular/forms';
import { ContactService } from '../../../services/contact.service';
import * as EmailValidator from 'email-validator';

@Component({
  selector: 'app-contact-create',
  templateUrl: './contact-create.component.html',
  styleUrls: ['./contact-create.component.css']
})
export class ContactCreateComponent implements OnInit {
  contacts: Contact[];
  newContact = new Contact();
  // formControl = new FormControl('', [Validators.required, Validators.email, Validators.name]);

  constructor(
    public dialogRef: MatDialogRef<ContactCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public injectedContacts,
    private contactService: ContactService
  ) { }

  ngOnInit() {
    this.contacts = this.injectedContacts.contacts;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getErrorMessage(field: string) {
  }

  addContact(contactToAdd: Contact) {
    if (this.validateContact(contactToAdd)) {
      this.contactService.addContact(contactToAdd).subscribe(contact => {
        this.contacts.push(contact);
      });
    } else {
      console.log(`ERROR: invalid contact: ${JSON.stringify(contactToAdd)}`);
    }
  }

  validateContact(contact: Contact) {
    if (contact.name && contact.name.length !== 0 && EmailValidator.validate(contact.email)) {
      return true;
    } else {
      return false;
    }
  }
}
