import React, { useState } from 'react';
import axios from 'axios';

function PasswordReset() {
    const baseUrl = 'http://127.0.0.1:8000';
    const [username, setUsername] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const resetResponse = await axios.post(`${baseUrl}/buyer/reset-password/`, {
                username: username,  // Include the username in the request
            });
            setErrorMessage('');
            setUsername('');
            setSuccessMessage('A confirmation email has been sent. Please check your inbox for further instructions');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setErrorMessage(error.response.data.error);
            } else {
                setErrorMessage('An unexpected error occurred');
            }
        }
    };

    return (
        <div className="container h-100">
            <div className="row h-100 justify-content-center align-items-center">
                <div style={{ marginTop: '200px' }} className="col-md-5">
                    <div className="card hover-effect">
                        <div className="card-body pt-4 pb-4">
                            <div style={{fontFamily: 'Trebuchet MS',fontSize: '22px',fontWeight: 'bold',}} className="card-title text-center mb-4">Reset Password</div>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label style={{fontFamily: 'Trebuchet MS',fontSize: '17px',fontWeight: 'bold',}} htmlFor="username" className="form-label">Username</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" style={{ fontFamily: 'Trebuchet MS', borderRadius: '8px', width: '150px', height: '45px', fontSize: '16px', fontWeight: 'bold', marginTop: '15px'}} className="btn btn-primary btn-block mx-auto d-block">Reset Password</button>

                            </form>
                            <div className="mt-3 d-flex flex-column align-items-center">
                                {errorMessage && <div style={{ fontFamily: 'Trebuchet MS', fontSize: '15px' }} className="alert alert-danger">{errorMessage}</div>}
                                {successMessage && <div style={{ fontFamily: 'Trebuchet MS', fontSize: '15px' }} className="alert alert-success">{successMessage}</div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PasswordReset;
