import axios from 'axios';
import { useState } from "react";
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

function Login(props) {
    const baseUrl = 'http://127.0.0.1:8000/';
    const [formError, setFormError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [loginFormData, setLoginFormData] = useState({
        "username": '',
        "password": ''
    });

    const inputHandler = (event) => {
        setLoginFormData({
            ...loginFormData,
            [event.target.name]: event.target.value
        });
    };

    const submitHandler = (event) => {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData();
        formData.append('username', loginFormData.username);
        formData.append('password', loginFormData.password);

        // Submit DATA
        axios.post(baseUrl + '/Buyer/login/', formData)
            .then(function (response) {
                if (response.data.bool === false) {
                    setFormError(true);
                    setErrorMsg(response.data.msg);
                } else {
                    console.log(response.data);
                    localStorage.setItem('buyer_id', response.data.id);
                    localStorage.setItem('buyer_login', true);
                    localStorage.setItem('buyer_username', response.data.user);
                    setFormError(false);
                    setErrorMsg('');
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const checkBuyer = localStorage.getItem('buyer_login');
    if (checkBuyer) {
        window.location.href = '/Buyer/Dashboard';
    }

    const buttonEnable = loginFormData.username !== '' && loginFormData.password !== '';

    return (
        <section className='container' style={{ marginTop: '80px' }}>
            <div className='row'>
                <div className='col-md-8 col-12 offset-md-2'>
                    <div className='card login-card'>
                        <div className='card-body'>
                            <div style={{ marginBottom: '5px' }}></div>
                            {formError &&
                                <p style={{ fontFamily: 'Trebuchet MS', fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }} className="text-danger">{errorMsg}</p>
                            }
                            <img src="/log.png" alt="Image" className="img-fluid custom-img" />
                            <form className='custom-form' onSubmit={submitHandler}>
                                <div className="mb-3" style={{ marginTop: '-10px' }}>
                                    <label style={{ fontFamily: 'Trebuchet MS', fontSize: '15px', color: 'black' }} htmlFor="username" className="form-label">Username</label>
                                    <input style={{ fontFamily: 'Trebuchet MS' }} type="text" name="username" value={loginFormData.username} onChange={inputHandler} className="form-control" id="username" />
                                </div>
                                <div className="mb-3" style={{ marginTop: '-10px' }}>
                                    <label style={{ fontFamily: 'Trebuchet MS', fontSize: '15px', color: 'black' }} htmlFor="pwd" className="form-label">Password</label>
                                    <input type="password" name="password" value={loginFormData.password} onChange={inputHandler} className="form-control" id="pwd" />
                                </div>
                                <button
                                    type="submit"
                                    disabled={!buttonEnable}
                                    className="btn btn-primary"
                                    style={{ fontFamily: 'Trebuchet MS', borderRadius: '8px', width: '105px', height: '45px', fontSize: '16px', fontWeight: 'bold', marginTop: '15px'}}
                                >
                                    Submit
                                </button>
                                <Link to="/Buyer/PasswordReset" style={{ fontFamily: 'Trebuchet MS', fontSize: '15px', color: '#123499', textDecoration: 'none', display: 'block', marginTop: '10px' }}>Forgot Password?</Link>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Login;
