
package com.tchatsouvenir.controller;

import com.tchatsouvenir.model.Order;
import com.tchatsouvenir.model.OrderStatus;
import com.tchatsouvenir.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {
    
    @Autowired
    private OrderService orderService;

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateTo,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String bookFormat,
            @RequestParam(required = false) String paymentMethod) {
        
        List<Order> orders = orderService.getOrdersWithFilters(
            status, dateFrom, dateTo, search, bookFormat, paymentMethod);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Optional<Order> order = orderService.getOrderById(id);
        return order.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/reference/{orderReference}")
    public ResponseEntity<Order> getOrderByReference(@PathVariable String orderReference) {
        Optional<Order> order = orderService.getOrderByReference(orderReference);
        return order.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        Order createdOrder = orderService.createOrder(order);
        return ResponseEntity.ok(createdOrder);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable Long id, @RequestBody Order order) {
        order.setId(id);
        Order updatedOrder = orderService.updateOrder(order);
        return ResponseEntity.ok(updatedOrder);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        OrderStatus newStatus = OrderStatus.valueOf(request.get("status"));
        Order updatedOrder = orderService.updateOrderStatus(id, newStatus);
        return ResponseEntity.ok(updatedOrder);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getOrderStats() {
        long totalOrders = orderService.getTotalOrdersCount();
        long pendingOrders = orderService.getOrdersCountByStatus(OrderStatus.PENDING_PAYMENT) +
                           orderService.getOrdersCountByStatus(OrderStatus.PAID) +
                           orderService.getOrdersCountByStatus(OrderStatus.PROCESSING);
        long completedOrders = orderService.getOrdersCountByStatus(OrderStatus.DELIVERED);
        
        Map<String, Object> stats = Map.of(
            "totalOrders", totalOrders,
            "pendingOrders", pendingOrders,
            "completedOrders", completedOrders
        );
        
        return ResponseEntity.ok(stats);
    }
}
