import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Cart.css'; // Import your custom CSS file for styling
import { CartContext } from './Context';
import Moving from './MovingBanner';
function Cart(props) {
    const { cartData, setCartData } = useContext(CartContext);
    const [cartButtonClickStatus, setCartButtonClickStatus] = useState(false);

    useEffect(() => {
        // Ensure each item in cartData has a 'qty' property initialized
        if (cartData) {
            const updatedCartData = cartData.map(item => ({
                ...item,
                qty: item.qty || 1 // Default quantity to 1 if not provided
            }));
            setCartData(updatedCartData);
        }
    }, [cartData]); // Add cartData to the dependency array to trigger useEffect on cartData change

    const cartRemoveButtonHandler = (product_id) => {
        if (cartData) {
            const updatedCartData = cartData.filter(cart => cart.product.id !== product_id);
            localStorage.setItem('cartData', JSON.stringify(updatedCartData));
            setCartData(updatedCartData);
        }
    };

    const incrementQuantity = (index) => {
        if (cartData) {
            const newCartData = cartData.map((item, idx) => {
                if (idx === index) {
                    return {
                        ...item,
                        qty: item.qty + 1
                    };
                }
                return item;
            });
            setCartData(newCartData);
            localStorage.setItem('cartData', JSON.stringify(newCartData)); // Update localStorage
        }
    };
    
    const decrementQuantity = (index) => {
        if (cartData) {
            const newCartData = cartData.map((item, idx) => {
                if (idx === index && item.qty > 1) {
                    return {
                        ...item,
                        qty: item.qty - 1
                    };
                }
                return item;
            });
            setCartData(newCartData);
            localStorage.setItem('cartData', JSON.stringify(newCartData)); // Update localStorage
        }
    };
    

    return (
        
        <section className='container' style={{ marginTop: '60px' }}>
            <Moving></Moving>
            <h3 style={{ fontFamily: 'Trebuchet MS', fontSize: '28px', padding: '15px', textAlign: 'center', fontWeight: 'bold' }}>
                Your Cart ({cartData ? cartData.length : 0})
            </h3>
    
            <div style={{ marginBottom: '40px' }}></div>
    
            {cartData && cartData.length !== 0 &&
                <div className="table-responsive" style={{ width: '80%', marginLeft: '10%', marginRight: '10%' }}>
                    <table className="table table-bordered table-hover" style={{ borderSpacing: '0', borderCollapse: 'collapse', marginTop: '-6px' }}>
                        <thead>
                            <tr>
                                <th style={{ fontFamily: 'Trebuchet MS', fontSize: '18px', padding: '15px', textAlign: 'center', border: '1px solid #ddd' }}>N°</th>
                                <th style={{ fontFamily: 'Trebuchet MS', fontSize: '18px', padding: '15px', textAlign: 'center', border: '1px solid #ddd' }}>Product</th>
                                <th style={{ fontFamily: 'Trebuchet MS', fontSize: '18px', padding: '15px', textAlign: 'center', border: '1px solid #ddd' }}>Quantity</th>
                                <th style={{ fontFamily: 'Trebuchet MS', fontSize: '18px', padding: '15px', textAlign: 'center', border: '1px solid #ddd' }}>Price</th>
                                <th style={{ fontFamily: 'Trebuchet MS', fontSize: '18px', padding: '15px', textAlign: 'center', border: '1px solid #ddd' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody style={{ fontFamily: 'Trebuchet MS', fontSize: '15px', color: 'black' }}>
                            {cartData.map((item, index) => (
                                <tr key={index}>
                                    <td style={{ padding: '15px', textAlign: 'center', border: '1px solid #ddd' }}>{index + 1}</td>
                                    <td style={{ padding: '15px', textAlign: 'center', border: '1px solid #ddd' }}>
                                        <div className="product-image-container">
                                            <img src={item.product.image} className="img-thumbail" alt={item.product.title} />
                                        </div>
                                        <p style={{ margin: '0', textAlign: 'center' }}><Link to="/" style={{ textDecoration: 'none', color: 'black' }}>{item.product.title}</Link></p>
                                    </td>
                                    <td style={{ padding: '15px', textAlign: 'center', border: '1px solid #ddd' }}>
                                        <button className='btn btn-secondary me-2 btn-sm' style={{ borderRadius: '0' }} onClick={() => decrementQuantity(index)}>-</button>
                                        {item.qty}
                                        <button className='btn btn-secondary ms-2 btn-sm' style={{ borderRadius: '0' }} onClick={() => incrementQuantity(index)}>+</button>
                                    </td>

                                    <td style={{ fontSize: '17px', padding: '15px', textAlign: 'center', border: '1px solid #ddd' }}>{(parseFloat(item.product.price) * item.qty).toFixed(2)} Dt</td>
                                    <td style={{ padding: '15px', textAlign: 'center', position: 'relative', border: '1px solid #ddd' }}>
                                        <button style={{ fontFamily: 'Trebuchet MS', borderRadius: '8px', width: '185px', fontSize: '16px', fontWeight: 'bold', marginTop: '15px', padding: '10px', textAlign: 'center' }} className='btn btn-danger ms-2' title="Remove from Cart" type='button' onClick={() => cartRemoveButtonHandler(item.product.id)}>
                                            <i className="fa-solid fa-circle-minus"></i> Remove from Cart
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot style={{ borderTop: 'none' }}>
                            <tr>
                                <th></th>
                                <th></th>
                                <th style={{ fontFamily: 'Trebuchet MS', fontSize: '18px', padding: '15px', textAlign: 'center', border: '1px solid #ddd' }}>Total</th>
                                <th style={{ fontFamily: 'Trebuchet MS', fontSize: '18px', padding: '15px', textAlign: 'center', border: '1px solid #ddd' }}>
                                    {cartData.reduce((total, item) => total + parseFloat(item.product.price) * item.qty, 0).toFixed(2)} Dt
                                </th>
                                <th style={{ border: '1px solid #ddd' }}></th>
                            </tr>
                            <tr>
                                <td colSpan="5" align="center" style={{ backgroundColor: 'transparent', border: 'none' }}>
                                    <Link to="/Categories" className="btn btn-dark" style={{ fontFamily: 'Trebuchet MS', borderRadius: '8px', width: '175px', fontSize: '16px', fontWeight: 'bold', marginTop: '15px' }}>Continue Shopping</Link>
                                    <Link to="/confirm-order" className="btn btn-success ms-1" style={{ fontFamily: 'Trebuchet MS', borderRadius: '8px', width: '175px', fontSize: '16px', fontWeight: 'bold', marginTop: '15px' }}>Confirm your order</Link>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            }
    
            {cartData && cartData.length === 0 && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Link to="/Products" style={{ fontFamily: 'Trebuchet MS', padding: '10px', textAlign: 'center' }} className='btn btn-warning'>
                        <i className="fa-solid fa-basket-shopping"></i> Start Shopping
                    </Link>
                </div>
            )}
        </section>
    );    
}

export default Cart;
