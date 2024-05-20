import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { environment } from 'src/environment/envirinment';

interface Employee {
  Emp_Name: string;
}

interface Device {
  Monitor_Name: string;
  Devices: string;
}

interface Desk {
  desk_name: string;
}

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.css']
})
export class ConnectionComponent implements OnInit {

  public apiUrl = environment.INVENTORY_BASEURL;

  data: Employee[] = [];
  uniqueDevices: string[] = [];
  devicesWithList: Device[] = [];
  deskValues: Desk[] = [];

  selectedValue: Employee | null = null;
  selectedDevice: string = '';
  selectedList: string = '';
  selectedDeskValue: Desk | null = null;
  selectedItems: string[] = [];

  goBack() {
    this.router.navigate(['/additem']);
  }

  constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar) { }

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
    this.selectedDeskValue = null;
  }

  onDeviceSelect() {
    this.selectedList = '';
  }

  storeInArray() {
    if (this.selectedList) {
      this.selectedItems.push(this.selectedList);
      this.selectedList = '';
    }
  }

  sendToDatabase() {
    const payload = {
      employee: this.selectedValue?.Emp_Name,
      desk: this.selectedDeskValue?.desk_name,
      devices: {
        bag: this.selectedItems[0] || null,
        wooden_pedestral: this.selectedItems[1] || null,
        cpu: this.selectedItems[2] || null,
        head_phone: this.selectedItems[3] || null,
        key_board: this.selectedItems[4] || null,
        monitor: this.selectedItems[5] || null,
        mouse: this.selectedItems[6] || null,
        voip_ip_phone: this.selectedItems[7] || null,
        water_bottle: this.selectedItems[8] || null,
        web_camera: this.selectedItems[9] || null
      }
    };

    const url = `${this.apiUrl}/api/save`;
    this.http.post(url, payload).subscribe({
      next: (response) => {
        console.log('Data saved successfully:', response);
        this.snackBar.open('Data saved successfully!', 'Close', {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'right'
        });
      }, error: (err) => {
        console.error('Error saving data:', err);
        this.snackBar.open('Failed to add Data.', 'Close', {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'right'
        });
      }
    });
  }
}