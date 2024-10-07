import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import axios from 'axios';

function Wishlist() {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [wishlistMessage, setWishlistMessage] = useState('');

    useEffect(() => {
        fetchWishlistItems();
    }, []);
    
    const fetchWishlistItems = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const buyerId = localStorage.getItem('buyer_id'); // Assuming buyer ID is stored in localStorage
            console.log('Fetching wishlist for buyer ID:', buyerId);
            const response = await axios.get(`http://127.0.0.1:8000/Wishlist/?Buyer=${buyerId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Fetched wishlist items:', response.data.results);
            const wishlistWithDetails = await Promise.all(response.data.results.map(async (item) => {
                const productResponse = await axios.get(`http://127.0.0.1:8000/Product/${item.product}/`);
                return { ...item, product: productResponse.data };
            }));
            setWishlistItems(wishlistWithDetails);
        } catch (error) {
            console.error('Error fetching wishlist items:', error);
        }
    };

    const removeFromWishlist = async (itemId) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.delete(`http://127.0.0.1:8000/remove-from-wishlist/${itemId}/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.bool) {
                setWishlistMessage('Item successfully removed from wishlist');
                const updatedWishlistItems = wishlistItems.filter(item => item.id !== itemId);
                setWishlistItems(updatedWishlistItems);

                setTimeout(() => {
                    setWishlistMessage('');
                }, 3000);
            }
        } catch (error) {
            console.error('Error removing item from wishlist:', error);
        }
    };

    return (
        <section className='container mt-5' style={{ fontFamily: 'Trebuchet MS', fontSize: '16px' }}>
            <div className='row'>
                <div className='col-md-3 col-12 mb-2'>
                    <Sidebar/>
                </div>
                <div className='col-md-9 col-12 mb-2' style={{ marginTop: '10px' }}>
                    {wishlistMessage && (
                        <div className="alert alert-success" role="alert" style={{ fontWeight: 'bold', color: 'black' ,fontSize: '16px', padding: '10px 12px', margin: '10px auto', maxWidth: '400px', textAlign: 'center', fontFamily: 'Trebuchet MS' }}>
                            {wishlistMessage}
                        </div>
                    )}
                    <div className='row'>
                        <div className='table-responsive'>
                            <table className='table table-bordered table-hover' style={{ borderCollapse: 'separate', borderSpacing: '0 0px', marginTop: '-6px', fontFamily: 'Trebuchet MS' }}>
                                <thead>
                                    <tr>
                                        <th style={{ fontSize: '18px' ,padding: '15px', textAlign: 'center' }}>#</th>
                                        <th style={{ fontSize: '18px' ,padding: '15px', textAlign: 'center' }}>Product</th>
                                        <th style={{ fontSize: '18px' ,padding: '15px', textAlign: 'center' }}>Price</th>
                                        <th style={{ fontSize: '18px' ,padding: '15px', textAlign: 'center' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody style={{ color: 'black' }}>
                                    {wishlistItems.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" style={{ fontWeight: 'bold', color: 'black' ,fontSize: '16px', padding: '12px 12px', margin: '10px auto', maxWidth: '400px', textAlign: 'center', fontFamily: 'Trebuchet MS' }}>No existing items in the wishlist</td>
                                        </tr>
                                    ) : (
                                        wishlistItems.map((item, index) => (
                                            <tr key={index}>
                                                <td style={{ padding: '15px', textAlign: 'center' }}>{index + 1}</td>
                                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <img src={item.product.image} className="img-thumbnail" width="60" alt="Product" style={{ marginRight: '10px' }} />
                                                        <p style={{ margin: '0', textAlign: 'center' }}>
                                                            <Link to={`/product/${item.product.title}/${item.product.id}`} style={{ textDecoration: 'none', color: 'black' }}>{item.product.title}</Link>
                                                        </p>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '15px', textAlign: 'center' }}>{item.product.price}Dt</td>
                                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                                    <button onClick={() => removeFromWishlist(item.id)} className='btn btn-danger btn-sm' style={{ borderRadius: '5px', fontSize: '15px', padding: '7px 14px' }}>Remove</button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Wishlist;
