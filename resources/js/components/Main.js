import React from "react";

export default function Main() {
    return (
        <div className="row mt-5">
            <div className="col-md-12 text-center">
                <h1>URLShortener</h1>
            </div>
            <div className="col-md-6 mx-auto mt-5">
                <div className="card">
                    <div className="card-body text-dark">
                        <div id="alertDiv"></div>
                        <div className="form-group">
                            <label>Long URL</label>
                            <input type="text" className="form-control" />
                        </div>
                        <button type="submit" className="btn btn-success mt-2">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    )
}