package com.daniel.kakeapp.User;

import com.daniel.kakeapp.User.UserController;
import com.daniel.kakeapp.User.UserService;
import com.daniel.kakeapp.User.UserEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

public class UserControllerTest {

    @InjectMocks
    private UserController userController;

    @Mock
    private UserService userService;

    private UserEntity userEntity;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        userEntity = new UserEntity();
        userEntity.setUserEmail("testEmail");
        userEntity.setUserPassword("testPassword");
    }

    @Test
    public void loginUserReturnsOkWhenUserExists() {
        when(userService.loginUser(any(UserEntity.class))).thenReturn(ResponseEntity.ok().build());
        ResponseEntity<?> response = userController.loginUser(userEntity);
        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    public void loginUserReturnsBadRequestWhenUserDoesNotExist() {
        when(userService.loginUser(any(UserEntity.class))).thenReturn(ResponseEntity.badRequest().build());
        ResponseEntity<?> response = userController.loginUser(userEntity);
        assertEquals(400, response.getStatusCodeValue());
    }

}
