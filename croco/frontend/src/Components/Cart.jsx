import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Cart.css'; // Import your custom CSS file for styling
import { CartContext } from './Context';
import Moving from './MovingBanner';

function Cart() {
    const { cartData, setCartData } = useContext(CartContext);
    
    useEffect(() => {
        if (cartData) {
            const updatedCartData = cartData.map(item => ({
                ...item,
                qty: item.qty || 1
            }));
            setCartData(updatedCartData);
        }
    }, [cartData, setCartData]);

    const cartRemoveButtonHandler = (product_id) => {
        const updatedCartData = cartData.filter(cart => cart.product.id !== product_id);
        localStorage.setItem('cartData', JSON.stringify(updatedCartData));
        setCartData(updatedCartData);
    };

    const incrementQuantity = (index) => {
        const newCartData = cartData.map((item, idx) => {
            if (idx === index) {
                return { ...item, qty: item.qty + 1 };
            }
            return item;
        });
        setCartData(newCartData);
        localStorage.setItem('cartData', JSON.stringify(newCartData));
    };

    const decrementQuantity = (index) => {
        const newCartData = cartData.map((item, idx) => {
            if (idx === index && item.qty > 1) {
                return { ...item, qty: item.qty - 1 };
            }
            return item;
        });
        setCartData(newCartData);
        localStorage.setItem('cartData', JSON.stringify(newCartData));
    };

    return (
        <div className="cart-container">
            <section className="cart-content">
                <Moving />
                <h3>Panier ({cartData ? cartData.length : 0}) Produits</h3>

                {cartData && cartData.length !== 0 ? (
                    <>
                        <div className="cart-table">
                            {cartData.map((item, index) => (
                                <div className="cart-item" key={index}>
                                    <div className="cart-item-details">
                                        <img src={item.product.image} alt={item.product.title} />
                                        <div className="cart-item-info">
                                            <h4>{item.product.title}</h4>
                                            <p>{parseFloat(item.product.price).toFixed(2)} DT</p>
                                        </div>
                                    </div>
                                    <div className="cart-quantity">
                                        <button onClick={() => decrementQuantity(index)}>-</button>
                                        <span>{item.qty}</span>
                                        <button onClick={() => incrementQuantity(index)}>+</button>
                                    </div>
                                    <div className="cart-price">
                                        <p>{(parseFloat(item.product.price) * item.qty).toFixed(2)} DT</p>
                                    </div>
                                    <div className="cart-remove">
                                        <button onClick={() => cartRemoveButtonHandler(item.product.id)}>
                                            <i className="fa fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="cart-summary">
                            <div className="summary-details">
                                <p> article :</p>
                                <p>{cartData.length}</p>
                            </div>
                            <div className="summary-total">
                                <p>Total TTC</p>
                                <p>{cartData.reduce((total, item) => total + parseFloat(item.product.price) * item.qty, 0).toFixed(2)} DT</p>
                            </div>
                            <Link to="/confirm-order" className="btn confirm-order">Commander</Link>
                        </div>
                    </>
                ) : (
                    <div className="empty-cart">
                        <Link to="/Products" className="btn start-shopping">Start Shopping</Link>
                    </div>
                )}
            </section>
        </div>
    );
}

export default Cart;
