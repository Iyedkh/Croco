import { useState, useEffect } from 'react';
import VendorSidebar from './VendorSidebar';
import axios from 'axios';

const baseUrl = 'http://127.0.0.1:8000/';

function VendorProfile(props) {
    const [ProfileData, setProfileData] = useState({
        user_id: '',
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        mobile: '',
        profilepic: '',
        address: ''
    });

    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const vendor_id = localStorage.getItem('vendor_id');
    console.log(vendor_id);

    useEffect(() => {
        if (vendor_id) {
            fetchData(baseUrl + 'Vendor/' + vendor_id + '/');
        }
    }, [vendor_id]);

    const fetchData = (url) => {
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setProfileData({
                    user_id: data.user.id,
                    first_name: data.user.first_name,
                    last_name: data.user.last_name,
                    username: data.user.username,
                    email: data.user.email,
                    mobile: data.mobile,
                    address: data.address,
                    profilepic: data.profile_img ? `${baseUrl}${data.profile_img}` : ''
                });
                setImagePreviewUrl(data.profile_img ? `${baseUrl}${data.profile_img}` : '');
            });
    };

    const inputHandler = (event) => {
        setProfileData({
            ...ProfileData,
            [event.target.name]: event.target.value
        });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setProfileData({
            ...ProfileData,
            profilepic: file
        });
        setImagePreviewUrl(URL.createObjectURL(file));
    };

    const submitHandler = (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('user', ProfileData.user_id);
        formData.append('mobile', ProfileData.mobile);
        formData.append('address', ProfileData.address);
        formData.append('profile_img', ProfileData.profilepic);

        axios.put(baseUrl + 'Vendor/' + vendor_id + '/', formData, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        })
            .then((response) => {
                console.log(response);
                fetchData(baseUrl + 'Vendor/' + vendor_id + '/');
                setSuccessMsg('Profile successfully updated');
                setTimeout(() => setSuccessMsg(''), 5000);
            })
            .catch((error) => {
                console.log(error);
            });

        const formUserData = new FormData();
        formUserData.append('first_name', ProfileData.first_name);
        formUserData.append('last_name', ProfileData.last_name);
        formUserData.append('username', ProfileData.username);
        formUserData.append('email', ProfileData.email);

        axios.put(baseUrl + 'User/' + ProfileData.user_id + '/', formUserData)
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <section className="container mt-5">
            <div className="row">
                <div className="col-md-3 col-12 mb-2">
                    <VendorSidebar />
                </div>
                <div className="col-md-9 col-12 mb-2">
                <h3 style={{ fontFamily: 'Trebuchet MS', fontSize: '30px', color: 'black', fontWeight:'bold' }} className="mb-3">Welcome <span className="text-primary">{ProfileData.username}</span></h3>
                    <div className="card p-4">
                    <h4 className="text-center" style={{ fontFamily: 'Trebuchet MS', fontSize: '27px', color: 'black', fontWeight:'bold' }}>Update Profile</h4>
                        <div className="card-body">
                            {successMsg && <p style={{ fontWeight: 'bold', fontSize: '20px', fontFamily:'Trebuchet MS', textAlign:'center' }} className="text-success">{successMsg}</p>}
                            <form onSubmit={submitHandler}>
                                <div className="mb-3">
                                    <label htmlFor="firstname" className="form-label">First name</label>
                                    <input type="text" name='first_name' onChange={inputHandler} value={ProfileData.first_name} className="form-control" id="firstname" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="lastname" className="form-label">Last name</label>
                                    <input type="text" name='last_name' onChange={inputHandler} value={ProfileData.last_name} className="form-control" id="lastname" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">Username</label>
                                    <input type="text" name='username' onChange={inputHandler} value={ProfileData.username} className="form-control" id="username" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input type="email" name='email' onChange={inputHandler} value={ProfileData.email} className="form-control" id="email" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="Phone" className="form-label">Phone number</label>
                                    <input type="number" name='mobile' onChange={inputHandler} value={ProfileData.mobile} className="form-control" id="Phone" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="Address" className="form-label">Address</label>
                                    <textarea name='address' onChange={inputHandler} value={ProfileData.address} className="form-control" id="Address"></textarea>
                                </div>
                                <div className="mb-3">

                                    <label htmlFor="profilepic" className="form-label">Profile Picture</label>
                                    <input type="file" name='profilepic' onChange={handleFileChange} className="form-control" id="profilepic" />
                                </div>
                                <button type="submit" className="btn btn-primary d-block mx-auto" style={{ fontFamily: 'Trebuchet MS', borderRadius: '8px', width: '120px', height: '47px', fontSize: '16px', fontWeight: 'bold', marginTop: '15px'}}>
                                    Submit
                                </button>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default VendorProfile;
