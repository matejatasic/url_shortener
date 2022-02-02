import React from "react";
import { Link } from "react-router-dom";

export default function Urllist({urls}) {
    console.log(urls);
    return (
        <div className="row mt-5">
            <div className="col-md-12 text-center">
                <h1>You URLs</h1>
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
                                        <h5><a href={url.url} target="_blank">{url.tinyUrl}</a></h5>
                                        <p className="text-secondary">{url.url}</p>
                                        <small>Expiration date: {url.date}</small>
                                    </div>
                                    <div className="col-md-8">
                                        <div className="card-body d-flex justify-content-between pt-5">
                                            <button className="btn btn-primary">Rename</button>
                                            <button className="btn btn-success">Edit</button>
                                            <button className="btn btn-danger">Remove</button>
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