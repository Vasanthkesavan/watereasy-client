import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {SensorDataModel} from './sensor.model';
import * as socketio from 'socket.io-client';
import { Subject, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private baseUrl =  'http://localhost:3000';
  constructor(private httpClient: HttpClient) { }

  getInitialSensorData() {
    return this.httpClient.get<SensorDataModel[]>(`${this.baseUrl}/api/sensordata`);
  }
  
  getUpdates() {
    let socket = socketio(this.baseUrl);
    let sensorSub = new Subject();
    let marketSubObservable = from(sensorSub);

    socket.on('sensor data', (sensorStatus) => {
      sensorSub.next(sensorStatus);
    });

    return marketSubObservable;
  }
}