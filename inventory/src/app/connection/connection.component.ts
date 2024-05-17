// import { HttpClient } from '@angular/common/http';
// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { environment } from 'src/environment/envirinment';

// @Component({
//   selector: 'app-connection',
//   templateUrl: './connection.component.html',
//   styleUrls: ['./connection.component.css']
// })
// export class ConnectionComponent implements OnInit {

//   public apiUrl = environment.INVENTORY_BASEURL;

//   data: any[] = [];
//   selectedValue: any;
//   selectlist?: string;
//   devicesWithList: { Devices: string, Monitor_Name: string }[] = [];
//   uniqueDevices: string[] = [];
//   selectedDevice: string = '';
//   selectedList: string = '';

//   selectedMonitor: any;
//   selectedMouse: any;
//   selectedBag: any;
//   selectedWoodenPedestral: any;
//   selectedCpu: any;
//   selectedHeadPhone: any;
//   selectedKeyBoard: any;
//   selectedVoipIpPhone: any;
//   selectedWaterBottle: any;
//   selectedWebCamera: any;
//   selectedItems: string[] = []; // Array to hold selected items

//   deskValues: any[] = [];
//   selectedDeskValue: any;

//   goBack() {
//     // Navigate to the dashboard component
//     this.router.navigate(['/additem']);
//   }

//   constructor(private http: HttpClient, private router: Router) { }

//   ngOnInit(): void {
//     this.fetchData();
//     this.fetchDevicesWithMonitors();
//     this.fetchDeskValues();
//   }

//   fetchData() {
//     const url = `${this.apiUrl}/api/employee`;
//     this.http.get<any[]>(url).subscribe(data => {
//       this.data = data;
//     });
//   }

//   fetchDevicesWithMonitors() {
//     const url = `${this.apiUrl}/api/monitor_info`;
//     this.http.get<{ Devices: string, Monitor_Name: string }[]>(url).subscribe(devicesWithList => {
//       this.devicesWithList = devicesWithList;
//       this.uniqueDevices = [...new Set(devicesWithList.map(item => item.Devices))];
//     });
//   }

//   fetchDeskValues() {
//     const url = `${this.apiUrl}/api/desk`;
//     this.http.get<any[]>(url).subscribe(values => {
//       this.deskValues = values;
//     });
//   }

//   onEmployeeSelect() {
//     this.selectedDevice = '';
//     this.selectedList = '';
//     this.selectedItems = [];
//     this.selectedDeskValue = '';
//   }

//   storeInArray() {
//     if (this.selectedList && !this.selectedItems.includes(this.selectedList)) {
//       this.selectedItems.push(this.selectedList);
//       console.log('Item stored in array:', this.selectedList, this.selectedItems);
//     }
//   }
//   sendToDatabase() {
//     console.log("data is:", this.selectedItems);
//     console.log("selectedMonitor:", this.selectedMonitor);
//     console.log("selectedMouse:", this.selectedMouse);

//     const url = `${this.apiUrl}/api/save`;
//     const data = {
//       employee: this.selectedValue ? this.selectedValue.Emp_Name : null,
//       desk: this.selectedDeskValue ? this.selectedDeskValue.desk_name : null,
//       // device: this.selectedItems
//       // monitor: this.selectedList ? this.selectedList.monitor : null,
//       // monitor: this.selectlist = event?.target as HTMLSelectElement).value;
//       // monitor: this.selectedItems ? this.selectedMonitor : null,
//       // monitor: this.selectedMonitor !== null ? this.selectedMonitor : null,
//       // mouse: this.selectedMouse !== null ? this.selectedMouse : null,
//       // key_board: this.selectedKeyBoard !== null ? this.selectedKeyBoard : null,
//       // voip_ip_phone: this.selectedVoipIpPhone !== null ? this.selectedVoipIpPhone : null,
//       // bag: this.selectedBag !== null ? this.selectedBag : null,
//       // wooden_pedestral: this.selectedWoodenPedestral !== null ? this.selectedWoodenPedestral : null,
//       // cpu: this.selectedCpu !== null ? this.selectedCpu : null,
//       // head_phone: this.selectedHeadPhone !== null ? this.selectedHeadPhone : null,
//       // water_bottle: this.selectedWaterBottle !== null ? this.selectedWaterBottle : null,
//       // web_camera: this.selectedWebCamera !== null ? this.selectedWebCamera : null
//     };
//     console.log("Data to be sent:", data); // Log the data before sending

