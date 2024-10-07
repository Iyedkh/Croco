import { useState } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Register.css'; // Import your custom CSS file for styling

function Register(props) {
    const baseUrl = 'http://127.0.0.1:8000/';
    const [formError, setFormError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [registerFormData, setRegisterFormData] = useState({
        "first_name": '',
        "last_name": '',
        "username": '',
        "email": '',
        "password": '',
        "mobile": '',
        "address": '',
        "companyName": ''  // Add companyName here
    });

    const inputHandler = (event) => {
        setRegisterFormData({
            ...registerFormData,
            [event.target.name]: event.target.value
        });
    };

    const submitHandler = (event) => {
        const formData = new FormData();
        formData.append('first_name', registerFormData.first_name);
        formData.append('last_name', registerFormData.last_name);
        formData.append('username', registerFormData.username);
        formData.append('email', registerFormData.email);
        formData.append('password', registerFormData.password);
        formData.append('mobile', registerFormData.mobile);
        formData.append('address', registerFormData.address);
        formData.append('companyName', registerFormData.companyName);  // Add companyName here

        // Submit DATA
        axios.post(baseUrl + 'Buyer/Register/', formData)
            .then(function (response) {
                if (response.data.bool === false) {
                    setFormError(true);
                    setErrorMsg(response.data.msg);
                } else {
                    setRegisterFormData({
                        "first_name": '',
                        "last_name": '',
                        "username": '',
                        "email": '',
                        "password": '',
                        "mobile": '',
                        "address": '',
                        "companyName": ''  // Reset companyName here
                    });
                    setFormError(false);
                    setSuccessMsg(response.data.msg);
                }
            })
            .catch(function (error) {
                if (error.response && error.response.status === 400) {
                    if (error.response.data.username) {
                        setErrorMsg('Username already exists');
                    } else {
                        setErrorMsg('An error occurred. Please try again.');
                    }
                } else {
                    console.error('Error:', error);
                    setErrorMsg('An error occurred. Please try again.');
                }
                setFormError(true);
            });
    };

    const buttonEnable = registerFormData.first_name !== '' && 
        registerFormData.last_name !== '' && 
        registerFormData.username !== '' && 
        registerFormData.password !== '' && 
        registerFormData.email !== '' && 
        registerFormData.mobile !== '' && 
        registerFormData.address !== '' && 
        registerFormData.companyName !== ''; 

    return (
        <section className='container mt-5'>
            <div className='row'>
                <div className='col-md-8 col-12 offset-md-2'>
                    <div className='card register-card1'>
                        <div className='card-body'>
                            <img src="/reg.png" alt="Image" className="img-fluid custom-img" />
                            <form className='custom-form'>
                            <p className="text-muted" style={{ fontFamily: 'Trebuchet MS', fontSize: '14px', fontWeight: 'bold', color: '#000000' }}>
                                    <strong className="text-danger" style={{ fontFamily: 'Trebuchet MS', fontSize: '14px' }}> Note:</strong> All fields are required</p>
                                {successMsg && <p style={{ fontWeight: 'bold', fontFamily: 'Trebuchet MS' }} className="text-success" >{successMsg}</p>}
                                {formError && <p style={{ fontWeight: 'bold', fontFamily: 'Trebuchet MS' }} className="text-danger">{errorMsg}</p>}
                                <div className="mb-3">
                                    <label style={{ fontFamily: 'Trebuchet MS' }} htmlFor="firstname" className="form-label">First name</label>
                                    <input type="text" onChange={inputHandler} value={registerFormData.first_name} name="first_name" className="form-control" id="firstname" />
                                </div>
                                <div className="mb-3">
                                    <label style={{ fontFamily: 'Trebuchet MS' }} htmlFor="lastname" className="form-label">Last name</label>
                                    <input type="text" onChange={inputHandler} value={registerFormData.last_name} name="last_name" className="form-control" id="lastname" />
                                </div>
                                <div className="mb-3">
                                    <label style={{ fontFamily: 'Trebuchet MS' }} htmlFor="username" className="form-label">Username</label>
                                    <input type="text" onChange={inputHandler} value={registerFormData.username} name="username" className="form-control" id="username" />
                                </div>
                                <div className="mb-3">
                                    <label style={{ fontFamily: 'Trebuchet MS' }} htmlFor="email" className="form-label">Email</label>
                                    <input type="email" onChange={inputHandler} value={registerFormData.email} name="email" className="form-control" id="email" />
                                </div>
                                <div className="mb-3">
                                    <label style={{ fontFamily: 'Trebuchet MS' }} htmlFor="pwd" className="form-label">Password</label>
                                    <input type="password" onChange={inputHandler} value={registerFormData.password} name="password" className="form-control" id="pwd" />
                                </div>
                                <div className="mb-3">
                                    <label style={{ fontFamily: 'Trebuchet MS' }} htmlFor="companyName" className="form-label">Company Name</label>
                                    <input type="text" onChange={inputHandler} value={registerFormData.companyName} name="companyName" className="form-control" id="companyName"/>
                                </div>    
                                <div className="mb-3">
                                    <label style={{ fontFamily: 'Trebuchet MS' }} htmlFor="mobile" className="form-label">Mobile</label>
                                    <input type="text" onChange={inputHandler} value={registerFormData.mobile} name="mobile" className="form-control" id="mobile" />
                                </div>
                                <div className="mb-3">
                                    <label style={{ fontFamily: 'Trebuchet MS' }} htmlFor="address" className="form-label">Address</label>
                                    <input type="text" onChange={inputHandler} value={registerFormData.address} name="address" className="form-control" id="address" />  {/* Remplacement de companyName par address */}
                                </div>
                                <button type="button" disabled={!buttonEnable} onClick={submitHandler} className="btn btn-primary" style={{ fontFamily: 'Trebuchet MS', borderRadius: '8px', width: '105px', height: '45px', fontSize: '16px', fontWeight: 'bold', marginTop: '15px'}}>Submit</button>
                                <div style={{ marginTop: '20px' }}>
                                    <Link to="/Buyer/Login" style={{ fontFamily: 'Trebuchet MS', fontSize: '14px', color: '#123499', textDecoration: 'none', display: 'inline-block' }}>Have an account? Login</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Register;
