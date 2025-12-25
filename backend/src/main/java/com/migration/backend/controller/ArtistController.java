package com.migration.backend.controller;

import com.migration.backend.model.Artist;
import com.migration.backend.repository.ArtistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

// ...

@RestController
@RequestMapping("/api/artists")
@CrossOrigin(origins = "*")
public class ArtistController {

    @Autowired
    private ArtistRepository artistRepository;

    @GetMapping
    public List<Artist> getAllArtists() {
        return artistRepository.findAll();
    }

    @PostMapping
    public Artist createArtist(@RequestBody Artist artist) {
        return artistRepository.save(artist);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Artist> updateArtist(@PathVariable Long id, @RequestBody Artist artistDetails) {
        Artist artist = artistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Artist not found with id: " + id));

        artist.setName(artistDetails.getName());
        artist.setGenre(artistDetails.getGenre());
        artist.setStreams(artistDetails.getStreams());
        artist.setImageUrl(artistDetails.getImageUrl());

        Artist updatedArtist = artistRepository.save(artist);
        return ResponseEntity.ok(updatedArtist);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArtist(@PathVariable Long id) {
        artistRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
