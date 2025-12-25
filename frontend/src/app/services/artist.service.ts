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
    private apiUrl = 'http://localhost:8080/api/artists';

    constructor(private http: HttpClient) { }

    // Method to fetch all artists
    getArtists(): Observable<Artist[]> {
        return this.http.get<Artist[]>(this.apiUrl);
    }
}
