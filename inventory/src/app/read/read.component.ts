import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environment/envirinment';

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.css']
})
export class ReadComponent implements OnInit {

  public apiUrl = environment.INVENTORY_BASEURL;

  deskData: any[] = [];

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
    this.http.get<any[]>(url).subscribe(data => {
      this.deskData = data;
    });
  }
}
