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
  devicesWithList: { Devices: string, Monitor_Name: string }[] = [];
  uniqueDevices: string[] = [];
  selectedDevice: string = '';
  selectedList: string = '';
  selectedMonitor: any;
  selectedMouse: any;
  selectedBag: any;
  selectedWoodenPedestral: any;
  selectedCpu: any;
  selectedHeadPhone: any;
  selectedKeyBoard: any;
  selectedVoipIpPhone: any;
  selectedWaterBottle: any;
  selectedWebCamera: any;
  selectedItems: string[] = []; // Array to hold selected items

  deskValues: any[] = [];
  selectedDeskValue: any;

  goBack() {
    // Navigate to the dashboard component
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
      console.log('Item stored in array:', this.selectedList);
    }
  }

  sendToDatabase() {
    const url = `${this.apiUrl}/api/save`;
    const data = {
      employee: this.selectedValue ? this.selectedValue.Emp_Name : '',
      desk: this.selectedDeskValue ? this.selectedDeskValue.desk_name : '',
      monitor: this.selectedMonitor || null,
      mouse: this.selectedMouse || null,
      key_board: this.selectedKeyBoard || null,
      voip_ip_phone: this.selectedVoipIpPhone || null,
      bag: this.selectedBag || null,
      wooden_pedestral: this.selectedWoodenPedestral || null,
      cpu: this.selectedCpu || null,
      head_phone: this.selectedHeadPhone || null,
      water_bottle: this.selectedWaterBottle || null,
      web_camera: this.selectedWebCamera || null
    };
    this.http.post(url, data).subscribe({
      next: (response) => {
        console.log('Data saved successfully:', response);
      },
      error: (err) => {
        console.error('Error saving data:', err);
      }
    });
  }

  onDeviceSelect() {
    this.selectedList = '';
  }
  // sendToDatabase() {
  //   console.log('selectedList:', this.selectedList); // Add this line for debugging
  //   const url = `${this.apiUrl}/api/save`;
  //   const data = {
  //     employee: this.selectedValue ? this.selectedValue.Emp_Name : '',
  //     desk: this.selectedDeskValue ? this.selectedDeskValue.desk_name : '',
  //     monitor: this.selectedMonitor || null,
  //     mouse: this.selectedMouse || null,
  //     key_board: this.selectedKeyBoard || null,
  //     voip_ip_phone: this.selectedVoipIpPhone || null,
  //     bag: this.selectedBag || null,
  //     wooden_pedestral: this.selectedWoodenPedestral || null,
  //     cpu: this.selectedCpu || null,
  //     head_phone: this.selectedHeadPhone || null,
  //     water_bottle: this.selectedWaterBottle || null,
  //     web_camera: this.selectedWebCamera || null
  //     // selectedList: this.selectedList // Include selectedList in data object
  //   };
  //   this.http.post(url, data).subscribe({
  //     next: (response) => {
  //       console.log('Data saved successfully:', response);
  //     },
  //     error: (err) => {
  //       console.error('Error saving data:', err);
  //     }
  //   });
  // }

  // onDeviceSelect() {
  //   this.selectedList = '';
  // }
}