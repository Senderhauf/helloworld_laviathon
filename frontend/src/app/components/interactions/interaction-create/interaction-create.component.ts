import { Component, OnInit, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Interaction } from '../../../models/Interaction';
import { FormControl, Validators } from '@angular/forms';
import { InteractionService } from '../../../services/interaction.service';
import * as EmailValidator from 'email-validator';

@Component({
  selector: 'app-interaction-create',
  templateUrl: './interaction-create.component.html',
  styleUrls: ['./interaction-create.component.css']
})
export class InteractionCreateComponent implements OnInit {
  interactions: Interaction[];
  newInteration = new Interaction();

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
    if (this.validateInteraction(interactionToAdd)) {
      this.interactionService.addInteraction(interactionToAdd).subscribe(interaction => {
        this.interactions.push(interaction);
      });
      this.onNoClick();
    } else {
      console.log(`ERROR: invalid contacts: ${JSON.stringify(interactionToAdd)}`);
    }
  }

  validateInteraction(interaction: Interaction) {
    return true;
  }
}