//     // Set headers
//     const headers = { 'Content-Type': 'application/json' };

//     this.http.post(url, JSON.stringify(data), { headers }).subscribe({
//       next: (response) => {
//         console.log('Data saved successfully:', response);
//       },
//       error: (err) => {
//         console.error('Error saving data:', err);
//       }
//     });
//   }

//   onDeviceSelect() {
//     this.selectedList = '';
//   }
// }




import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environment/envirinment';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.css']
})
export class ConnectionComponent implements OnInit {

  public apiUrl = environment.INVENTORY_BASEURL;

  data: any[] = [];
  selectedValue: any;
  // selectlist?: string;
  devicesWithList: { Devices: string, Monitor_Name: string }[] = [];
  uniqueDevices: string[] = [];
  selectedDevice: string = '';
  selectedList: string = '';

  selectedItems: string[] = [];

  deskValues: any[] = [];
  selectedDeskValue: any;

  goBack() {
    this.router.navigate(['/additem']);
  }

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.fetchData();
    this.fetchDevicesWithMonitors();
    this.fetchDeskValues();
  }

  fetchData() {
    const url = `${this.apiUrl}/api/employee`;
    this.http.get<any[]>(url).subscribe(data => {
      this.data = data;
    });
  }

  fetchDevicesWithMonitors() {
    const url = `${this.apiUrl}/api/monitor_info`;
    this.http.get<{ Devices: string, Monitor_Name: string }[]>(url).subscribe(devicesWithList => {
      this.devicesWithList = devicesWithList;
      this.uniqueDevices = [...new Set(devicesWithList.map(item => item.Devices))];
    });
  }

  fetchDeskValues() {
    const url = `${this.apiUrl}/api/desk`;
    this.http.get<any[]>(url).subscribe(values => {
      this.deskValues = values;
    });
  }

  onEmployeeSelect() {
    this.selectedDevice = '';
    this.selectedList = '';
    this.selectedItems = [];
    this.selectedDeskValue = '';
  }
  storeInArray() {
    if (this.selectedList && !this.selectedItems.includes(this.selectedList)) {
      this.selectedItems.push(this.selectedList);
      // this.selectedItems
      console.log('Item stored in array:', this.selectedItems);
    }
  }

  sendToDatabase() {
    console.log("data is:", this.selectedItems);

    const url = `${this.apiUrl}/api/save`;
    const data = {
      employee: this.selectedValue ? this.selectedValue.Emp_Name : null,
      desk: this.selectedDeskValue ? this.selectedDeskValue.desk_name : null,
      devices: this.selectedItems.join(',') // Join selected items into a comma-separated string
    };

    console.log("Data to be sent:", data);

    const headers = { 'Content-Type': 'application/json' };

    this.http.post(url, JSON.stringify(data), { headers }).subscribe({
      next: (response) => {
        console.log('Data saved successfully:', response);
      },
      error: (err) => {
        console.error('Error saving data:', err);
      }
    });
  }

  // storeInArray() {
  //   if (this.selectedList && !this.selectedItems.includes(this.selectedList)) {
  //     this.selectedItems.push(this.selectedList);
  //     console.log('Item stored in array:', this.selectedList, this.selectedItems);
  //   }
  // }

  // sendToDatabase() {
  //   console.log("data is:", this.selectedItems);

  //   const url = `${this.apiUrl}/api/save`;
  //   const data = {
  //     employee: this.selectedValue ? this.selectedValue.Emp_Name : null,
  //     desk: this.selectedDeskValue ? this.selectedDeskValue.desk_name : null,
  //     // devices: this.selectedItems ? this.devicesWithList : null
  //     devices: this.selectedList
  //   };

  //   console.log("Data to be sent:", data);

  //   const headers = { 'Content-Type': 'application/json' };

  //   this.http.post(url, JSON.stringify(data), { headers }).subscribe({
  //     next: (response) => {
  //       console.log('Data saved successfully:', response);
  //     },
  //     error: (err) => {
  //       console.error('Error saving data:', err);
  //     }
  //   });
  // }

  onDeviceSelect() {
    this.selectedList = '';
  }
}
