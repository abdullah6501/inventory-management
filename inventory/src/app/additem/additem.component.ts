// import { Component, OnInit } from '@angular/core';
// import { DeviceService } from '../services/device.service';
// import { HttpClient } from '@angular/common/http';
// import { environment } from 'src/environment/envirinment';

// @Component({
//   selector: 'app-additem',
//   templateUrl: './additem.component.html',
//   styleUrls: ['./additem.component.css']
// })
// export class AdditemComponent implements OnInit {

//   public apiUrl = environment.INVENTORY_BASEURL;

//   devices: any[] = [];

//   constructor(private deviceService: DeviceService, private http: HttpClient) { }

//   ngOnInit(): void {
//     this.deviceService.getDevices().subscribe(devices => {
//       this.devices = devices.map(device => device.Devices);
//     });
//   }

//   onSubmit(deviceName: string, serialNumber: string, brand: string, condition: string) {
//     const formData = {
//       deviceName: deviceName,
//       serialNumber: serialNumber,
//       brand: brand,
//       condition: condition
//     };
//     const url = `${this.apiUrl}/api/device`;
//     this.http.post<any>(url, formData)
//       .subscribe(
//         (response) => {
//           console.log(response);
//           // Handle success
//         },
//         (error) => {
//           console.error(error);
//           // Handle error
//         }
//       );
//   }
// }


import { Component, OnInit, OnDestroy } from '@angular/core';
import { DeviceService } from '../services/device.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/envirinment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-additem',
  templateUrl: './additem.component.html',
  styleUrls: ['./additem.component.css']
})
export class AdditemComponent implements OnInit, OnDestroy {

  public apiUrl = environment.INVENTORY_BASEURL;

  devices: any[] = [];
  private deviceSubscription: Subscription | undefined;

  constructor(private deviceService: DeviceService, private http: HttpClient) { }

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

  onSubmit(deviceName: string, serialNumber: string, brand: string, condition: string) {
    const formData = {
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
  
  // onSubmit(deviceName: string, serialNumber: string, brand: string, condition: string) {
  //   const formData = {
  //     deviceName: deviceName,
  //     serialNumber: serialNumber,
  //     brand: brand,
  //     condition: condition
  //   };
  //   const url = `${this.apiUrl}/api/device`;
  //   this.http.post<any>(url, formData).subscribe({
  //     next: (response) => {
  //       console.log(response);
  //       // Handle success
  //     },
  //     error: (error) => {
  //       console.error(error);
  //       // Handle error
  //     }
  //   });
  // }
}
