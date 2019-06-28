import { Component, OnInit, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Contact } from '../../../models/Contact';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact-create',
  templateUrl: './contact-create.component.html',
  styleUrls: ['./contact-create.component.css']
})
export class ContactCreateComponent implements OnInit {
  contacts: Contact[];
  // formControl = new FormControl('', [Validators.required, Validators.email, Validators.name]);

  constructor(
    public dialogRef: MatDialogRef<ContactCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public injectedContacts
  ) { }

  ngOnInit() {
    this.contacts = this.injectedContacts.contacts;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getErrorMessage(field: string) {
  
  }
}
