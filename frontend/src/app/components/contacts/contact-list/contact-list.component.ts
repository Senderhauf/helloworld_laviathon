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
  visibleContacts: Contact[];
  countContacts: number;
  pageIndex = 0;
  pageSize = 10;
  dataSource: MatTableDataSource<Contact> = new MatTableDataSource(this.contacts);
  deleteContactEvent = false;
  displayedColumns: string[] = ['name', 'rapport', 'position', 'team', 'email', 'last interaction', 'delete contact'];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(private contactService: ContactService, public dialog: MatDialog) { }

  ngOnInit() {
    this.getContacts();
  }

  getContacts() {
    this.contactService.getContacts().subscribe(contacts => {
      this.contacts = contacts['contacts'].map(c => {
        if (c.lastInteraction) {
          const d = new Date(c.lastInteraction);
          c.lastInteraction = `${d.getMonth()}/${d.getDate()}/${d.getFullYear()}`;
        }
        Object.keys(c).map(x => {
          if (typeof c[x] === 'string') {
            c[x] = c[x].toUpperCase();
          }
        });
        return c;
      });

      // this.contacts[this.pageIndex*this.pageSize, (this.pageIndex + 1)*this.pageSize]
      this.visibleContacts = this.contacts.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize);
      this.dataSource = new MatTableDataSource(this.contacts.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize));
      this.dataSource.sort = this.sort;
      this.countContacts = this.contacts.length;
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteContact(contact: Contact) {
    this.deleteContactEvent = true;

    // remove from server
    this.contactService.deleteContact(contact).subscribe(() => {
      // refresh with new contacts
      this.ngOnInit();
    });
  }

  editContactDialog(contact: Contact) {
    if (this.deleteContactEvent) {
      this.deleteContactEvent = false;
      return;
    }
    console.log(`EDIT contact: ${JSON.stringify(contact)}`);
    const dialogRef = this.dialog.open(ContactComponent, {
      data: {contactToEdit: contact}
    });

    dialogRef.afterClosed().subscribe(newContact => {
      if (newContact) {
        this.contacts.map(c => {
          if (c.email === newContact.email) {
            c = newContact;
          }
          return c;
        });
      }
      this.ngOnInit();
    });

    this.dataSource = new MatTableDataSource(this.contacts);
  }

  createNewContactDialog() {
    const dialogRef = this.dialog.open(ContactCreateComponent, {
      data: {contacts: this.contacts}
    });

    dialogRef.afterClosed().subscribe(newContacts => {
      this.contacts = newContacts;
      this.ngOnInit();
    });
  }

  pageEvent(event) {
    console.log(`page event: ${JSON.stringify(event)}`);
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.ngOnInit();
  }
}
