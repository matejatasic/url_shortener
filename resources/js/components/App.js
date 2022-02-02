import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './Main';
import Navbar from './Navbar';
import Form from './Form';

function App() {
    let loggedUser = localStorage.hasOwnProperty('user') ? JSON.parse(localStorage.getItem('user')) : '';
    const [user, setUser] = useState(loggedUser);

    const handleChange = (value) => {
        setUser(value);
    }
    const setUserInStorage = (user) => {
        localStorage.setItem('user', JSON.stringify(user));
    }
    const removeUserFromStorage = () => {
        localStorage.removeItem('user');
    }
    const setAlert = (result, messages) => {
        const alertDiv = document.getElementById('alertDiv');
    
        if(result === 'success') {
            alertDiv.classList = 'alert alert-success';
            alertDiv.style.display = 'block';
            alertDiv.innerHTML = messages;
        }
        else {
            alertDiv.classList = 'alert alert-danger';
            alertDiv.style.display = 'block';
            alertDiv.innerHTML = messages;
        }
    
        setTimeout(() => {
            alertDiv.style.display = 'none';
            alertDiv.innerHTML = '';
        }, 8000)
    }

    const checkInput = (inputs) => {
        let alerts = '';

        if(!inputs['name'].trim() || !inputs['email'].trim() || !inputs['password'].trim()) {
            alerts += '<p>Please fill out all the fields!</p>'; 
        }
        if(!/\S+@\S+\.\S+/.test(inputs['email'])) {
            alerts += '<p>Please enter a valid email!</p>';
        }
        if(inputs['password'].length < 6) {
            alerts += '<p>Password must not be less than 6 characters!</p>';    
        }
        if(alerts.length > 0) {
            setAlert('error', alerts);
            
            return false;
        }
        else return true;
    }

    return (
        <React.Fragment>
            <Navbar user={user} handleChange={handleChange} setAlert={setAlert} removeUserFromStorage={removeUserFromStorage} />
            <div className="container mt-3">
                <Routes>
                    <Route path="/" exact element={<Main />} />
                    <Route path="/login" element={<Form action="login" checkInput={checkInput} setAlert={setAlert} user={user} handleChange={handleChange} setUserInStorage={setUserInStorage} />} />
                    <Route path="/register" element={<Form action="register" checkInput={checkInput} setAlert={setAlert} />} />
                </Routes>
            </div>
        </React.Fragment>
    );
}

export default App;

if (document.getElementById('app')) {
    ReactDOM.render(<Router><App /></Router>, document.getElementById('app'));
}