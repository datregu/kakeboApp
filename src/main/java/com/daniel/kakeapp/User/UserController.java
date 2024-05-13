package com.daniel.kakeapp.User;


import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {
    //Primero se declara el servicio de usuario
    private UserService userService;


    //Con autowired se inyecta el servicio de usuario, y se crea un constructor para inicializarlo
    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Crear usuario
    @PostMapping("/createUser")
    public void createUser(@RequestBody UserEntity userEntity) {
        userService.createUser(userEntity, userEntity.getFamilyMembers());
    }
}
