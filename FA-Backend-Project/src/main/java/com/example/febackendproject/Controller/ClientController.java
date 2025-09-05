package com.example.febackendproject.Controller;


import com.example.febackendproject.DTO.Client.CreateClientDTO;
import com.example.febackendproject.DTO.FilterClientDTO;
import com.example.febackendproject.Entity.Client;
import com.example.febackendproject.Service.ClientService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RestControllerAdvice
@RequestMapping("/client")
public class ClientController {
    
    private final ClientService clientService;
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getClient(@PathVariable Long id) {
        return ResponseEntity.ok(clientService.getById(id));
    }
    
    @GetMapping("/search")
    public ResponseEntity<?> list(
            FilterClientDTO filter,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(clientService.getPartialClients(filter, page, size));
    }
    
    @GetMapping("/list")
    public ResponseEntity<?> listComplete() {
        return ResponseEntity.ok(clientService.list());
    }
    
    @PostMapping
    public ResponseEntity<?> addClient(@RequestBody CreateClientDTO client) {
        Client newClient = clientService.save(client);
        return ResponseEntity.ok(newClient);
    }
    
    @PatchMapping("/{id}")
    public ResponseEntity<?> updateClient(@RequestBody CreateClientDTO client, @PathVariable Long id) {
        Client newClient = clientService.update(client, id);
        return ResponseEntity.ok(newClient);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteClient(@PathVariable Long id) {
        clientService.deleteById(id);
        return ResponseEntity.ok().build();
    }
    
}
