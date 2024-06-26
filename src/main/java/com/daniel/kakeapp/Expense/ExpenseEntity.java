package com.daniel.kakeapp.Expense;


import com.daniel.kakeapp.User.UserEntity;
import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "expenses")
@NoArgsConstructor
@AllArgsConstructor

//Clase que representa la entidad de un Gasto
public class ExpenseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer expenseId;

    @Column
    private BigDecimal expenseAmount;

    //Por defecto, cuando se quiera pasar una fecha a través de un JSON, se puede hacer en formato "dd-MM-yyyy"
    @Column
    @DateTimeFormat(pattern = "dd-MM-yyyy")
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate expenseDate;

    @Column
    private String expenseDescription;

    @Column
    @Enumerated(EnumType.STRING)
    private ExpenseCategory expenseCategory;

    @ManyToOne
    @JoinColumn(name = "id_user_expense", referencedColumnName = "user_id")
    @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "userId")
    @JsonIdentityReference(alwaysAsId = true)
    private UserEntity user;
    }

