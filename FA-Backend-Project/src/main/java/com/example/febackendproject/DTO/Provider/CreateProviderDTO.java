package com.example.febackendproject.DTO.Provider;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CreateProviderDTO {
    private String name;
    private String locality;
    private String address;
    private String phone;
    private String email;
    private String cuit;
}
