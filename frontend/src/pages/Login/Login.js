import React, { useState, useContext } from 'react';
import { Button, TextField, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header  from "../../components/Header/Header";
import './Login.css';
import UserContext from "../../components/UserContext/UserContext";

const Login = () => {
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const userData = {
            userEmail,
            userPassword
        };

        try {
            const response = await fetch('http://localhost:8080/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Success:', data);

            // Store the server response in local storage
            localStorage.setItem('user', JSON.stringify(data));

           // Update the user context
            setUser(data);

            // Redirect the user to the dashboard
            navigate('/dashboard');
        } catch (error) {
            console.error('Error:', error);
        }
    };
return (
    <>
    <Header/>
    <Box className="loginFormContainer">
        <div className="formFieldsContainer">
            <form onSubmit={handleSubmit}>
                <TextField
                    className="formField"
                    label="Email"
                    variant="outlined"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    style={{ display: "flex", flexDirection: "column",
                    marginBottom: "20px"}}
                />
                <TextField
                    className="formField"
                    label="Password"
                    variant="outlined"
                    type="password"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    style={{ display: "flex", flexDirection: "column", marginBottom: "20px"}}
                />
                <Button variant="contained" color="primary" type="submit">
                    Login
                </Button>
            </form>
        </div>
    </Box>
    </>
);
};

export default Login;