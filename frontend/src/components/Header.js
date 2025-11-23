import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ isLoggedIn, handleLogout }) => {
    const navigate = useNavigate();
    
    const onLogout = () => {
        handleLogout();
        navigate('/login');
    };

    return (
        <header>
            <nav>
                <Link to="/"><h1>Personal Library Tracker</h1></Link>
                {isLoggedIn ? (
                    <button onClick={onLogout}>Logout</button>
                ) : (
                    <div>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;