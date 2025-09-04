package com.example.febackendproject.DTO.Client;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CreateClientDTO {
    private String type;
    private String name;
    private String address;
    private String cuitDni;
    private String email;
    private String phone;
}
