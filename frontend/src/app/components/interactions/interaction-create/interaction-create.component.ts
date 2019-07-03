import { Component, OnInit, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Interaction } from '../../../models/Interaction';
import { FormControl, Validators } from '@angular/forms';
import { InteractionService } from '../../../services/interaction.service';

@Component({
  selector: 'app-interaction-create',
  templateUrl: './interaction-create.component.html',
  styleUrls: ['./interaction-create.component.css']
})
export class InteractionCreateComponent implements OnInit {
  interactions: Interaction[];
  newInteraction = new Interaction();
  newInteractionDate: string;
  newInteractionStartTime: string;
  newInteractionEndTime: string;
  newInteractionStart: Date;
  newInteractionEnd: Date;

  constructor(
    public dialogRef: MatDialogRef<InteractionCreateComponent>, 
    @Inject(MAT_DIALOG_DATA) public injectedInteractions, 
    private interactionService: InteractionService
  ) { }

  ngOnInit() {
    this.interactions = this.injectedInteractions.interactions;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addInteraction(interactionToAdd: Interaction) {
    this.newInteractionStart = new Date(this.newInteractionDate);
    this.newInteractionEnd = new Date(this.newInteractionDate);

    // set hours and minutes for start time
    const startTimeHour = this.newInteractionStartTime.split(':')[0];
    const startTimeMin = this.newInteractionStartTime.split(':')[1];
    this.newInteractionStart.setHours(parseInt(startTimeHour, 10));
    this.newInteractionStart.setMinutes(parseInt(startTimeMin, 10));

    // set hours and minutes for end time
    const endTimeHour = this.newInteractionEndTime.split(':')[0];
    const endTimeMin = this.newInteractionEndTime.split(':')[1];
    this.newInteractionEnd.setHours(parseInt(endTimeHour, 10));
    this.newInteractionEnd.setMinutes(parseInt(endTimeMin, 10));

    interactionToAdd.startTime = this.newInteractionStart;
    interactionToAdd.endTime = this.newInteractionEnd;

    console.log(`interactionToAdd: ${JSON.stringify(interactionToAdd)}`);

    if (this.validateInteraction(interactionToAdd)) {
      interactionToAdd.uniqueStamp = `${interactionToAdd.eventLocation}-${interactionToAdd.startTime}`.replace(/ /g, ''); 
      this.interactionService.addInteraction(interactionToAdd).subscribe(interaction => {
        this.interactions.push(interaction);
      });
      this.onNoClick();
    } else {
      console.log(`ERROR: invalid interaction: ${JSON.stringify(interactionToAdd)}`);
    }
  }

  validateInteraction(interaction: Interaction) {
    if (
      (interaction.eventType && interaction.eventType.length !== 0) &&
      (interaction.eventQuality >= 1 || interaction.eventQuality <= 5) &&
      (interaction.eventLocation && interaction.eventLocation.length !== 0) &&
      (interaction.members && interaction.members.length !== 0) &&
      (this.validateStartEndTimes(new Date(interaction.startTime), new Date(interaction.endTime)))
    ) {
      return true;
    } else {
      return false;
    }
  }

  validateStartEndTimes(startDate: Date, endDate: Date) {
    if (endDate.getTime() <= startDate.getTime()) {
      return false;
    } else {
      return true;
    }
  }
}
