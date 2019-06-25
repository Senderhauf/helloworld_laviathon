import { Component, OnInit, ViewChild } from '@angular/core';
import { ContactService } from '../../../services/contact.service';

import { Contact } from '../../../models/Contact';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

const myContacts: Contact[] = [
  {
    id:"5d118364fe25c7efd1a38bca",
    name:"joe doe",
    email:"joe.doe@outlook.com",
    team:"d1",
    position:"PO",
    intimacyScore:4,
    dateCreated: new Date ("2019-06-25T02:12:51.946Z"),
    lastInteraction: new Date("2019-06-25T02:12:51.946Z")
  },
  {
    id: "5d11839efe25c7efd1a38bcb",
    name: "jane smith",
    email: "jane.smith@outlook.com",
    team: "d1",
    position: "Scrum Master",
    intimacyScore: 13,
    dateCreated: new Date('2019-06-25T02:12:51.946Z'),
    lastInteraction: new Date('2019-06-25T02:12:51.946Z')
  }
]

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
  contacts: Contact[];
  dataSource: MatTableDataSource<Contact>; // = new MatTableDataSource(this.contacts);
  displayedColumns: string[] = ['name', 'position', 'team', 'email', 'last interaction'];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(private contactService: ContactService) { }

  ngOnInit() {
    this.contactService.getContacts().subscribe(contacts => {
      this.contacts = contacts['contacts'];
      console.log(JSON.stringify(this.contacts));
    });
    
    this.dataSource = new MatTableDataSource(myContacts);
    console.log(this.dataSource);

    this.dataSource.sort = this.sort;

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

}
