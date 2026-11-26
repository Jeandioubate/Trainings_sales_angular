import { Injectable } from '@angular/core';
import { Training } from '../model/training.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {

  private apiUrl = 'http://localhost:3000/trainings';

  constructor(private http: HttpClient) {}

  getTrainings(): Observable<Training[]> {
    return this.http.get<Training[]>(this.apiUrl);
  }

  addTraining(training: Training): Observable<Training> {
    return this.http.post<Training>(this.apiUrl, training);
  }

  updateTraining(training: Training): Observable<Training> {
    return this.http.put<Training>(
      `${this.apiUrl}/${training.id}`, training
    );
  }

  deleteTraining(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
