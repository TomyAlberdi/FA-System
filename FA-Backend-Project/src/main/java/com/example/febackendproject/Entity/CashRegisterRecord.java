package com.example.febackendproject.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
public class CashRegisterRecord {

    public enum Type {
        INGRESO, SALIDA
    }

    @Column
    private Type type;

    @Column
    private Double amount;

    @Column
    private String detail;

}
