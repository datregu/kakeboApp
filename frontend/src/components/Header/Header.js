// src/components/Header/Header.js
import React from 'react';

function Header() {
    return (
        <header style={{
            textAlign: 'center',
            verticalAlign: 'middle',
            padding: '10px',
            backgroundColor: '#073b4c',
            color: 'white',
            height: '60px'
        }}>
            <h1>KakeboApp</h1>
        </header>
    );
}

export default Header;