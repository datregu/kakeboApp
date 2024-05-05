package com.daniel.kakeapp.User;


import com.daniel.kakeapp.Expense.ExpenseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;

    @Column
    private String userName;
    @Column
    private String userPassword;
    @Column
    private String userEmail;


    // Con esta anotación, se establece una relación de uno a muchos entre la entidad UserEntity y la entidad ExpenseEntity, es decir, un usuario puede tener muchos gastos.
    @OneToMany(mappedBy = "user")
    private List<ExpenseEntity> expenses;

    //TODO: Añadir campo familiares con un ENUM
    @ElementCollection
    private List<String> familyMembers;
}
