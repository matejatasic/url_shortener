import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './Main';
import Navbar from './Navbar';
import Urllist from './Urllist';
import Form from './Form';

function App() {
    let loggedUser = localStorage.hasOwnProperty('user') ? JSON.parse(localStorage.getItem('user')) : '';
    let shortenedUrls = localStorage.hasOwnProperty('urls') ? JSON.parse(localStorage.getItem('urls')) : ''

    const [user, setUser] = useState(loggedUser);
    const [urls, setUrls] = useState(shortenedUrls);

    const handleChange = (target, value) => {
        if(target === 'user') setUser(value);
        else setUrls([...urls, value]);;
    }
    const setUserInStorage = (user) => {
        localStorage.setItem('user', JSON.stringify(user));
    }
    const removeUserFromStorage = () => {
        localStorage.removeItem('user');
    }
    const setTinyUrlInStorage = (url) => {
        let tempUrls = localStorage.getItem('urls') !== null ? JSON.parse(localStorage.getItem('urls')) : [];
        tempUrls.push(url);
        localStorage.setItem('urls', JSON.stringify(tempUrls));    
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
        
        if(!inputs['name'].trim() || !inputs['email'].trim() || !inputs['password'].trim() || !inputs['url'].trim() || !inputs['date'].trim()) {
            alerts += '<p>Please fill out all the fields!</p>'; 
        }
        if(inputs['email'] !== 'empty' && !/\S+@\S+\.\S+/.test(inputs['email'])) {
            alerts += '<p>Please enter a valid email!</p>';
        }
        if(inputs['password'] !== 'empty' && inputs['password'].length < 6) {
            alerts += '<p>Password must not be less than 6 characters!</p>';    
        }
        if(inputs['url'] !== 'empty' && !/(((https?:\/\/)|(www\.))[^\s]+.com)/g.test(inputs['url'])) {
            alerts += '<p>Please enter a valid url!</p>';
        }
        if(inputs['date'] !== 'empty') {
            let today = new Date();
            const dd = String(today.getDate()).padStart(2, '0');
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const yyyy = today.getFullYear();
            today = yyyy + '-' + mm + '-' + dd;

            if(inputs['date'] <= today) {
                alerts += '<p>Please enter a date that is bigger than todays date!</p>';   
            }
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
                    <Route path="/" exact element={<Main user={user} checkInput={checkInput} handleChange={handleChange} setTinyUrlInStorage={setTinyUrlInStorage} setAlert={setAlert} />} />
                    <Route path="/url-list" element={<Urllist urls={urls} />} />
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