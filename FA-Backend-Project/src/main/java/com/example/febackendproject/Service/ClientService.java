package com.example.febackendproject.Service;

import com.example.febackendproject.DTO.FilterClientDTO;
import com.example.febackendproject.DTO.PartialClientDTO;
import com.example.febackendproject.Entity.Client;
import com.example.febackendproject.Hooks.ClientSpecifications;
import com.example.febackendproject.Repository.ClientPaginationRepository;
import com.example.febackendproject.Repository.ClientRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class ClientService {
    
    private final ClientRepository clientRepository;
    private final ClientPaginationRepository clientPaginationRepository;
    
    public Optional<Client> getById(Long id) {
        return clientRepository.findById(id);
    }
    
    public Page<PartialClientDTO> getPartialClients(FilterClientDTO filter, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Specification<Client> spec = Specification
                .where(ClientSpecifications.type(filter.getType()))
                .and(ClientSpecifications.hasKeyword(filter.getKeyword()));
        return clientPaginationRepository.findAll(spec, pageable).map(client -> {
            return new PartialClientDTO(
                    client.getId(),
                    client.getType(),
                    client.getName()
            );
        });
    }
    
    public Boolean existsById(Long id) {
        return clientRepository.existsById(id);
    }
    
    public Boolean existsByName(String name) {
        Optional<Client> client = clientRepository.findByName(name);
        return client.isPresent();
    }
    
    public Client save(Client client) {
        return clientRepository.save(client);
    }
    
    public void deleteById(Long id) {
        clientRepository.deleteById(id);
    }
    
}
