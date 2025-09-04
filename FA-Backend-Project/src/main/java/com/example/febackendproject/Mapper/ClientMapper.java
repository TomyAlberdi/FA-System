package com.example.febackendproject.Mapper;

import com.example.febackendproject.DTO.Client.CreateClientDTO;
import com.example.febackendproject.DTO.Client.PartialClientDTO;
import com.example.febackendproject.Entity.Client;

public class ClientMapper {
    
    public static Client createClient(CreateClientDTO dto) {
        Client client = new Client();
        updateFromDTO(client, dto);
        return client;
    }
    
    public static PartialClientDTO createPartialClient(Client client) {
        PartialClientDTO partialClientDTO = new PartialClientDTO();
        partialClientDTO.setId(client.getId());
        partialClientDTO.setName(client.getName());
        partialClientDTO.setType(client.getType());
        return partialClientDTO;
    }
    
    public static void updateFromDTO(Client client, CreateClientDTO dto) {
        client.setType(dto.getType());
        client.setName(client.getName());
        client.setAddress(client.getAddress());
        client.setCuitDni(client.getCuitDni());
        client.setEmail(client.getEmail());
        client.setPhone(client.getPhone());
    }
    
}
