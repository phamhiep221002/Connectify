import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocationDto } from '../_models/locationDto';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LocationService{
  private apiKey = '25839ee5018e4811b0f01ff59ae7e9eb';
  private apiUrl = 'https://api.opencagedata.com/geocode/v1/json';
  baseUrl = environment.apiUrl;
  locationDto: LocationDto = { latitude: 0, longitude: 0 };
  requestingLocation = false;
  

  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) { }

  getCityInfo(cityName: string) {
    const url = `${this.apiUrl}?q=${encodeURIComponent(cityName)}&key=${this.apiKey}`;
    return this.http.get(url);
  }

  getCityInfoByCoords(latitude: number, longitude: number) {
    const url = `${this.apiUrl}?q=${latitude}+${longitude}&key=${this.apiKey}`;
    return this.http.get(url);
  }
  getLocation(locationDto: LocationDto): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}users/update-location`, locationDto);
  }
  requestLocation(): void {
    this.requestingLocation = true;
    this.getCurrentLocation();
  }
  getCurrentLocation(): void {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          this.updateLocation(latitude, longitude);
        },
        (error) => {
          this.toastr.error('Failed to get location. Please manually share your location.', 'Error');
          this.router.navigateByUrl('/members');
        }
      );
    } else {
      this.toastr.error('Your browser does not support Geolocation API. Please manually share your location.', 'Error');
      this.router.navigateByUrl('/members');
    }
  }

  updateLocation(latitude: number, longitude: number): void {
    const locationDto = { latitude: latitude, longitude: longitude };
    this.getLocation(locationDto).subscribe(
      (_) => {
        console.log('Location updated successfully.');
        this.router.navigateByUrl('/members');
      },
      (error) => {
        this.router.navigateByUrl('/members');
      }
    );
  }
}