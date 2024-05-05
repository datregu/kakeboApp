package com.daniel.kakeapp.User;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepo;

    //Método para crear un usuario en la base de datos
    public void createUser(UserEntity userEntity) {
        userRepo.save(userEntity);
    }
}
