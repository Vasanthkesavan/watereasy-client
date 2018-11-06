import {ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, ViewChild} from '@angular/core';

import {SensorDataModel} from '../sensor.model';
import { AppService } from '../app.service';

@Component({
  selector: 'app-sensor-chart',
  templateUrl: './sensor-chart.component.html',
  styleUrls: ['./sensor-chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SensorChartComponent implements OnChanges {
  humidity = [];
  light = [];
  soil = [];
  temperature = [];
  latestHumidity = "0";
  latestLight = "0";
  latestSoil = "0";
  latestTempertature = "0";

  public lineChartData:Array<any> = [
    {data: [], label: 'light'},
    {data: [], label: 'soil'},
    {data: [], label: 'temperature'},
    {data: [], label: 'humidity'}
  ];

  public lineChartLabels:Array<any> = [
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
    "X"
  ];

  public lineChartOptions:any = {
    responsive: true
  };

  public lineChartColors:Array<any> = [
    { // yellow
      backgroundColor: 'rgba(255,255,0,0.3)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // green
      backgroundColor: 'rgba(0,255,0,0.3)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // red
      backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // blue
      backgroundColor: 'rgba(0,0,255,0.3)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    }
  ];

  public lineChartLegend:boolean = true;

  public lineChartType:string = 'line';
  
  public randomize():void {
    this.appService.getInitialSensorData()
      .subscribe(data => {
        const tenItems = data.slice(0, 10);
        this.light = [];
        this.humidity = [];
        this.temperature = [];
        this.soil = [];

        
        let _lineChartData: Array<any> = new Array(this.lineChartData.length);
        
        tenItems.forEach((data) => {
          for(let key in data) {
            if(key === "humidity") {
              this.humidity.push(data[key])
            }
            if(key === "light") {
              this.light.push(data[key])
            }
            if(key === "soil") {
              this.soil.push(data[key])
            }
            if(key === "temperature") {
              this.temperature.push(data[key])
            }
          }
        });
        this.latestHumidity = _lineChartData[0].data[_lineChartData[0].data.length - 1];
        this.latestLight = _lineChartData[1].data[_lineChartData[0].data.length - 1];
        this.latestSoil = _lineChartData[2].data[_lineChartData[0].data.length - 1];
        this.latestTempertature = _lineChartData[3].data[_lineChartData[0].data.length - 1];


        _lineChartData = [
          {data: this.light, label: 'light'},
          {data: this.soil, label: 'soil'},
          {data: this.temperature, label: 'temperature'},
          {data: this.humidity, label: 'humidity'}
        ];
        this.lineChartData = _lineChartData;
      })
  }

  socketData(): void {
    //document.getElementById("socketButton").click()
    this.lineChartData = this.lineChartData;
  }

  constructor(private appService: AppService) {
    const that = this;

    this.appService.getUpdates().subscribe(data => {
      //console.log(data["light"]);
      let _lineChartData: Array<any> = new Array(this.lineChartData.length);
      if(this.light.length > 1) {
        this.light.pop();
        this.soil.pop();
        this.temperature.pop();
        this.humidity.pop();
  
        // this.light.splice(0, 10);
        // console.log(this.light)
  
        this.light.push(data["light"]);
        this.soil.push(data["soil"]);
        this.temperature.push(data["temperature"]);
        this.humidity.push(data["humidity"]);
        //console.log(this.soil)
        _lineChartData = [
            {data: this.light, label: 'light'},
            {data: this.soil, label: 'soil'},
            {data: this.temperature, label: 'temperature'},
            {data: this.humidity, label: 'humidity'}
          ];
        //console.log(_lineChartData[1].data[_lineChartData[1].data.length - 1], ' ', data["soil"])
        this.lineChartData = _lineChartData;
        this.latestHumidity = data["humidity"];
        this.latestLight = data["light"];
        this.latestSoil = data["soil"];
        this.latestTempertature = data["temperature"];

        document.getElementById("socketButton").click()
      }
    })

    setTimeout(function() {
      document.getElementById("dataButton").click()
    }, 2000)

    setTimeout(function() {
      document.getElementById("dataButton").click()
    }, 4000)
  }

  ngOnChanges() {
    
  }
}