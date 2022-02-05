import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function UrlList({user, handleRemove, handleDetails, setAlert, editTinyUrlInStorage}) {
    let navigation = useNavigate();
    let urls = localStorage.hasOwnProperty('urls') ? JSON.parse(localStorage.getItem('urls')) : [];

    const handleSave = (url) => {
        url['user_id'] = user.id;

        axios.post('/api/save', url)
        .then(res => {
            if(res.data.success) {
                editTinyUrlInStorage(res.data.url);

                return navigation('/url-list');
            }
        })
        .catch(error => {
            console.log(error);
            setAlert('error', '<p>There was a problem while trying to save the url to the database!</p>');
        })
    }

    const reduceVisitCount = (url) => {
        if(user.id === url.user_id && url.hasOwnProperty('id') && url.rate_limit !== null) {
            axios.post('/api/reduceVisitCount', {
                id: url.id,
            })
            .then(res => {
                if(res.data.expired === true) {
                    handleRemove(res.data.url.tiny_url);
                }
                else {
                    editTinyUrlInStorage(res.data.url);
                } 

                return navigation('/url-list');
            })
            .catch(error => {
                console.log(error);
            });
        }
        else {
            url['rate_limit']--;
            
            if(url['rate_limit'] === 0) {
                handleRemove(url.tiny_url);
            }
            else {
                editTinyUrlInStorage(url);
            }

            return navigation('/url-list');
        }
    }

    return (
        <div className="row mt-5">
            <div className="col-md-12 text-center">
                <h1>You URLs</h1>
            </div>
            <div className="col-md-8 mx-auto">
                <div id="alertDiv"></div>
            </div>
            <div className="col-md-8 mx-auto mt-5">
                {
                    urls.length === 0 ? (
                        <p>No shortened urls in the database</p>
                    ) : 
                    urls.map(url => {
                        return (
                            <div className="card mb-3">
                                <div className="row no-gutters text-dark">
                                    <div className="col-md-4 p-3">
                                        <h5><a href={url.url} target="_blank" onClick={() => reduceVisitCount(url)}>{url.tiny_url}</a></h5>
                                        <p className="text-secondary">{url.url}</p>
                                        <small>Expiration date: {url.expiration_date === null ? 'Empty' : url.expiration_date}</small>
                                        <br />
                                        <small>Rate limit: {url.rate_limit === null ? 'Empty' : url.rate_limit}</small>
                                    </div>
                                    <div className="col-md-8">
                                        <div className="card-body d-flex justify-content-between pt-5">
                                            {typeof(user) === 'object' && !url.hasOwnProperty('id') ? 
                                                (
                                                    <button className="btn btn-primary" onClick={() => handleSave(url)}>Save to Database</button>
                                                ) :
                                                (typeof(user) === 'object' && url.hasOwnProperty('id') ?
                                                    (
                                                        <button className="btn btn-primary" disabled title="Already in the database">Save to Database</button>  
                                                    ) : 
                                                    (typeof(user) !== 'object' ? 
                                                        (
                                                            <button className="btn btn-primary" disabled title="Already in the database">Save to Database</button>
                                                        ) :
                                                        (
                                                            <button className="btn btn-primary" onClick={() => handleSave(url)}>Save to Database</button>   
                                                        )
                                                    )
                                                )
                                            }
                                            {typeof(user) === 'object' ? 
                                                (
                                                    <>
                                                        <Link to="/edit-url" className="btn btn-success" onClick={() => handleDetails(url)}>Edit</Link>
                                                    </>
                                                ) :
                                                (
                                                    <>
                                                        <button className="btn btn-success" disabled title="Please login to enable this feature">Edit</button>
                                                    </>    
                                                )
                                            }
                                            {typeof(user) === 'object' && url.hasOwnProperty('id') ? 
                                                (
                                                    <button id={url.tiny_url} className="btn btn-danger" onClick={(e) => handleRemove(e.target.id)}>Remove</button>
                                                ) : 
                                                (
                                                    typeof(user) === 'object' && !url.hasOwnProperty('id') ? 
                                                        (
                                                            <button id={url.tiny_url} className="btn btn-danger" onClick={(e) => handleRemove(e.target.id)}>Remove</button>     
                                                        ) :
                                                        (
                                                            typeof(user) !== 'object' && !url.hasOwnProperty('id') ?
                                                                (
                                                                    <button id={url.tiny_url} className="btn btn-danger" onClick={(e) => handleRemove(e.target.id)}>Remove</button>
                                                                ) :
                                                                (
                                                                    <button id={url.tiny_url} className="btn btn-danger" disabled title="You must be logged in to delete this url">Remove</button>
                                                                )
                                                        )
                                                ) 
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }   
            </div>
        </div>
    )
}
