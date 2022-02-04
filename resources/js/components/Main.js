import axios from "axios";
import { filter } from "lodash";
import React, { useState } from "react";

export default function Main({user, checkInput, handleChange, setTinyUrlInStorage, setAlert}) {
    const [input, setInput] = useState('');
    const [date, setDate] = useState('empty');
    const [rateLimit, setRateLimit] = useState('empty');
    const [expirationByLimit, setExpirationByLimit] = useState(false);

    const handleInputChange = (target, e) => {
        if(target === 'input') setInput(e.target.value);
        else if(target === 'date') setDate(e.target.value);
        else setRateLimit(e.target.value);
    }
    const checkIfUrlInDatabase = (url) => {
        let urlsInStorage = localStorage.hasOwnProperty('urls') ? JSON.parse(localStorage.getItem('urls')).filter(storageUrl => storageUrl.tiny_url === url).length : 0;
        let result = true;

        if(urlsInStorage === 0) {
            axios.post('/api/checkUrl', {
                url: url,
            })
            .then(res => {
                
            })
            .catch(error => {
                console.log(error);
                setAlert('error', '<p>The url is already taken, please try again.</p>');
                
                result = false;
            })
        }
        else {
            setAlert('error', '<p>The url is already taken, please try again.</p>');
                
            result = false;
        }

        return result;
    }
    const getRandomChars = () => {
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = 'tinyurl.com/';

        for(let i = 0; i < 8; i++) {
            let index = Math.floor(Math.random() * possible.length);
            result += possible[index];
        }

        return result;
    }
    const handleClick = (e) => {
        e.preventDefault()

        let tinyUrl = getRandomChars();

        if(checkInput({name: 'empty', email: 'empty', password: 'empty', url: input, expiration_date: date, rate_limit: rateLimit}) && checkIfUrlInDatabase(tinyUrl)) {
            let tempInput = input.indexOf('http://') !== -1 ? input : 'http://' + input;
            let url = {url: tempInput, tiny_url: tinyUrl, expiration_date: date, rate_limit: rateLimit};
            
            // If user is not logged in
            if(typeof(user) !== 'object') {
                handleChange('urls', url);
                setTinyUrlInStorage(url);
                setAlert('success', '<p>Successfully shortened the url!</p>');
            }
            // If user is logged in
            else {
                url['user_id'] = user.id;

                axios.post('/api/addUrl', url)
                .then(res => {
                    if(res.data.success) {
                        handleChange('urls', url);
                        setTinyUrlInStorage(res.data.url);
                        setAlert('success', '<p>Successfully shortened the url!</p>');
                    }
                })
                .catch(error => {
                    console.log(error);
                    setAlert('error', '<p>There was a problem while trying to shorten the url!</p>');
                });
            }
            
            document.getElementById('form').reset();
        }
    }

    return (
        <div className="row mt-5">
            <div className="col-md-12 text-center">
                <h1>URLShortener</h1>
            </div>
            <div className="col-md-6 mx-auto mt-5">
                <div className="card">
                    <div className="card-body text-dark">
                        <form id="form">
                            <div id="alertDiv"></div>
                            <div className="form-group">
                                <label>Long URL</label>
                                <input type="text" className="form-control" onChange={(e) => handleInputChange('input', e)} placeholder="Ex. www.google.com"/>
                            </div>
                            <div className="form-group">
                                <label>Expiration date</label>
                                <input type="date" className="form-control" disabled={expirationByLimit} onChange={(e) => handleInputChange('date', e)}/>
                            </div>
                            <div className="form-check my-3">
                                <input className="form-check-input" type="checkbox" defaultChecked={expirationByLimit} onClick={() => setExpirationByLimit(!expirationByLimit)} />
                                <label className="form-check-label">
                                    Make url expiration by rate limit
                                </label>
                            </div>
                            <div className="form-group">
                                <label>Rate limit</label>
                                <input type="number" disabled={expirationByLimit === false} className="form-control" onChange={(e) => handleInputChange('rate', e)}/>
                            </div>
                            <button type="submit" className="btn btn-success mt-2" onClick={(e) => handleClick(e)}>Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}