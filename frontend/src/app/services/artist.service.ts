import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define the shape of the data (matches your Java Entity)
export interface Artist {
    id?: number;
    name: string;
    genre: string;
    streams: string;
    imageUrl: string;
}

@Injectable({
    providedIn: 'root'
})
export class ArtistService {
    // The URL of your Spring Boot API (running on port 8080)
    private apiUrl = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:8080/api/artists'
        : 'https://meta-migration-pilot.onrender.com/api/artists'; // Real Render Backend URL

    constructor(private http: HttpClient) { }

    // Method to fetch all artists
    getArtists(): Observable<Artist[]> {
        return this.http.get<Artist[]>(this.apiUrl);
    }

    updateArtist(id: number, artist: Artist): Observable<Artist> {
        return this.http.put<Artist>(`${this.apiUrl}/${id}`, artist);
    }

    deleteArtist(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
