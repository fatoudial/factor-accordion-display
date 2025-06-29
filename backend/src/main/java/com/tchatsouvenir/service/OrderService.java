
package com.tchatsouvenir.service;

import com.tchatsouvenir.model.Order;
import com.tchatsouvenir.model.OrderStatus;
import com.tchatsouvenir.model.User;
import com.tchatsouvenir.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<Order> getOrdersWithFilters(OrderStatus status, LocalDateTime dateFrom, 
                                          LocalDateTime dateTo, String search, 
                                          String bookFormat, String paymentMethod) {
        return orderRepository.findWithFilters(status, dateFrom, dateTo, search, bookFormat, paymentMethod);
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    public Optional<Order> getOrderByReference(String orderReference) {
        return orderRepository.findByOrderReference(orderReference);
    }

    public List<Order> getOrdersByUser(User user) {
        return orderRepository.findByUser(user);
    }

    public List<Order> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByStatus(status);
    }

    public Order createOrder(Order order) {
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }

    public Order updateOrder(Order order) {
        order.setUpdatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }

    public Order updateOrderStatus(Long orderId, OrderStatus newStatus) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            order.setStatus(newStatus);
            order.setUpdatedAt(LocalDateTime.now());
            
            if (newStatus == OrderStatus.DELIVERED) {
                order.setCompletedAt(LocalDateTime.now());
            }
            
            return orderRepository.save(order);
        }
        throw new RuntimeException("Commande non trouvée avec l'ID: " + orderId);
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }

    public long getTotalOrdersCount() {
        return orderRepository.count();
    }

    public long getOrdersCountByStatus(OrderStatus status) {
        return orderRepository.findByStatus(status).size();
    }
}
