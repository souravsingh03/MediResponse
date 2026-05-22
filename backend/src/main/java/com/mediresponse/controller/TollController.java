package com.mediresponse.controller;

import com.mediresponse.model.TollAlert;
import com.mediresponse.service.TollAlertService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tolls")
public class TollController {

    private final TollAlertService tollAlertService;

    public TollController(TollAlertService tollAlertService) {
        this.tollAlertService = tollAlertService;
    }

    @GetMapping("/alerts")
    public ResponseEntity<List<TollAlert>> getAlerts() {
        return ResponseEntity.ok(tollAlertService.findAll());
    }
}
