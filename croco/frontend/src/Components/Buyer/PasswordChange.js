import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function PasswordChange() {
    const baseUrl = 'http://127.0.0.1:8000';
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const query = new URLSearchParams(useLocation().search);
    const username = query.get('username');

    useEffect(() => {
        if (!username) {
            setErrorMessage('Invalid or missing username parameter.');
        }
    }, [username]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }
        try {
            const resetResponse = await axios.post(`${baseUrl}/buyer/change-password/`, {
                username: username,
                new_password: password,
                confirm_password: confirmPassword,
            });
            setErrorMessage('');
            setPassword('');
            setConfirmPassword('');
            setSuccessMessage('Password reset successfully , you can login now using your new password');
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
                <div style={{ marginTop: '280px' }} className="col-md-5">
                    <div className="card hover-effect">
                        <div className="card-body pt-4 pb-4">
                            <div style={{ fontFamily: 'Trebuchet MS', fontSize: '20px' ,fontWeight:'bold'}} className="card-title text-center mb-4">Change Password</div>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label style={{ fontFamily: 'Trebuchet MS', fontSize: '17px',fontWeight:'bold'}} htmlFor="password" className="form-label">New Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label style={{ fontFamily: 'Trebuchet MS', fontSize: '17px',fontWeight:'bold' }} htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" style={{ fontFamily: 'Trebuchet MS', borderRadius: '8px', width: '160px', height: '45px', fontSize: '16px', fontWeight: 'bold', marginTop: '15px'}} className="btn btn-primary btn-block mx-auto d-block">Change Password</button>
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

export default PasswordChange;
