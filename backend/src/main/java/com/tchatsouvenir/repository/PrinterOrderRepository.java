
package com.tchatsouvenir.repository;

import com.tchatsouvenir.model.PrinterOrder;
import com.tchatsouvenir.model.Printer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PrinterOrderRepository extends JpaRepository<PrinterOrder, Long> {
    
    List<PrinterOrder> findByPrinter(Printer printer);
    
    List<PrinterOrder> findByPrinterAndStatus(Printer printer, PrinterOrder.PrinterOrderStatus status);
    
    @Query("SELECT po FROM PrinterOrder po WHERE po.printer = :printer AND po.createdAt BETWEEN :startDate AND :endDate")
    List<PrinterOrder> findByPrinterAndCreatedAtBetween(@Param("printer") Printer printer, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT SUM(po.cost) FROM PrinterOrder po WHERE po.printer = :printer AND po.createdAt BETWEEN :startDate AND :endDate")
    java.math.BigDecimal calculateTotalCostByPrinterAndPeriod(@Param("printer") Printer printer, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
