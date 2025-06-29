
package com.tchatsouvenir.controller;

import com.tchatsouvenir.model.Printer;
import com.tchatsouvenir.model.PrinterOrder;
import com.tchatsouvenir.service.PrinterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/printers")
@CrossOrigin(origins = "*")
public class PrinterController {
    
    @Autowired
    private PrinterService printerService;
    
    @GetMapping
    public ResponseEntity<List<Printer>> getAllPrinters(@RequestParam(defaultValue = "true") boolean activeOnly) {
        List<Printer> printers = activeOnly ? printerService.getAllActivePrinters() : printerService.getAllPrinters();
        return ResponseEntity.ok(printers);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Printer> getPrinterById(@PathVariable Long id) {
        Optional<Printer> printer = printerService.getPrinterById(id);
        return printer.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Printer> createPrinter(@RequestBody Printer printer) {
        Printer savedPrinter = printerService.savePrinter(printer);
        return ResponseEntity.ok(savedPrinter);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Printer> updatePrinter(@PathVariable Long id, @RequestBody Printer printer) {
        printer.setId(id);
        Printer updatedPrinter = printerService.savePrinter(printer);
        return ResponseEntity.ok(updatedPrinter);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePrinter(@PathVariable Long id) {
        printerService.deletePrinter(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/{id}/orders")
    public ResponseEntity<List<PrinterOrder>> getPrinterOrders(
            @PathVariable Long id,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        
        List<PrinterOrder> orders;
        if (startDate != null && endDate != null) {
            orders = printerService.getPrinterOrdersByPeriod(id, startDate, endDate);
        } else {
            orders = printerService.getPrinterOrders(id);
        }
        
        return ResponseEntity.ok(orders);
    }
    
    @GetMapping("/{id}/total-cost")
    public ResponseEntity<Map<String, Object>> getPrinterTotalCost(
            @PathVariable Long id,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        
        BigDecimal totalCost = printerService.calculatePrinterTotalCost(id, startDate, endDate);
        
        Map<String, Object> result = Map.of(
            "printerId", id,
            "totalCost", totalCost,
            "period", Map.of(
                "startDate", startDate,
                "endDate", endDate
            )
        );
        
        return ResponseEntity.ok(result);
    }
}
