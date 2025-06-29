
package com.tchatsouvenir.service;

import com.tchatsouvenir.model.Printer;
import com.tchatsouvenir.model.PrinterOrder;
import com.tchatsouvenir.repository.PrinterRepository;
import com.tchatsouvenir.repository.PrinterOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.math.BigDecimal;

@Service
@Transactional
public class PrinterService {
    
    @Autowired
    private PrinterRepository printerRepository;
    
    @Autowired
    private PrinterOrderRepository printerOrderRepository;
    
    public List<Printer> getAllActivePrinters() {
        return printerRepository.findByIsActiveTrue();
    }
    
    public List<Printer> getAllPrinters() {
        return printerRepository.findAll();
    }
    
    public Optional<Printer> getPrinterById(Long id) {
        return printerRepository.findById(id);
    }
    
    public Printer savePrinter(Printer printer) {
        return printerRepository.save(printer);
    }
    
    public void deletePrinter(Long id) {
        Optional<Printer> printerOpt = printerRepository.findById(id);
        if (printerOpt.isPresent()) {
            Printer printer = printerOpt.get();
            printer.setIsActive(false);
            printerRepository.save(printer);
        }
    }
    
    public List<PrinterOrder> getPrinterOrders(Long printerId) {
        Optional<Printer> printerOpt = printerRepository.findById(printerId);
        if (printerOpt.isPresent()) {
            return printerOrderRepository.findByPrinter(printerOpt.get());
        }
        return List.of();
    }
    
    public List<PrinterOrder> getPrinterOrdersByPeriod(Long printerId, LocalDateTime startDate, LocalDateTime endDate) {
        Optional<Printer> printerOpt = printerRepository.findById(printerId);
        if (printerOpt.isPresent()) {
            return printerOrderRepository.findByPrinterAndCreatedAtBetween(printerOpt.get(), startDate, endDate);
        }
        return List.of();
    }
    
    public BigDecimal calculatePrinterTotalCost(Long printerId, LocalDateTime startDate, LocalDateTime endDate) {
        Optional<Printer> printerOpt = printerRepository.findById(printerId);
        if (printerOpt.isPresent()) {
            BigDecimal total = printerOrderRepository.calculateTotalCostByPrinterAndPeriod(printerOpt.get(), startDate, endDate);
            return total != null ? total : BigDecimal.ZERO;
        }
        return BigDecimal.ZERO;
    }
}
