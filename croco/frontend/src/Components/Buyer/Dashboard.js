import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNotification } from '../NotificationContext'; // Import useNotification hook

function Dashboard(props) {
    const [wishlistCount, setWishlistCount] = useState(0);
    const [orderCount, setOrderCount] = useState(0);
    const [wishlistByCategory, setWishlistByCategory] = useState({});
    const [categories, setCategories] = useState([]);
    const [categoriesData, setCategoriesData] = useState([]);
    const { notifications, clearNotifications } = useNotification();
    const [buyerName, setBuyerName] = useState('');
    const [buyerProfileImageUrl, setBuyerProfileImageUrl] = useState('');

    useEffect(() => {
        fetchBuyerData();
        fetchWishlistCount();
        fetchOrderCount();
        fetchCategories();
    }, []);

    const fetchBuyerData = async () => {
        try {
            const buyerId = localStorage.getItem('buyer_id'); // Fetch buyer ID from local storage or authentication context
            const response = await axios.get(`http://127.0.0.1:8000/Buyer/${buyerId}/`);
            setBuyerName(response.data.user.username);
            setBuyerProfileImageUrl(response.data.profile_img);
        } catch (error) {
            console.error('Error fetching buyer data:', error);
        }
    };

    const fetchWishlistCount = async () => {
        try {
            const buyerId = localStorage.getItem('buyer_id');
            const response = await axios.get(`http://127.0.0.1:8000/Wishlist/?Buyer=${buyerId}`);
            setWishlistCount(response.data.results.length);
        } catch (error) {
            console.error('Error fetching wishlist count:', error);
        }
    };

    const fetchOrderCount = async () => {
        try {
            const buyerId = localStorage.getItem('buyer_id');
            const response = await axios.get(`http://127.0.0.1:8000/Buyer/${buyerId}/orderitems/`);
            setOrderCount(response.data.length);
        } catch (error) {
            console.error('Error fetching order count:', error);
        }
    };

    const fetchWishlistByCategory = async (categoriesData) => {
        try {
            const buyerId = localStorage.getItem('buyer_id');
            const response = await axios.get(`http://127.0.0.1:8000/Wishlist/?Buyer=${buyerId}`);

            const wishlistItems = response.data.results;
            const categories = {};

            wishlistItems.forEach(item => {
                const categoryId = item.product.subcategory;
                const parentCategory = categoriesData.find(category => category.subcategories.some(subcategory => subcategory.id === categoryId));
                if (parentCategory) {
                    if (categories[parentCategory.id]) {
                        categories[parentCategory.id]++;
                    } else {
                        categories[parentCategory.id] = 1;
                    }
                }
            });

            setWishlistByCategory(categories);
        } catch (error) {
            console.error('Error fetching wishlist by category:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/Categories/');
            setCategories(response.data.results);
            setCategoriesData(response.data.results);
            fetchWishlistByCategory(response.data.results);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleClearNotifications = () => {
        clearNotifications();
    };

    const handleProceedToPayment = () => {
        console.log('Proceeding to payment...');
    };

    return (
        <section className='container mt-5'>
            <div className='row'>
                <div className='col-md-3 col-12 mb-2'>
                    <Sidebar />
                </div>
                <div className='col-md-9 col-12 mb-2'>
                    <div className='row'>
                        <div className='col-md-12 mb-2'>
                            <ToastContainer
                                position="top-right"
                                autoClose={3000}
                                hideProgressBar={false}
                                newestOnTop
                                closeOnClick
                                rtl={false}
                                pauseOnFocusLoss
                                draggable
                                pauseOnHover
                            />
                        </div>
                        <div className='col-md-12 mb-2'>
                            <div className='card1' style={{ marginTop: '-20px' }}>
                                <div className='card-body d-flex align-items-center justify-content-start' style={{ fontFamily: 'Trebuchet MS', fontWeight: 'bold', color: '#000000' }}>
                                    <h4 className='card-title mb-0' style={{ fontFamily: 'Trebuchet MS', fontSize: '18px', fontWeight: 'bold', marginLeft: '730px' }}>Welcome {buyerName}</h4>
                                    {buyerProfileImageUrl && (
                                        <img src={buyerProfileImageUrl} alt="Buyer Profile" className="img-fluid rounded-circle" style={{ height: '48px', width: '48px', marginLeft: '10px' }} />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div style={{ marginBottom: '40px' }}></div>
                        <div className='col-md-6 mb-2'>
                            <div className='card shadow-sm' style={{ backgroundColor: '#ffffff' }}>
                                <div className='card-body text-center' style={{ fontFamily: 'Trebuchet MS', fontWeight: 'bold', color: '#000000' }}>
                                    <h5 style={{ fontWeight: 'bold' }}>Total Orders</h5>
                                    <a href="http://localhost:3000/Buyer/Orders" style={{ textDecoration: 'none', color: '#284387' }}>
                                        <p className='card-text' style={{ color: '#284387', fontSize: '20px' }}>{orderCount}</p>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-6 mb-2'>
                            <div className='card shadow-sm' style={{ backgroundColor: '#ffffff' }}>
                                <div className='card-body text-center' style={{ fontFamily: 'Trebuchet MS', fontWeight: 'bold', color: '#000000' }}>
                                    <h5 style={{ fontWeight: 'bold' }}>Total Wishlist</h5>
                                    <a href="http://localhost:3000/Buyer/Wishlist" style={{ textDecoration: 'none', color: '#284387' }}>
                                        <p className='card-text' style={{ color: '#284387', fontSize: '20px' }}>{wishlistCount}</p>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-12 mt-4'>
                            <div className='card shadow-sm' style={{ backgroundColor: '#ffffff' }}>
                                <div className='card-body'>
                                    <h4 className='card-title mb-3' style={{ fontFamily: 'Trebuchet MS', fontSize: '20px', fontWeight: 'bold' }}>Notifications</h4>
                                    <ul className='list-group'>
                                        {notifications.map((notification, index) => (
                                            <li style={{ fontFamily: 'Trebuchet MS', fontSize: '16px' }} key={index} className='list-group-item'>
                                                {notification.message}
                                            </li>
                                        ))}
                                    </ul>
                                    {notifications.length > 0 && (
                                        <div className="mt-3">
                                            <button style={{ borderRadius: '5px', padding: '6px 14px', fontSize: '14px', fontWeight: 'bold' }} className='btn btn-success' onClick={handleProceedToPayment}>
                                                Proceed to Payment
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Dashboard;
