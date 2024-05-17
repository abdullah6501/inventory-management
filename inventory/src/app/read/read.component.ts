import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environment/envirinment';

interface Employee {
  Emp_name: string;
  desk: string;
  monitor: string;
  mouse: string;
  CPU: string;
  key_board: string;
  VOIP_IP_Phone: string;
  Wooden_Pedestral: string;
  Water_Bottle: string;
  Bag: string;
  web_camera: string;
  Head_phone: string;
}

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.css']
})
export class ReadComponent implements OnInit {

  public apiUrl = environment.INVENTORY_BASEURL;

  // deskData: any[] = [];
  deskData: Employee[] = [];
  selectedEmployee: Employee | null = null;
  // desksData: any[] = [];
  // selectedEmployee: any = null;
  editingIndex: number | null = null;

  goBack() {
    // Navigate to the dashboard component
    this.router.navigate(['/additem']);
  }
  goDesk() {
    // Navigate to the dashboard component
    this.router.navigate(['/readdesk']);
  }

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.fetchDeskData();
  }

  fetchDeskData() {
    const url = `${this.apiUrl}/data`;
    this.http.get<Employee[]>(url).subscribe(data => {
      this.deskData = data;
    });
  }

  // editEmployee(employee: Employee | number) {
  //   if (typeof employee === 'number') {
  //     // Find the employee object by index or ID
  //     this.selectedEmployee = this.deskData[employee];
  //   } else {
  //     // If an Employee object is passed directly
  //     this.selectedEmployee = { ...employee }; // Create a copy to avoid changing the original data directly
  //   }
  //   document.body.classList.add('blur-background'); // Apply blur effect to background
  // }

  editEmployee(index: number) {
    this.selectedEmployee = { ...this.deskData[index] };
    document.body.classList.add('blur-background');
  }


  // editEmployee(employee: Employee) {
  //   this.selectedEmployee = { ...employee }; // Create a copy to avoid changing the original data directly
  //   document.body.classList.add('blur-background'); // Apply blur effect to background
  // }
  // editEmployee(employee: any) {
  //   this.selectedEmployee = { ...employee }; // Create a copy to avoid changing the original data directly
  // }

  closeModal() {
    this.selectedEmployee = null;
    document.body.classList.remove('blur-background'); // Remove blur effect from background
  }

  // saveChanges() {
  //   if (this.selectedEmployee) {
  //     const url = `${this.apiUrl}/update`;
  //     this.http.put(url, this.selectedEmployee).subscribe(response => {
  //       // Handle response if needed
  //       console.log("Employee details updated successfully!");
  //       this.closeModal(); // Close the modal after saving changes
  //     });
  //   }
  // }

  saveChanges() {
    if (this.selectedEmployee) {
      const url = `${this.apiUrl}/update`; // Ensure this is the correct endpoint
      this.http.put(url, this.selectedEmployee).subscribe(response => {
        console.log("Employee details updated successfully!", response);
        this.closeModal(); // Close the modal after saving changes
      }, error => {
        console.error("Error updating employee details:", error);
      });
    }
  }


  // closeModal() {
  //   this.selectedEmployee = null;
  // }

  // saveChanges() {
  //   if (this.selectedEmployee) {
  //     const url = `${this.apiUrl}/update`;
  //     this.http.put(url, this.selectedEmployee).subscribe(response => {
  //       // Handle response if needed
  //       console.log("Employee details updated successfully!");
  //       this.closeModal(); // Close the modal after saving changes
  //     });
  //   }
  // }

  // saveChanges() {
  //   if (this.editingIndex !== null) {
  //     // Send HTTP request to update the employee details in backend
  //     const updatedEmployee = this.deskData[this.editingIndex];
  //     const url = `${this.apiUrl}/update/${updatedEmployee.Emp_name}`; // Assuming there's an 'id' field
  //     this.http.put(url, updatedEmployee).subscribe(() => {
  //       // Update successful, reset editingIndex
  //       this.editingIndex = null;
  //     });
  //   }
  // }
  // saveChanges() {
  //   // Send HTTP request to update the employee details in backend
  //   const updatedEmployee = this.deskData[this.editingIndex];
  //   const url = `${this.apiUrl}/update/${updatedEmployee.id}`; // Assuming there's an 'id' field
  //   this.http.put(url, updatedEmployee).subscribe(() => {
  //     // Update successful, reset editingIndex
  //     this.editingIndex = null;
  //   });
  // }
}
