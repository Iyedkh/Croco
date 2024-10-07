import axios from 'axios';
import { useState } from 'react';
import './VendorLogin.css'; // Import your custom CSS file for styling
import { Link } from 'react-router-dom';

function VendorLogin(props) {
    const baseUrl = 'http://127.0.0.1:8000/';
    const [formError, setFormError] = useState(false);
    const [LoginFormData, setLoginFormData] = useState({
        "username": '',
        "password": ''
    });
    const [ErrorMsg, setErrorMsg] = useState('');

    const inputHandler = (event) => {
        setLoginFormData({
            ...LoginFormData,
            [event.target.name]: event.target.value
        });
    };

    const submitHandler = (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        // Submit DATA
        axios.post(baseUrl + 'Vendor/login/', LoginFormData, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                if (response.data.bool === false) {
                    setErrorMsg(response.data.msg);
                } else {
                    console.log(response.data);
                    localStorage.setItem('vendor_id', response.data.id);
                    localStorage.setItem('vendor_login', true);
                    localStorage.setItem('vendor_username', response.data.user);
                    setErrorMsg('');
                    // Redirect to dashboard after successful login
                    window.location.href = '/Vendor/Dashboard';
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const checkVendor = localStorage.getItem('vendor_login');
    if (checkVendor) {
        window.location.href = '/Vendor/Dashboard';
    }

    const buttonEnable = LoginFormData.username !== '' && LoginFormData.password !== '';

    return (
        <section className='container' style={{ marginTop: '80px' }}>
            <div className='row'>
                <div className='col-md-8 col-12 offset-md-2'>
                    <div className='card login-card'>
                        <div className='card-body'>
                          <div style={{ marginBottom: '5px' }}></div>
                            {ErrorMsg &&
                                <p style={{ fontFamily: 'Trebuchet MS', fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }} className="text-danger">{ErrorMsg}</p>
                            }
                            <img src="/log.png" alt="Image" className="img-fluid custom-img" />
                            <form className='custom-form' onSubmit={submitHandler}>
                                <div className="mb-3" style={{ marginTop: '-10px' }} >
                                    <label style={{ fontFamily: 'Trebuchet MS', fontSize: '15px', color: 'black' }} htmlFor="username" className="form-label">Username</label>
                                    <input type="text" onChange={inputHandler} name='username' value={LoginFormData.username} className="form-control" id="username" />
                                </div>
                                <div className="mb-3" style={{ marginTop: '-10px' }} >
                                    <label style={{ fontFamily: 'Trebuchet MS', fontSize: '15px', color: 'black' }} htmlFor="pwd" className="form-label">Password</label>
                                    <input type="password" onChange={inputHandler} name='password' value={LoginFormData.password} className="form-control" id="pwd" />
                                </div>
                                <button
                                    type="submit"
                                    disabled={!buttonEnable}
                                    className="btn btn-primary"
                                    style={{ fontFamily: 'Trebuchet MS', borderRadius: '8px', width: '105px', height: '45px', fontSize: '16px', fontWeight: 'bold', marginTop: '15px'}}>
                                    Submit
                                </button>
                                <Link to="/Buyer/PasswordReset" style={{ fontFamily: 'Trebuchet MS', fontSize: '15px', color: '#123499', textDecoration: 'none', display: 'block', marginTop: '10px' }}>Forgot Password?</Link>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default VendorLogin;
