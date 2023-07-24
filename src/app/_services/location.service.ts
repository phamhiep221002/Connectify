import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationService implements OnInit {
  private apiKey = '25839ee5018e4811b0f01ff59ae7e9eb';
  private apiUrl = 'https://api.opencagedata.com/geocode/v1/json';
  accessDenied: boolean = false;
  baseUrl = environment.apiUrl;
  

  constructor(private http: HttpClient, private toastr: ToastrService) { }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  getCityInfo(cityName: string) {
    const url = `${this.apiUrl}?q=${encodeURIComponent(cityName)}&key=${this.apiKey}`;
    return this.http.get(url);
  }

  getCityInfoByCoords(latitude: number, longitude: number) {
    const url = `${this.apiUrl}?q=${latitude}+${longitude}&key=${this.apiKey}`;
    return this.http.get(url);
  }
  sendUserLocation(latitude: number, longitude: number): Observable<any> {
    debugger
    const userLocation = { latitude, longitude };
    return this.http.post<any>(`${this.baseUrl}account/update-location`, userLocation);
  }
  getLocation(): Promise<any> {
    return new Promise((resolve, reject) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position: GeolocationPosition) => {
            this.accessDenied = false;
            resolve(position);
          },
          (error: GeolocationPositionError) => {
            this.accessDenied = true;
            this.toastr.warning('Please allow location access to use the app.', 'Location Access Denied');
            reject(error);
          }
        );
      } else {
        this.accessDenied = true;
        reject('Geolocation is not available in this browser.');
      }
    });
  }
}