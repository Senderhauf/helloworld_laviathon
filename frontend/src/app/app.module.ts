import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './extra_modules/app-routing.module';
import { HeaderComponent } from './components/header/header.component';
import { InteractionListComponent } from './components/interactions/interaction-list/interaction-list.component';
import { InteractionComponent } from './components/interactions/interaction/interaction.component';
import { InteractionCreateComponent } from './components/interactions/interaction-create/interaction-create.component';
import { ContactComponent } from './components/contacts/contact/contact.component';
import { ContactListComponent } from './components/contacts/contact-list/contact-list.component';
import { ContactCreateComponent } from './components/contacts/contact-create/contact-create.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatInputModule, MatCardModule, MatButtonModule } from '@angular/material';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { HttpClientModule } from '@angular/common/http';
import { AboutComponent } from './components/about/about.component';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material';
import { MatIconModule, MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    InteractionListComponent,
    InteractionComponent,
    InteractionCreateComponent,
    ContactComponent,
    ContactListComponent,
    ContactCreateComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatListModule,
    MatExpansionModule,
    HttpClientModule,
    MatSortModule,
    MatTableModule,
    MatIconModule,
    MatTooltipModule, 
    MatPaginatorModule, 
    MatDialogModule
  ],
  entryComponents: [ContactCreateComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
