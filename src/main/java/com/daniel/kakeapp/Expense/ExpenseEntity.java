package com.daniel.kakeapp.Expense;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.sql.Date;

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

        @Column
        private Date expenseDate;

        @Column
        private String expenseDescription;

        @Column
        private String expenseCategory;

        @Column
        private String expenseUserId;
        // TODO: ADD FAMILY MEMBER AUTHOR

    }
