package com.daniel.kakeapp.Income;

import com.daniel.kakeapp.User.UserEntity;
import com.daniel.kakeapp.User.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IncomeService {
    private final IncomeRepository incomeRepo;
    private final UserRepository userRepo;

    // Método para crear un ingreso en la base de datos
    public void createIncome(IncomeEntity incomeEntity, Integer userId) {
        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("No se encuentra el usuario con el ID proporcionado"));
        incomeEntity.setUser(user);
        incomeRepo.save(incomeEntity);
    }

    // Método para actualizar un ingreso en la base de datos
public void updateIncome(Integer incomeId, IncomeEntity incomeEntity) {
    if (incomeRepo.existsById(incomeId)) {
        IncomeEntity existingIncome = incomeRepo.findById(incomeId)
                .orElseThrow(() -> new IllegalArgumentException("No se encuentra el ingreso con el ID proporcionado"));

        existingIncome.setIncomeAmount(incomeEntity.getIncomeAmount());
        existingIncome.setIncomeDate(incomeEntity.getIncomeDate());
        existingIncome.setIncomeDescription(incomeEntity.getIncomeDescription());


        incomeRepo.save(existingIncome);
    } else {
        throw new IllegalArgumentException("No se encuentra el ingreso con el ID proporcionado");
    }
}

    /* Método para listar todos los ingresos en la base de datos */
    public List<IncomeEntity> listIncomes() {
        return incomeRepo.findAll();
    }

    /* Método para eliminar un ingreso en la base de datos por su ID */
    public void deleteIncome(Integer incomeId) {
        if (incomeRepo.existsById(incomeId)) {
            incomeRepo.deleteById(incomeId);
        } else {
            throw new IllegalArgumentException("No se encuentra el ingreso con el ID proporcionado");
        }
    }
    public List<IncomeEntity> findIncomesByMonth(Integer userId) {
        return incomeRepo.findIncomesByLatestMonth(userId);
    }

    // Método para buscar el total de ingresos de un mes
    public BigDecimal findTotalIncomesByMonth(int month) {
        return incomeRepo.findTotalIncomesByMonth(month);
    }

    // Método para buscar el total de ingresos del mes más reciente por usuario
    public BigDecimal findTotalIncomesByLastMonth(Integer userId) {
        return incomeRepo.findTotalIncomesByLastMonth(userId).orElse(BigDecimal.ZERO);
    }

    // Método para buscar la lista de ingresos del mes más reciente por usuario
    public List<IncomeEntity> listIncomesLastMonth(Integer userId) {
    return incomeRepo.findIncomesByUserIdAndLastMonth(userId);
}
}
