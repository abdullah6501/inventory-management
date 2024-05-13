// import { HttpClient } from '@angular/common/http';
// import { Component, OnInit } from '@angular/core';
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
//   devicesWithList: { Devices: string, Monitor_Name: string }[] = [];
//   uniqueDevices: string[] = [];
//   selectedDevice: string ='';
//   selectedList: string ='';
//   selectedItems: string[] = [];


//   selectedMouse: string = '';
//   monitorsForSelectedDevice: string[] = [];

//   deskValues: any[] = [];
//   selectedDeskValue: any;

//   constructor(private http: HttpClient) { }

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

//   // onDeviceSelect() {
//   //   // Reset selections when device changes
//   //   this.selectedList = '';
//   //   this.selectedMouse = '';
//   // }

//   onSave() {
//      // Add selected item to the array
//     //  if (this.selectedList) {
//     //   this.selectedItems.push(this.selectedList);
//     // }
//     this.selectedItems.push(this.selectedList);
//     // Send data to backend to save to the database
//     const url = `${this.apiUrl}/api/save`;
//     const data = {
//       desk: this.selectedDeskValue.desk_name,
//       monitor: this.selectedList,
//       mouse: this.selectedMouse,
//       // Add other fields as needed
//     };
//     this.http.post(url, data).subscribe(response => {
//       // Handle response if needed
//     });
//   }

// }




import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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
  devicesWithList: { Devices: string, Monitor_Name: string }[] = [];
  uniqueDevices: string[] = [];
  selectedDevice: string ='';
  selectedList: string ='';
  selectedItems: string[] = []; // Array to hold selected items

  selectedMouse: string = '';
  monitorsForSelectedDevice: string[] = [];

  deskValues: any[] = [];
  selectedDeskValue: any;

  constructor(private http: HttpClient) { }

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

  onDeviceSelect() {
    // Reset selections when device changes
    this.selectedList = '';
    this.selectedMouse = '';
  }

  onSave() {
    // Add selected item to the array of selected items
    this.selectedItems.push(this.selectedList);
    // Send data to backend to save to the database
    const url = `${this.apiUrl}/api/save`;
    const data = {
      desk: this.selectedDeskValue.desk_name,
      monitor: this.selectedList,
      mouse: this.selectedMouse,
      // Add other fields as needed
    };
    this.http.post(url, data).subscribe(response => {
      // Handle response if needed
    });
  }
}
