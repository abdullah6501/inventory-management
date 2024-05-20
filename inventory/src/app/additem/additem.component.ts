import { Component, OnInit, OnDestroy } from '@angular/core';
import { DeviceService } from '../services/device.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/envirinment';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';


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
    this.router.navigate(['/connection']);
  }

  navigateToDeskData() {
    this.router.navigate(['/read']);
  }

  goNew() {
    this.router.navigate(['/newitem']);
  }

  constructor(private deviceService: DeviceService, private toastr: ToastrService, private router: Router, private http: HttpClient, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.deviceSubscription = this.deviceService.getDevices().subscribe({
      next: devices => {
        this.devices = devices.map(device => device.Devices);
      },
      error: error => {
        console.error(error);
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
        // this.toastr.success('Device added successfully!');
        this.snackBar.open('Device added successfully!', 'Close', {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'right'
        });
      },
      error: (error) => {
        console.error(error);
        // this.toastr.error('Failed to add device.');
        this.snackBar.open('Failed to add device.', 'Close', {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'right'
        });
      }
    });
  }
}
