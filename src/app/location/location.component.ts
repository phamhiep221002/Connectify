import { Component, OnInit } from '@angular/core';
import { LocationService } from '../_services/location.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {
  cityName!: string;
  latitude: number | undefined;
  longitude: number | undefined;
  foundCity: string | undefined;
  accessDenied: boolean = false;

  constructor(private locationService: LocationService, private toastr: ToastrService ) { }
  ngOnInit() {
    this.getLocation();
    
  }
  

  searchCity() {
    this.locationService.getCityInfo(this.cityName)
      .subscribe((data: any) => {
        if (data.results.length > 0) {
          this.latitude = data.results[0].geometry.lat;
          this.longitude = data.results[0].geometry.lng;
          this.foundCity = data.results[0].components.city || data.results[0].components.city_district;
        } else {
          this.foundCity = 'Not found';
        }
      }, error => {
        console.error(error);
        this.foundCity = 'Error occurred';
      });
  }

  getLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          console.log('aaa')
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.accessDenied = false; // Mở khóa nội dung trang web sau khi có quyền truy cập vị trí

          // Gọi service để lấy tên thành phố dựa trên vị trí hiện tại
          this.locationService.getCityInfoByCoords(this.latitude, this.longitude)
            .subscribe((data: any) => {
              if (data.results.length > 0) {
                this.foundCity = data.results[0].components.city || data.results[0].components.city_district;
              } else {
                this.foundCity = 'City not found';
              }
            }, error => {
              console.error(error);
              this.foundCity = 'Error occurred';
            });
        },
        (error: GeolocationPositionError) => {
          if (error.code === error.PERMISSION_DENIED) {
            this.accessDenied = true; // Khóa nội dung trang web khi bị chặn truy cập vị trí
            this.toastr.error('Please allow location access to use the app.', 'Location Access Denied');
          } else {
            console.error('Error getting location:', error.message);
            this.foundCity = 'Error getting location';
          }
        }
      );
    } else {
      console.error('Geolocation is not available in this browser.');
      this.foundCity = 'Geolocation is not available';
    }
  }
}