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

    /* Método para actualizar un gasto en la base de datos por su ID */
    public void updateIncome(Integer incomeId, IncomeEntity incomeEntity) {
      if (incomeRepo.existsById(incomeId)) {
          incomeEntity.setIncomeId(incomeId);
          incomeRepo.save(incomeEntity);
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

    //Método para buscar un ingreso por mes, se le pasa el mes como parámetro
    public List<IncomeEntity> findIncomesByMonth(int month) {
        return incomeRepo.findByIncomeMonth(month);
    }

    // Método para buscar el total de ingresos de un mes
    public BigDecimal findTotalIncomesByMonth(int month) {
        return incomeRepo.findTotalIncomesByMonth(month);
    }
}
