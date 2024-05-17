package com.daniel.kakeapp.User;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Integer> {
    //Añadir métodos personalizados
    UserEntity findByUserEmailAndUserPassword(String userEmail, String userPassword);
}
