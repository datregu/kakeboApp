package com.daniel.kakeapp.User;


import com.daniel.kakeapp.Expense.ExpenseEntity;
import com.daniel.kakeapp.Income.IncomeEntity;
import com.daniel.kakeapp.MonthlyRecord.MonthlyRecordEntity;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@Entity
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "userId"
)
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
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

    //Con esta anotacion, se establece una relación de uno a muchos entre la entidad UserEntity y la entidad IncomeEntity, es decir, un usuario puede tener muchos ingresos.
    @OneToMany(mappedBy = "user")
    private List<IncomeEntity> incomes;

    //Con esta anotacion, se establece una relación de uno a muchos entre la entidad UserEntity y la entidad IncomeEntity, es decir, un usuario puede tener muchos ingresos.
    @OneToMany(mappedBy = "user")
    private List<MonthlyRecordEntity> monthlyRecords;

    @ElementCollection
    private List<String> familyMembers;
}
