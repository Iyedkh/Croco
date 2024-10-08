import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext, UserContext } from './Context';
import axios from 'axios';

function OneProduct(props) {
    const baseUrl = 'http://127.0.0.1:8000/';
    const { cartData, setCartData } = useContext(CartContext);
    const userContext = useContext(UserContext);
    const [cartButtonClickStatus, setCartButtonClickStatus] = useState(false);
    const [wishlistMessage, setWishlistMessage] = useState('');

    const cartAddButtonHandler = () => {
        const previousCart = localStorage.getItem('cartData');
        const cartJson = JSON.parse(previousCart) || [];
        const cartData = {
            product: {
                id: props.product.id,
                title: props.product.title,
                price: props.product.price,
                image: props.product.image,
            },
            quantity: 1,
            user: {
                id: 1,
            },
        };
        const updatedCartJson = [...cartJson, cartData];
        localStorage.setItem('cartData', JSON.stringify(updatedCartJson));
        setCartData(updatedCartJson);
        setCartButtonClickStatus(true);
    };

    function saveInWishList() {
        const buyerId = localStorage.getItem('buyer_id');

        if (!buyerId) {
            console.error('Buyer ID not found in localStorage');
            return;
        }

        const formData = new FormData();
        formData.append('Buyer', buyerId);
        formData.append('product', props.product.id);

        axios
            .post(baseUrl + '/Wishlist/', formData)
            .then(function (response) {
                setWishlistMessage('Product added to wishlist successfully');
                setTimeout(() => {
                    setWishlistMessage(''); // Clear the message after 3 seconds
                }, 3000);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return (
        <div className='col-12 col-md-4 col-sm-2 mb-4'>
            <div className="card" style={{ height: '100%' }}> {/* Fixed height */}
                <Link to={`/product/${props.product.slug}/${props.product.id}`} className="link-wrapper">
                    <img src={props.product.image} className="card-title" alt="..." />
                </Link>
                <div className="card-body-product d-flex flex-column align-items-center" style={{ padding:'8px', fontFamily: 'Impact', fontSize: '18px', color: 'black', textDecoration: 'none', flexGrow: 1 }}>
                    <h5 className="card-title">
                        <Link style={{ fontFamily: 'Impact', fontSize: '18px', color: 'black', textDecoration: 'none' }} to={`/product/${props.product.slug}/${props.product.id}`}>
                            {props.product.title}
                        </Link>
                    </h5>
                    <h5 className="card-title" style={{ fontFamily: 'Impact', color: '#1e517b' }}>Price: {props.product.price} DT</h5>
                  <div className='card-footer-product d-flex flex-column align-items-center '>
                    <button
                        title='Add to cart'
                        style={{
                            borderTop: '3px solid #0000',
                            padding: '10px 25px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '50px',  // Rounded corners
                            backgroundColor: '#1e1e1e',  // Dark background color
                            color: '#fff',  // White text color
                            border: 'none',
                            fontFamily: 'Impact',
                            fontSize: '15px',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease',
                            width: '100%', // Make it full width like the image
                            height: '50px'  // Ensure height similar to the image
                        }}
                        onClick={cartAddButtonHandler}
                    >
                        <i className="fa-solid fa-cart-plus" style={{ marginRight: '8px'}}></i>Add to Cart
                    </button>
                    
                </div>  
                </div>
                
                {wishlistMessage && (
                    <div className="alert alert-success mt-2" role="alert" style={{ fontFamily: 'Trebuchet MS', textAlign: 'center', borderRadius: '0' }}>
                        {wishlistMessage}
                    </div>
                )}
            </div>
        </div>
    );
}

export default OneProduct;
