import { Component, OnInit, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Contact } from '../../../models/Contact';
import { ContactService } from 'src/app/services/contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contact: Contact;
  editedContact: Contact;
  constructor(
    public dialogRef: MatDialogRef<ContactComponent>,
    @Inject(MAT_DIALOG_DATA) public contactToEdit,
    private contactService: ContactService
  ) { }

  ngOnInit() {
    this.contact = this.contactToEdit.contactToEdit;
    this.editedContact = {id: 'tempID', name: this.contact.name, email: this.contact.email, dateCreated: this.contact.dateCreated};
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  editContact(contactToEdit: Contact) {
    this.contactService.addContact(contactToEdit).subscribe(contact => {
      this.contact = contact;
    });
    this.onNoClick();
  }
}
