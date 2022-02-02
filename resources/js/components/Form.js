import React, { useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

export default function Form({action, checkInput, setAlert, user, handleChange, setUserInStorage}) {
    let navigation = useNavigate();

    const handleClick = (e) => {
        e.preventDefault();

        const name = action === 'register' ? document.getElementById('name').value : 'empty';
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if(checkInput({name: name, email: email, password: password, url: 'empty', date: 'empty'})) {
            if(action === 'register') {
                axios.post('/api/register', {
                    name: name, 
                    email: email, 
                    password: password
                })
                .then(res => {
                    if(res.data === 'success') {
                        setAlert('success', '<p>Successfully registered the user!</p>');
                    }
                })
                .catch(error => {
                    console.log(error);
                    setAlert('error', '<p>There was a problem while trying to register!</p>');
                });
    
                document.getElementById('form').reset();
            }
            else {
                axios.post('/api/login', {
                    email: email,
                    password: password,
                })
                .then(res => {
                    if(res.data.success === 'success') {
                       handleChange('user', res.data.user);
                       setUserInStorage(res.data.user);
                       return navigation('/');
                    }
                })
                .catch(error => {
                    console.log(error);
                    setAlert('error', '<p>There was a problem while trying to login!</p>');
                });
            }
        }
    }

    return (
        <div className="row mt-5">
            <div className="col-md-12 text-center">
                <h1>{action === 'login' ? 'Login' : 'Register'}</h1>
            </div>
            <div className="col-md-6 mx-auto mt-5">
                <div className="card">
                    <div className="card-body text-dark">
                        <div id="alertDiv" className="alert alert-danger"></div>
                        <form id="form">
                            {action === 'register' ? 
                                (
                                    <div className="form-group">
                                        <label>Name</label>
                                        <input type="text" id="name" className="form-control" />
                                    </div>
                                ) : 
                                ('')
                            }
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" id="email" className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input type="password" id="password" className="form-control" />
                            </div>
                            <button type="submit" className="btn btn-success mt-2" onClick={(e) => handleClick(e)}>Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}