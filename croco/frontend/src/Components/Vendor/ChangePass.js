import VendorSidebar from './VendorSidebar';
import { useState } from 'react';
import axios from 'axios';

const baseUrl = 'http://127.0.0.1:8000/';

function ChangePass(props) {
    const [PasswordData, setPasswordData] = useState({
        'password': '',
        'c_password': '',
    });
    const [ConfirmError, setConfirmError] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const vendor_id = localStorage.getItem('vendor_id');

    const inputHandler = (event) => {
        setPasswordData({
            ...PasswordData,
            [event.target.name]: event.target.value,
        });
    };

    const submitHandler = (event) => {
        event.preventDefault();

        if (PasswordData.password === PasswordData.c_password) {
            setConfirmError(false);
            setErrorMsg('');

            const formData = new FormData();
            formData.append('password', PasswordData.password);

            // Submit Data
            axios.post(baseUrl + '/Vendor-Change-Password/' + vendor_id, formData)
                .then(function (response) {
                    console.log(response);
                    setSuccessMsg('Password successfully changed');
                    setTimeout(() => setSuccessMsg(''), 5000); // Clear the message after 5 seconds
                })
                .catch(function (error) {
                    console.log(error);
                    setErrorMsg('An error occurred while changing the password');
                });
        } else {
            setConfirmError(true);
            setErrorMsg('Passwords do not match. Please try again.');
        }
    };

    return (
        <section className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-3 col-12 mb-2">
                    <VendorSidebar />
                </div>
                <div className="col-md-9 col-12 mb-2">
                    <div className="card p-4" style={{ maxWidth: '700px' }}>
                        <h4 className="text-center" style={{ fontFamily: 'Trebuchet MS', fontSize: '27px', color: 'black', padding: '10px', fontWeight: 'bold' }}>Change Password</h4>
                        {successMsg && <p style={{ fontWeight: 'bold', fontSize: '17px', fontFamily: 'Trebuchet MS', textAlign: 'center' }} className="text-success">{successMsg}</p>}
                        {ConfirmError && <p style={{ fontWeight: 'bold', fontSize: '17px', fontFamily: 'Trebuchet MS', textAlign: 'center' }} className="text-danger">{errorMsg}</p>}
                        <div className="card-body">
                            <form onSubmit={submitHandler}>
                                <div className="mb-3">
                                    <label htmlFor="npwd" className="form-label">New Password</label>
                                    <input type="password" name='password' value={PasswordData.password} onChange={inputHandler} className="form-control" id="npwd" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="cpwd" className="form-label">Confirm Password</label>
                                    <input type="password" name='c_password' value={PasswordData.c_password} onChange={inputHandler} className="form-control" id="cpwd" />
                                </div>
                                <button type="submit" className="btn btn-primary d-block mx-auto" style={{ fontFamily: 'Trebuchet MS', borderRadius: '8px', width: '120px', height: '47px', fontSize: '16px', fontWeight: 'bold', marginTop: '15px'}}>Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ChangePass;
