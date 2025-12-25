import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtistService, Artist } from '../../services/artist.service'; // Import Service

@Component({
  selector: 'app-dashboard-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardViewComponent implements OnInit {

  // The array starts empty (waiting for data)
  artists: Artist[] = [];

  // Inject the Service
  constructor(private artistService: ArtistService) { }

  // "ngOnInit" runs automatically when the component loads
  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.artistService.getArtists().subscribe({
      next: (data) => {
        this.artists = data;
        console.log('✅ SYSTEM ONLINE: Data received from Mainframe', data);
      },
      error: (err) => {
        console.error('❌ CRITICAL ERROR: Connection to Mainframe failed', err);
        // Optional: Add a fake artist to show the UI even if backend is down
        this.artists = [{ name: 'CONNECTION_ERR', genre: 'OFFLINE', streams: '0', imageUrl: '' }];
      }
    });
  }
}