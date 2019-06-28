import { Component, OnInit, ViewChild } from '@angular/core';
import { ContactService } from '../../../services/contact.service';

import { Contact } from '../../../models/Contact';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { MatDialog } from '@angular/material/dialog';
import { ContactCreateComponent } from '../contact-create/contact-create.component';
import { ContactComponent } from '../contact/contact.component';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
  contacts: Contact[];
  dataSource: MatTableDataSource<Contact> = new MatTableDataSource(this.contacts);
  displayedColumns: string[] = ['name', 'rapport', 'position', 'team', 'email', 'last interaction'];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(private contactService: ContactService, public dialog: MatDialog) { }

  ngOnInit() {
    this.contactService.getContacts().subscribe(contacts => {
      this.contacts = contacts['contacts'].map(c => {
        const d = new Date(c.lastInteraction);
        c.lastInteraction = `${d.getMonth()}/${d.getDate()}/${d.getFullYear()}`;
        Object.keys(c).map(x => {
          if (typeof c[x] === 'string') {
            c[x] = c[x].toUpperCase();
          }
        });
        return c;
      });
      this.dataSource = new MatTableDataSource(this.contacts);
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteContact(contact: Contact) {
    // remove from ui
    this.contacts = this.contacts.filter(c => c.id !== contact.id);
    // remove from server
    this.contactService.deleteContact(contact).subscribe();
  }

  addContact(contact: Contact) {
    this.contactService.addContact(contact).subscribe(contact => {
      this.contacts.push(contact);
    });
  }

  editContactDialog(contact: Contact) {
    const dialogRef = this.dialog.open(ContactComponent, {
      data: {contactToEdit: contact}
    });

    dialogRef.afterClosed().subscribe(newContact => {
      this.contacts.map(c => {
        if (c.email === newContact.email) {
          c = newContact;
        }
        return c;
      })
    })
  }

  createNewContactDialog() {
    const dialogRef = this.dialog.open(ContactCreateComponent, {
      // width: '80%', 
      data: {contacts: this.contacts}
    });

    dialogRef.afterClosed().subscribe(newContacts => {
      this.contacts = newContacts;
    });
  }

  
}
