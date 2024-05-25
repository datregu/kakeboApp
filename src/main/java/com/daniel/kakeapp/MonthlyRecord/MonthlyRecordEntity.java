package com.daniel.kakeapp.MonthlyRecord;


import com.daniel.kakeapp.User.UserEntity;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Entity
@Table(name="monthly_records")
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyRecordEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer m_r_Id;

    @Column
    private Integer year;

    @Column
    private Integer month;

    @Column
    private BigDecimal fixed_expenses;

    @Column
    private BigDecimal total_income;

    @Column
    private BigDecimal total_expense;

    @Column
    private BigDecimal desired_savings;

    @Column
    private BigDecimal real_savings;


    @ManyToOne
    @JoinColumn(name = "id_user_monthly_record", referencedColumnName = "user_id")
    @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "userId")
    @JsonIdentityReference(alwaysAsId = true)
    private UserEntity user;
}
