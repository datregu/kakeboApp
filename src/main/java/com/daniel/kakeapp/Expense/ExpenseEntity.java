package com.daniel.kakeapp.Expense;


import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
    @Entity
    @NoArgsConstructor
    @AllArgsConstructor
    public class ExpenseEntity {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Integer expenseId;

        @Column
        private BigDecimal expenseAmount;
//TODO: ADD PARSING TO DATE
    //Por defecto, cuando se quiera pasar una fecha a través de un JSON, se debe hacer en formato "yyyy-MM-dd"
        @Column
        @DateTimeFormat(pattern = "dd-MM-yyyy")
        @JsonFormat(pattern = "dd-MM-yyyy")
        private LocalDate expenseDate;

        @Column
        private String expenseDescription;

        @Column
        @Enumerated(EnumType.STRING)
        private ExpenseCategory expenseCategory;

        @Column
        private String expenseUserId;
        // TODO: ADD FAMILY MEMBER AUTHOR

    }
