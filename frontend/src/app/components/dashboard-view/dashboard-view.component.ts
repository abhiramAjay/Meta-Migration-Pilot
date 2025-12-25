import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ArtistService, Artist } from '../../services/artist.service';

@Component({
  selector: 'app-dashboard-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardViewComponent implements OnInit {

  // "Source of Truth" (All data from DB)
  allArtists: Artist[] = [];

  // "View Data" (What the user sees)
  filteredArtists: Artist[] = [];

  constructor(
    private artistService: ArtistService,
    private http: HttpClient
  ) { }

  private audioPlayer = new Audio();
  private isPlaying = false;

  // Cache to store URLs so we don't call the API twice for the same card
  private songCache: { [key: string]: string } = {};

  // Fallback Loops (for the fake robots)
  private genreTracks: any = {
    'Electronic': 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3',
    'Rock': 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d216f63462.mp3',
    'Hip Hop': 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    'Default': 'https://cdn.pixabay.com/download/audio/2021/11/23/audio_035a336ce6.mp3'
  };

  playPreview(artist: Artist) {
    console.log('Hover detected:', artist.name);
    if (this.isPlaying) this.stopPreview();
    this.isPlaying = true;

    // 1. Check Cache
    if (this.songCache[artist.name]) {
      this.playSound(this.songCache[artist.name]);
      return;
    }

    // 2. Fake Robot Fallback
    if (artist.name.startsWith('Subject_Zero') || artist.name.includes('Unknown')) {
      const genreUrl = this.getGenreTrack(artist.genre);
      this.songCache[artist.name] = genreUrl;
      this.playSound(genreUrl);
      return;
    }

    // 3. iTunes API
    const searchTerm = encodeURIComponent(artist.name);
    // Use 'callback' string for Angular's JSONP handling
    const apiUrl = `https://itunes.apple.com/search?term=${searchTerm}&entity=song&limit=1`;

    this.http.jsonp(apiUrl, 'callback').subscribe({
      next: (response: any) => {
        if (response.results && response.results.length > 0) {
          const previewUrl = response.results[0].previewUrl;
          console.log('iTunes found:', previewUrl);
          this.songCache[artist.name] = previewUrl;
          this.playSound(previewUrl);
        } else {
          console.warn('iTunes returned no results for', artist.name);
          const fallback = this.getGenreTrack(artist.genre);
          this.songCache[artist.name] = fallback;
          this.playSound(fallback);
        }
      },
      error: (err) => {
        console.error('iTunes API Error:', err);
        const fallback = this.getGenreTrack(artist.genre);
        this.playSound(fallback);
      }
    });
  }

  playSound(url: string) {
    if (!this.isPlaying) return;

    this.audioPlayer.src = url;
    this.audioPlayer.volume = 0.2;
    this.audioPlayer.load();
    this.audioPlayer.play()
      .then(() => console.log('Audio playing...'))
      .catch(err => console.error('Audio Autoplay Blocked. User must interact with document first.', err));
  }

  stopPreview() {
    // If the Modal is open, keep the music playing (Immersive Mode)
    if (this.selectedArtist) {
      console.log('Modal active: Keeping audio alive.');
      return;
    }

    console.log('Stopping preview');
    this.isPlaying = false;
    this.audioPlayer.pause();
    this.audioPlayer.currentTime = 0;
  }

  getGenreTrack(genre: string): string {
    if (!genre) return this.genreTracks['Default'];
    if (genre.includes('Electronic') || genre.includes('Cyber')) return this.genreTracks['Electronic'];
    if (genre.includes('Rock') || genre.includes('Metal')) return this.genreTracks['Rock'];
    if (genre.includes('Hip') || genre.includes('Pop')) return this.genreTracks['Hip Hop'];
    return this.genreTracks['Default'];
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.artistService.getArtists().subscribe({
      next: (data) => {
        this.allArtists = data;
        this.filteredArtists = data;
      },
      error: (err) => {
        this.filteredArtists = [{ name: 'CONNECTION_ERR', genre: 'OFFLINE', streams: '0', imageUrl: '' }];
      }
    });
  }

  // --- SEARCH & FILTER ---
  onSearch(event: any) {
    const text = event.target.value.toLowerCase();
    this.applyFilters(text, this.currentGenre);
  }

  currentGenre: string = '';

  onGenreFilter(event: any) {
    this.currentGenre = event.target.value.toLowerCase();
    const searchBox = document.getElementById('searchInput') as HTMLInputElement;
    const searchText = searchBox ? searchBox.value.toLowerCase() : '';
    this.applyFilters(searchText, this.currentGenre);
  }

  applyFilters(search: string, genre: string) {
    this.filteredArtists = this.allArtists.filter(artist => {
      const matchesName = artist.name.toLowerCase().includes(search);
      const matchesGenre = genre === '' || artist.genre.toLowerCase().includes(genre);
      return matchesName && matchesGenre;
    });
  }

  // --- DETAIL MODAL ---
  selectedArtist: Artist | null = null;

  openDetails(artist: Artist) {
    this.selectedArtist = artist;
  }

  // --- EDIT & CRUD LOGIC ---
  isEditing = false; // Track if we are in "Edit Mode"

  // Enable Edit Mode
  enableEdit() {
    this.isEditing = true;
  }

  // Save Changes (Update)
  saveEdit() {
    if (this.selectedArtist && this.selectedArtist.id) {
      this.artistService.updateArtist(this.selectedArtist.id, this.selectedArtist).subscribe({
        next: (updated) => {
          console.log('✅ RECORD UPDATED', updated);
          this.isEditing = false;
          // Refresh data to show changes
          this.loadData();
        },
        error: (err) => console.error('❌ UPDATE FAILED', err)
      });
    }
  }

  // Delete Record
  deleteRecord() {
    if (this.selectedArtist && this.selectedArtist.id) {
      if (confirm(`WARNING: ARE YOU SURE YOU WANT TO PURGE ${this.selectedArtist.name}? THIS CANNOT BE UNDONE.`)) {
        this.artistService.deleteArtist(this.selectedArtist.id).subscribe({
          next: () => {
            console.log('✅ RECORD PURGED');
            this.closeDetails();
            this.loadData(); // Refresh grid
          },
          error: (err) => console.error('❌ DELETE FAILED', err)
        });
      }
    }
  }

  closeDetails() {
    this.selectedArtist = null;
    this.isEditing = false;
    // Stop audio when closing the modal
    this.isPlaying = false;
    this.audioPlayer.pause();
    this.audioPlayer.currentTime = 0;
  }
}