import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {INearestTour, ITourLocation, ITours} from "../../models/tours";

@Injectable({
  providedIn: 'root'
})
export class TicketRestService {

  constructor(private http: HttpClient) { }

  getTickets(): Observable<ITours[]> {
    return this.http.get<ITours[]>('https://62b9e756ff109cd1dc9dae16.mockapi.io/apiv/v1/tours/');
  }

  getRestError(): Observable<any> {
    return this.http.get<any>('https://62b9e756ff109cd1dc9dae16.mockapi.io/apiv/v1/tours/notFound');
  }

  getNearestTickets(): Observable<INearestTour[]> {
    return this.http.get<INearestTour[]>('https://62b9e756ff109cd1dc9dae16.mockapi.io/apiv/v1/nearestTours/');
  }

  getLocationList(): Observable<ITourLocation[]> {
    return this.http.get<ITourLocation[]>('https://62b9e756ff109cd1dc9dae16.mockapi.io/apiv/v1/location/');
  }

  getRandomNearestEvent(type:number): Observable<INearestTour> {
    switch (type) {
      case 0:
        return this.http.get<INearestTour>('/assets/mocks/nearestTour1.json');
      case 1:
        return this.http.get<INearestTour>('/assets/mocks/nearestTour2.json');
      case 2:
        return this.http.get<INearestTour>('/assets/mocks/nearestTour3.json');
      default:
        return this.http.get<INearestTour>('/assets/mocks/nearestTour2.json');
    }
  }

  sendTourData(data: any): Observable<any> {
    return this.http.post('/assets/mocks/nearestTour2.json', data);
  }

}
