import axios from "axios";
import React, { useState } from "react";

export default function Main({user, checkInput, handleChange, setTinyUrlInStorage, setAlert}) {
    const [input, setInput] = useState('');
    const [date, setDate] = useState('');

    const handleInputChange = (target, e) => {
        if(target === 'input') setInput(e.target.value);
        else setDate(e.target.value);
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

        if(checkInput({name: 'empty', email: 'empty', password: 'empty', url: input, date: date})) {
            let tempInput = input.indexOf('http://') !== -1 ? input : 'http://' + input;
            let url = {url: tempInput, tinyUrl: tinyUrl, date: date};

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
                                <input type="date" className="form-control" onChange={(e) => handleInputChange('date', e)}/>
                            </div>
                            <button type="submit" className="btn btn-success mt-2" onClick={(e) => handleClick(e)}>Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}