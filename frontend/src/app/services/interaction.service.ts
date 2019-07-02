import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Interaction } from '../models/Interaction';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class InteractionService {
  interactionsURL = 'http://localhost:3000/api/interactions';
  constructor(private http: HttpClient) { }

  getInteractions() {
    return this.http.get(this.interactionsURL);
  }

  deleteInteraction(interaction: Interaction): Observable<Interaction> {
    const url = `${this.interactionsURL}/${interaction.uniqueStamp}`;
    return this.http.delete<Interaction>(url, httpOptions);
  }

  addInteraction(interaction: Interaction): Observable<Interaction> {
    return this.http.post<Interaction>(this.interactionsURL, interaction, httpOptions);
  }

}
