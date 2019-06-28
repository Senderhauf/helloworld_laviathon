import { Component, OnInit, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Contact } from '../../../models/Contact';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contact: Contact;
  constructor(
    public dialogRef: MatDialogRef<ContactComponent>,
    @Inject(MAT_DIALOG_DATA) public contactToEdit
  ) { }

  ngOnInit() {
    this.contact = this.contactToEdit.contactToEdit;
    console.log(this.contact);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
