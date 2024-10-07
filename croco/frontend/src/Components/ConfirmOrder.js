import { useContext, useEffect } from 'react';
import { UserContext } from './Context';
import { CartContext } from './Context';
import { Link } from 'react-router-dom';
import axios from 'axios';

const baseUrl = 'http://127.0.0.1:8000/';

function ConfirmOrder() {
    const userContext = useContext(UserContext);
    const { cartData, setCartData } = useContext(CartContext);

    useEffect(() => {
        if (userContext === null || userContext.login === null) {
            window.location.href = "/Buyer/Login";
        } else {
            addOrderInTable();
        }
    }, [userContext]);

    function addOrderInTable() {
        const buyerId = localStorage.getItem('buyer_id');
        const formData = new FormData();
        formData.append('Buyer', buyerId); 
    
        axios.post(baseUrl + 'Orders/', formData)
            .then(function (response) {
                const orderId = response.data.id;
                orderItems(orderId);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function orderItems(orderId) {
        const previousCart = localStorage.getItem('cartData');
        const cartJson = JSON.parse(previousCart);
    
        if (cartJson != null) {
            Promise.all(cartJson.map((cart, index) => {
                const formData = new FormData();
                formData.append('Order', orderId);  
                formData.append('Product', cart.product.id);  
                formData.append('qty', cart.qty || 1); // Use the quantity from the cart, default to 1 if not specified
                formData.append('price', cart.product.price);
    
                //Submit data
                return axios.post(baseUrl + 'OrderItems/', formData);
            }))
            .then(function (responses) {
                // All order items have been successfully submitted
                // Deduct quantity from available quantity and update in the backend
                updateProductQuantities(cartJson);
                // Clear cart data after confirming the order
                clearCartData();
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    }
    
    function updateProductQuantities(cartItems) {
        cartItems.forEach(cartItem => {
            const productId = cartItem.product.id;
            const selectedQuantity = cartItem.qty || 1; // Default to 1 if quantity is not specified
            // Fetch product data to get current available quantity
            axios.get(baseUrl + 'Product/' + productId)
                .then(response => {
                    const currentQuantity = response.data.quantity;
                    const newQuantity = currentQuantity - selectedQuantity;
                    // Update available quantity in the backend
                    axios.patch(baseUrl + 'Product/' + productId + '/', { quantity: newQuantity })
                        .then(response => {
                            console.log('Product quantity updated successfully');
                        })
                        .catch(error => {
                            console.error('Error updating product quantity:', error);
                        });
                })
                .catch(error => {
                    console.error('Error fetching product data:', error);
                });
        });
    }
    
    
    // Function to clear cart data
    function clearCartData() {
        console.log("Clearing cart data...");
        localStorage.removeItem('cartData');
        setCartData([]); // Clear cart data in context
        console.log("Cart data cleared.");
    }
    
    return (
        <section className="container" style={{ marginTop: '150px' }}>
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    <div className="card">
                        <div className="card-body text-center">
                            <p><i className="fa fa-check-circle text-success fa-3x"></i></p>
                            <div style={{ marginBottom: '25px' }}></div>
                            <h3 style={{ fontFamily: 'Trebuchet MS', fontSize: '28px', color: 'black',fontWeight:'bold' }}>Your Order has been confirmed!</h3>
                            <div style={{ marginBottom: '35px' }}></div>
                            <Link to="/" className="btn btn-secondary btn-sm" style={{ fontFamily: 'Trebuchet MS', borderRadius: '8px', width: '90px', fontSize: '16px', fontWeight: 'bold', marginTop: '15px',padding: '10px', textAlign: 'center', padding: '10px 20px' }} onClick={clearCartData}>Home</Link>
                            <Link to="/Products" className="btn btn-warning btn-sm ms-2" style={{ fontFamily: 'Trebuchet MS', borderRadius: '8px', width: '185px', fontSize: '16px', fontWeight: 'bold', marginTop: '15px',padding: '10px', textAlign: 'center', padding: '10px 20px' }} onClick={clearCartData}>Continue Shopping</Link>
                            <Link to="/Buyer/Dashboard" className="btn btn-success btn-sm ms-2" style={{ fontFamily: 'Trebuchet MS', borderRadius: '8px', width: '195px', fontSize: '16px', fontWeight: 'bold', marginTop: '15px',padding: '10px', textAlign: 'center', padding: '10px 20px' }} onClick={clearCartData}>Account</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ConfirmOrder;
