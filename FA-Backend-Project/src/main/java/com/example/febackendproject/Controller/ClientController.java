package com.example.febackendproject.Controller;


import com.example.febackendproject.DTO.FilterClientDTO;
import com.example.febackendproject.DTO.PartialClientDTO;
import com.example.febackendproject.Entity.Client;
import com.example.febackendproject.Service.ClientService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RestControllerAdvice
@Validated
@RequestMapping("/client")
public class ClientController {
    
    private final ClientService clientService;
    
    public ResponseEntity<?> notFound(String dataType, String data) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Client with " + dataType + " " + data + " not found");
    }
    
    public ResponseEntity<?> existingAttribute(String dataType, String data) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Client with " + dataType + " " + data + " already exists");
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getClient(@PathVariable Long id) {
        if (clientService.existsById(id)) {
            return ResponseEntity.ok(clientService.getById(id));
        }
        return notFound("ID", id.toString());
    }
    
    @GetMapping("/search")
    public ResponseEntity<Page<PartialClientDTO>> list(
            FilterClientDTO filter,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(clientService.getPartialClients(filter, page, size));
    }
    
    @PostMapping
    public ResponseEntity<?> addClient(@Validated @RequestBody Client client) {
        if (clientService.existsByName(client.getName())) {
            return existingAttribute("Name", client.getName());
        }
        Client newClient = clientService.save(client);
        return ResponseEntity.ok(newClient);
    }
    
    @PatchMapping
    public ResponseEntity<?> updateClient(@Validated @RequestBody Client client) {
        if (clientService.existsByName(client.getName())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Client with " + client.getName() + " already exists");
        }
        if (clientService.existsById(client.getId())) {
            Client result = clientService.save(client);
            return ResponseEntity.ok(result);
        }
        return notFound("ID", client.getId().toString());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteClient(@PathVariable Long id) {
        if (clientService.existsById(id)) {
            clientService.deleteById(id);
            return ResponseEntity.ok("Client with " + id + " deleted successfully");
        }
        return notFound("ID", id.toString());
    }
    
}
