package com.daniel.kakeapp.User;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepo;

    //Método para crear un usuario en la base de datos
    public void createUser(UserEntity userEntity, List<String> familyMembers) {
        userEntity.setFamilyMembers(familyMembers);
        userRepo.save(userEntity);
    }

    //Método para loguear un usuario
    public ResponseEntity<?> loginUser(UserEntity user) {
        UserEntity existingUser = userRepo.findByUserEmailAndUserPassword(user.getUserEmail(), user.getUserPassword());
        if (existingUser != null) {
            return ResponseEntity.ok(existingUser);
        } else {
            return ResponseEntity.badRequest().body("Nombre o contraseña incorrectos");
        }
    }
}
