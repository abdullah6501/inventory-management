import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { environment } from 'src/environment/envirinment';

@Component({
  selector: 'app-newdesk',
  templateUrl: './newdesk.component.html',
  styleUrls: ['./newdesk.component.css']
})
export class NewdeskComponent {
  newDesk: string = '';

  public apiUrl = environment.INVENTORY_BASEURL;

  constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar) { }

  submitDevice() {
    const url = `${this.apiUrl}/add/desk`; // Corrected endpoint URL
    this.http.post(url, { desk: this.newDesk }).subscribe({
      next: (response: any) => {
        console.log('Desk submitted successfully', response);
        this.snackBar.open('Desk added successfully!', 'Close', {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'right'
        });
        this.newDesk = ''; // Reset the input field
      },
      error: (error: any) => {
        console.error('Error submitting desk', error);
        this.snackBar.open('Failed to add desk.', 'Close', {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'right'
        });
      }
    });
  }

  goDesk() {
    this.router.navigate(['/newitem']);
  }
}