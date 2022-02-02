import React from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Navbar({user, handleChange, setAlert, removeUserFromStorage}) {
    let navigation = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault();

        axios.post('/api/logout')
        .then(res => {
            if(res.data === 'success') {
                handleChange('');
                removeUserFromStorage();
                return navigation('/');
            }
        })
        .catch(error => {
            console.log(error);
            setAlert('error', '<p>There was a problem while trying to logout!</p>');
        })
    } 

    return (
        <nav className="navbar navbar-expand-md navbar-dark bg-dark shadow-sm">
            <div className="container">
                <Link to="/" className="navbar-brand">
                    URLShortener
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="{{ __('Toggle navigation') }}">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        
                    </ul>

                    <ul className="navbar-nav ml-auto">
                        {typeof(user) === 'object' ? 
                            (
                                <>
                                    <li className="nav-item">
                                        <a href="#" className="nav-link">{user.name}</a>    
                                    </li>
                                    <li className="nav-item">
                                        <a href="#" className="nav-link" onClick={(e) => handleLogout(e)}>Logout</a>
                                    </li>
                                </>
                            ) :
                            (
                                <>
                                    <li className="nav-item">
                                        <Link to="/login" className="nav-link">Login</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/register" className="nav-link">Register</Link>
                                    </li>
                                </>
                            )
                        }
                    </ul>
                </div>
            </div>
        </nav>
    );
} 