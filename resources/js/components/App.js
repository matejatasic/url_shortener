import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './Main';
import Navbar from './Navbar';
import Form from './Form';

function App() {
    return (
        <React.Fragment>
            <Navbar />
            <div className="container mt-3">
                <Routes>
                    <Route path="/" exact element={<Main />} />
                    <Route path="/login" element={<Form action="login" />} />
                    <Route path="/register" element={<Form action="register" />} />
                </Routes>
            </div>
        </React.Fragment>
    );
}

export default App;

if (document.getElementById('app')) {
    ReactDOM.render(<Router><App /></Router>, document.getElementById('app'));
}