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
    // If we are running on localhost, use 8080. 
    // If not, use the Production URL (you will update this with your Render URL later).
    private apiUrl = window.location.hostname === 'localhost'
        ? 'http://localhost:8080/api/artists'
        : 'https://FILL_IN_YOUR_RENDER_URL_HERE.onrender.com/api/artists';

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
