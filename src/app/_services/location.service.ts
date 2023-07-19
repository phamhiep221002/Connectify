import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private apiKey = '25839ee5018e4811b0f01ff59ae7e9eb';
  private apiUrl = 'https://api.opencagedata.com/geocode/v1/json';

  constructor(private http: HttpClient) { }

  getCityInfo(cityName: string) {
    const url = `${this.apiUrl}?q=${encodeURIComponent(cityName)}&key=${this.apiKey}`;
    return this.http.get(url);
  }

  getCityInfoByCoords(latitude: number, longitude: number) {
    const url = `${this.apiUrl}?q=${latitude}+${longitude}&key=${this.apiKey}`;
    return this.http.get(url);
  }
  
}