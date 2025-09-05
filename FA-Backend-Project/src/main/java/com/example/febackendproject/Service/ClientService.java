package com.example.febackendproject.Service;

import com.example.febackendproject.DTO.Client.CreateClientDTO;
import com.example.febackendproject.DTO.FilterClientDTO;
import com.example.febackendproject.DTO.Client.PartialClientDTO;
import com.example.febackendproject.Entity.Client;
import com.example.febackendproject.Exception.ResourceNotFoundException;
import com.example.febackendproject.Hooks.ClientSpecifications;
import com.example.febackendproject.Mapper.ClientMapper;
import com.example.febackendproject.Repository.ClientPaginationRepository;
import com.example.febackendproject.Repository.ClientRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ClientService {
    
    private final ClientRepository clientRepository;
    private final ClientPaginationRepository clientPaginationRepository;
    
    public Client getById(Long id) {
        Optional<Client> client = clientRepository.findById(id);
        if (client.isEmpty()) {
            throw new ResourceNotFoundException("Cliente con ID " + id + " no encontrado.");
        }
        return client.get();
    }
    
    public Page<PartialClientDTO> getPartialClients(FilterClientDTO filter, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Specification<Client> spec = Specification
                .where(ClientSpecifications.type(filter.getType()))
                .and(ClientSpecifications.hasKeyword(filter.getKeyword()));
        return clientPaginationRepository.findAll(spec, pageable).map(ClientMapper::createPartialClient);
    }
    
    public List<PartialClientDTO> list() {
        return clientRepository.list();
    }
    
    public void assertClientExists(Long id) {
        if (clientRepository.findById(id).isEmpty()) {
            throw new ResourceNotFoundException("Cliente con ID " + id + " no encontrado.");
        }
    }
    
    public Client save(CreateClientDTO dto) {
        Client client = ClientMapper.createClient(dto);
        return clientRepository.save(client);
    }
    
    public Client update(CreateClientDTO dto, Long id) {
        Optional<Client> search = clientRepository.findById(id);
        if (search.isEmpty()) {
            throw new ResourceNotFoundException("Cliente con ID " + id + " no encontrado.");
        }
        Client client = search.get();
        ClientMapper.updateFromDTO(client, dto);
        return clientRepository.save(client);
    }
    
    public void deleteById(Long id) {
        this.assertClientExists(id);
        clientRepository.deleteById(id);
    }
    
}
