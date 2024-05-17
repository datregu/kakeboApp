package com.daniel.kakeapp.User;
import com.daniel.kakeapp.User.UserEntity;
import com.daniel.kakeapp.User.UserRepository;
import com.daniel.kakeapp.User.UserService;
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

public class UserServiceTest {

    @InjectMocks
    private UserService userService;

    @Mock
    private UserRepository userRepository;

    private UserEntity userEntity;
    // Método para inicializar los mocks
    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        userEntity = new UserEntity();
        userEntity.setUserEmail("testEmail");
        userEntity.setUserPassword("testPassword");
    }
// Test para comprobar quen  el método loginUser devuelve un código 200 cuando el usuario existe
    @Test
    public void loginUserReturnsOkWhenUserExists() {
        when(userRepository.findByUserEmailAndUserPassword(any(String.class), any(String.class))).thenReturn(userEntity);
        ResponseEntity<?> response = userService.loginUser(userEntity);
        assertEquals(200, response.getStatusCodeValue());
    }
// Test para comprobar que el método loginUser devuelve un código 400 cuando el usuario no existe
    @Test
    public void loginUserReturnsBadRequestWhenUserDoesNotExist() {
        when(userRepository.findByUserEmailAndUserPassword(any(String.class), any(String.class))).thenReturn(null);
        ResponseEntity<?> response = userService.loginUser(userEntity);
        assertEquals(400, response.getStatusCodeValue());
    }
// Test para comprobar que el método createUser guarda un usuario con los miembros de la familia
    @Test
    public void createUserSavesUserWithFamilyMembers() {
        List<String> familyMembers = Arrays.asList("John", "Jane");
        userService.createUser(userEntity, familyMembers);
        assertEquals(familyMembers, userEntity.getFamilyMembers());
    }
}
