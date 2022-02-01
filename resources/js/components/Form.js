import React from "react";

export default function Form({action}) {
    return (
        <div className="row mt-5">
            <div className="col-md-12 text-center">
                <h1>{action === 'login' ? 'Login' : 'Register'}</h1>
            </div>
            <div className="col-md-6 mx-auto mt-5">
                <div className="card">
                    <div className="card-body text-dark">
                        <div id="alertDiv"></div>
                        <form action={action === 'login' ? '/login' : '/register'} method="POST">
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
                            <button type="submit" className="btn btn-success mt-2">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}