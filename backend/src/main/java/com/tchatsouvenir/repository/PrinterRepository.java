
package com.tchatsouvenir.repository;

import com.tchatsouvenir.model.Printer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PrinterRepository extends JpaRepository<Printer, Long> {
    List<Printer> findByIsActiveTrue();
    List<Printer> findByNameContainingIgnoreCase(String name);
}
