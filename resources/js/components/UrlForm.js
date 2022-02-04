import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UrlForm({editDetails, handleDetails, setAlert, editTinyUrlInStorage}) {
    const [input, setInput] = useState(editDetails.url);
    const [date, setDate] = useState(editDetails.expiration_date);
    let navigation = useNavigate();

    const handleInputChange = (target, e) => {
        if(target === 'input') setInput(e.target.value);
        else setDate(e.target.value);
    }

    const handleClick = (e) => {
        e.preventDefault();
        
        if(editDetails.hasOwnProperty('id')) {
            axios.post('/api/editUrl', {
                id: editDetails.id,
                url:input,
                tiny_url: editDetails.tiny_url,
                expiration_date: date
            })
            .then(res => {
                if(res.data.success === 'success') {
                    handleDetails('');
                    editTinyUrlInStorage(res.data.url);

                    return navigation('/url-list');
                } 
            })
            .catch(error => {
                console.log(error);
                setAlert('error', '<p>There was a problem while trying to edit the url!</p>');
            });
        }
        else {
            handleDetails('');
            editTinyUrlInStorage({url: input, tiny_url: editDetails.tiny_url, expiration_date: date});

            navigation('/url-list');         
        }
    }
    return (
        <div className="row mt-5">
            <div className="col-md-12 text-center">
                <h1>Edit URL</h1>
            </div>
            <div className="col-md-6 mx-auto mt-5">
                <div className="card">
                <div className="card-body text-dark">
                    <form id="form">
                        <div id="alertDiv"></div>
                        <div className="form-group">
                            <label>Shortened URL</label>
                            <input type="text" className="form-control" defaultValue={editDetails.tiny_url} readOnly/>
                        </div>
                        <div className="form-group">
                            <label>Long URL</label>
                            <input type="text" className="form-control" defaultValue={editDetails.url} onChange={(e) => handleInputChange('input', e)}/>
                        </div>
                        <div className="form-group">
                            <label>Expiration date</label>
                            <input type="date" className="form-control" defaultValue={editDetails.expiration_date} onChange={(e) => handleInputChange('date', e)}/>
                        </div>
                        <button type="submit" className="btn btn-success mt-2" onClick={(e) => handleClick(e)}>Submit</button>
                    </form>
                </div>
                </div>
            </div>
        </div>
    )
}