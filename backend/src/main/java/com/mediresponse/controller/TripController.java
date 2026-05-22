package com.mediresponse.controller;

import com.mediresponse.dto.TripRequest;
import com.mediresponse.model.ActiveTrip;
import com.mediresponse.service.TripService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    // POST /api/trips
    @PostMapping
    public ResponseEntity<ActiveTrip> createTrip(@Valid @RequestBody TripRequest request) {
        return ResponseEntity.ok(tripService.createTrip(request));
    }

    // GET /api/trips  (frontend calls this — was missing, only /active existed)
    @GetMapping
    public ResponseEntity<List<ActiveTrip>> getAllTrips() {
        return ResponseEntity.ok(tripService.findActiveTrips());
    }

    // GET /api/trips/active
    @GetMapping("/active")
    public ResponseEntity<List<ActiveTrip>> getActiveTrips() {
        return ResponseEntity.ok(tripService.findActiveTrips());
    }

    // PATCH /api/trips/{id}/arrived
    @PatchMapping("/{id}/arrived")
    public ResponseEntity<ActiveTrip> markArrived(@PathVariable Long id) {
        return ResponseEntity.ok(tripService.markArrived(id));
    }
}
