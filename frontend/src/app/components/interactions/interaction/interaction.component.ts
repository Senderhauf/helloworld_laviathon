import { Component, OnInit, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Interaction } from '../../../models/Interaction';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-interaction',
  templateUrl: './interaction.component.html',
  styleUrls: ['./interaction.component.css']
})
export class InteractionComponent implements OnInit {
  interaction: Interaction;
  editedInteraction: Interaction;
  constructor(
    public dialogRef: MatDialogRef<InteractionComponent>,
    @Inject(MAT_DIALOG_DATA) public interactionToEdit,
    private interactionService: InteractionService
  ) { }

  ngOnInit() {
    this.interaction = this.interactionToEdit.interactionToEdit;
    this.editedInteraction = {
      uniqueStamp: this.interaction.uniqueStamp,
      name: this.interaction.name,
      eventType: this.interaction.eventType,
      eventQuality: this.interaction.eventQuality,
      eventLocation: this.interaction.eventLocation,
      startTime: this.interaction.startTime,
      endTime: this.interaction.endTime,
      notes: this.interaction.notes,
      members: this.interaction.members
    };
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  editInteraction(interactionToEdit: Interaction) {
    this.interactionService.addInteraction(interactionToEdit).subscribe(interaction => {
      this.interaction = interaction;
    });
    this.onNoClick();
  }
}
