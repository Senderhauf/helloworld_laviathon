import { Component, OnInit, ViewChild } from '@angular/core';
import { InteractionService } from '../../../services/interaction.service';

import { Interaction } from '../../../models/Interaction';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { MatDialog } from '@angular/material/dialog';
import { InteractionCreateComponent } from '../interaction-create/interaction-create.component';
import { InteractionComponent } from '../interaction/interaction.component';

@Component({
  selector: 'app-interaction-list',
  templateUrl: './interaction-list.component.html',
  styleUrls: ['./interaction-list.component.css']
})
export class InteractionListComponent implements OnInit {
  interactions: Interaction[];
  visibleInteractions: Interaction[];
  countInteractions: number;
  pageIndex = 0;
  pageSize = 10;
  dataSource: MatTableDataSource<Interaction> = new MatTableDataSource(this.interactions);
  deleteInteractionEvent = false;
  displayedColumns: string[] = [
    'eventType', 'eventQuality', 'eventLocation', 'members', 'startTime', 'endTime', 'deleteInteraction'
  ];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(private interactionService: InteractionService, public dialog: MatDialog) { }

  ngOnInit() {
    this.getInteractions();
  }

  getInteractions() {
    this.interactionService.getInteractions().subscribe(interactions => {
      // console.log(`getInteractions(): ${JSON.stringify(interactions)}`);
      this.interactions = interactions['interactions'].map(i => {
        Object.keys(i).map(x => {
          if (typeof i[x] === 'string') {
            i[x] = i[x].toUpperCase();
          }
        });
        return i;
      });
      this.visibleInteractions = this.interactions.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize);
      this.dataSource = new MatTableDataSource(this.visibleInteractions);
      this.dataSource.sort = this.sort;
      this.countInteractions = this.interactions.length;
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteInteraction(interaction: Interaction) {
    this.deleteInteractionEvent = true;

    // remove from server
    this.interactionService.deleteInteraction(interaction).subscribe(() => {
      // refresh with new interaction
      this.ngOnInit();
    });
  }

  editInteractionDialog(interaction: Interaction) {
    if (this.deleteInteractionEvent) {
      this.deleteInteractionEvent = false;
      return;
    }
    console.log(`EDIT interaction: ${JSON.stringify(interaction)}`);
    const dialogRef = this.dialog.open(InteractionComponent, {
      data: {interactionToEdit: interaction}
    });

    dialogRef.afterClosed().subscribe(newInteraction => {
      if (newInteraction) {
        this.interactions.map(c => {
          if (c.uniqueStamp === newInteraction.uniqueStamp) {
            c = newInteraction;
          }
          return c;
        });
      }
      this.ngOnInit();
    });

    this.dataSource = new MatTableDataSource(this.interactions);
  }

  createNewInteractionDialog() {
    const dialogRef = this.dialog.open(InteractionCreateComponent, {
      data: {interactions: this.interactions}
    });

    dialogRef.afterClosed().subscribe(newInteractions => {
      this.interactions = newInteractions;
      this.ngOnInit();
    });
  }

  pageEvent(event) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.ngOnInit();
  }
}
