package com.example.febackendproject.Mapper;

import com.example.febackendproject.DTO.Provider.CreateProviderDTO;
import com.example.febackendproject.Entity.Provider;

public class ProviderMapper {
    
    public static Provider toEntity(CreateProviderDTO dto) {
        Provider provider = new Provider();
        updateFromDTO(provider, dto);
        return provider;
    }
    
    public static void updateFromDTO(Provider provider, CreateProviderDTO dto) {
        provider.setName(dto.getName());
        provider.setLocality(dto.getLocality());
        provider.setAddress(dto.getAddress());
        provider.setPhone(dto.getPhone());
        provider.setEmail(dto.getEmail());
        provider.setCuit(dto.getCuit());
    }
    
    public static CreateProviderDTO toDTO(Provider provider) {
        CreateProviderDTO dto = new CreateProviderDTO();
        dto.setName(provider.getName());
        dto.setLocality(provider.getLocality());
        dto.setAddress(provider.getAddress());
        dto.setPhone(provider.getPhone());
        dto.setEmail(provider.getEmail());
        dto.setCuit(provider.getCuit());
        return dto;
    }
    
}
