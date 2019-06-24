import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactListComponent } from '../components/contacts/contact-list/contact-list.component';
import { InteractionListComponent } from '../components/interactions/interaction-list/interaction-list.component';
import { AboutComponent } from '../components/about/about.component';

const routes: Routes = [
  { path: '', component: AboutComponent },
  { path: 'contacts', component: ContactListComponent },
  { path: 'interactions', component: InteractionListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
