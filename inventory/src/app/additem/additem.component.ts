import { Component, OnInit, OnDestroy } from '@angular/core';
import { DeviceService } from '../services/device.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/envirinment';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-additem',
  templateUrl: './additem.component.html',
  styleUrls: ['./additem.component.css']
})
export class AdditemComponent implements OnInit, OnDestroy {

  public apiUrl = environment.INVENTORY_BASEURL;

  devices: any[] = [];
  private deviceSubscription: Subscription | undefined;

  connection() {
    // Navigate to the dashboard component
    this.router.navigate(['/connection']);
  }

  navigateToDeskData() {
    this.router.navigate(['/read']);
  }

  constructor(private deviceService: DeviceService, private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    this.deviceSubscription = this.deviceService.getDevices().subscribe({
      next: devices => {
        this.devices = devices.map(device => device.Devices);
      },
      error: error => {
        console.error(error);
        // Handle error
      }
    });
  }

  ngOnDestroy(): void {
    if (this.deviceSubscription) {
      this.deviceSubscription.unsubscribe();
    }
  }

  onSubmit(deviceSelect: string, deviceName: string, serialNumber: string, brand: string, condition: string) {
    const formData = {
      deviceSelect: deviceSelect,
      deviceName: deviceName,
      serialNumber: serialNumber,
      brand: brand,
      condition: condition
    };
    const url = `${this.apiUrl}/api/device`;
    this.http.post(url, formData, { responseType: 'text' }).subscribe({
      next: (response) => {
        console.log(response);
        // Handle success (response contains the text message)
      },
      error: (error) => {
        console.error(error);
        // Handle error
      }
    });
  }
}
