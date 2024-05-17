import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environment/envirinment';

@Component({
  selector: 'app-newitem',
  templateUrl: './newitem.component.html',
  styleUrls: ['./newitem.component.css']
})
export class NewitemComponent {
  newDevice: string = '';

  public apiUrl = environment.INVENTORY_BASEURL;

  constructor(private http: HttpClient, private router: Router) { }

  submitDevice() {
    if (this.newDevice.trim().length === 0) {
      console.error('Device name is required');
      return;
    }

    const url = `${this.apiUrl}/add/list`; // Corrected endpoint URL
    this.http.post(url, { device: this.newDevice }).subscribe({
      next: (response: any) => {
        console.log('Device submitted successfully', response);
        this.newDevice = ''; // Reset the input field
      },
      error: (error: any) => {
        console.error('Error submitting device', error);
      }
    });
  }

  goBack() {
    this.router.navigate(['/additem']);
  }
}




// import { HttpClient } from '@angular/common/http';
// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { environment } from 'src/environment/envirinment';

// @Component({
//   selector: 'app-newitem',
//   templateUrl: './newitem.component.html',
//   styleUrls: ['./newitem.component.css']
// })

// export class NewitemComponent {
//   newDevice: string = '';

//   public apiUrl = environment.INVENTORY_BASEURL;

//   constructor(private http: HttpClient, private router: Router) { }

//   submitDevice() {
//     if (this.newDevice) {
//       const url = `${this.apiUrl}/new/item`;
//       this.http.post(url, { device: this.newDevice }).subscribe({
//         next: (response) => {
//           console.log('Device submitted successfully', response);
//           this.newDevice = ''; // Reset the input field
//         },
//         error: (error) => {
//           console.error('Error submitting device', error);
//         }
//       });
//     } else {
//       console.error('Device name is required');
//     }
//   }

//   goBack() {
//     this.router.navigate(['/additem']);
//   }
// }




// // export class NewitemComponent {

// //   public apiUrl = environment.INVENTORY_BASEURL;

// //   goBack() {
// //     this.router.navigate(['/additem']);
// //   }

// //   constructor(private http: HttpClient, private router: Router) { }

// //   inputValue: string | undefined;

// //   // constructor(private http: HttpClient) {}

// //   saveValue() {
// //     const value = { inputValue: this.inputValue };
// //     this.http.post<any>('http://localhost:3000/saveValue', value).subscribe({
// //       next: () => {
// //         alert('Value saved successfully!');
// //         this.inputValue = ''; // Clear input after saving
// //       },
// //       error: (error) => {
// //         console.error('There was an error!', error);
// //       }
// //     });
// //   }

// // }
