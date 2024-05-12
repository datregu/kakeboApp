package com.daniel.kakeapp.MonthlyRecord;


import com.daniel.kakeapp.User.UserEntity;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private Integer m_r_Year;

    @Column
    private Integer m_r_Month;

    @Column
    private Integer m_r_TotalIncome;

    @Column
    private Integer m_r_TotalExpense;

    @Column
    private Integer m_r_DesiredSavings;

    @Column
    private Integer m_r_RealSavings;


    @ManyToOne
    @JoinColumn(name = "id_user_monthly_record", referencedColumnName = "user_id")
    @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "userId")
    @JsonIdentityReference(alwaysAsId = true)
    private UserEntity user;
}
