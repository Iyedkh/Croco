import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import VendorSidebar from './VendorSidebar';
import { useNotification } from '../NotificationContext'; // Import useNotification hook

const baseUrl = 'http://127.0.0.1:8000/';

function VendorOrders() {
    const [orders, setOrders] = useState([]);
    const [orderItems, setOrderItems] = useState([]);
    const [vendorProducts, setVendorProducts] = useState([]);
    const [filteredOrderItems, setFilteredOrderItems] = useState([]);
    const [buyers, setBuyers] = useState({});
    const [validatedOrders, setValidatedOrders] = useState(() => {
        // Initialize from localStorage or as empty object if not found
        const localStorageValidatedOrders = localStorage.getItem('validatedOrders');
        return localStorageValidatedOrders ? JSON.parse(localStorageValidatedOrders) : {};
    });
    const { addNotification } = useNotification(); // Access addNotification function from context

    const vendorId = localStorage.getItem('vendor_id');

    useEffect(() => {
        if (vendorId) {
            // Fetch all products related to the current vendor
            axios.get(`${baseUrl}Products/?Vendor=${vendorId}`)
                .then(response => {
                    console.log('Vendor Products:', response.data.results);
                    setVendorProducts(response.data.results);
                })
                .catch(error => {
                    console.error('Error fetching vendor products:', error);
                });

            // Fetch all order items
            axios.get(`${baseUrl}OrderItems/`)
                .then(response => {
                    console.log('Order Items:', response.data.results);
                    setOrderItems(response.data.results);
                })
                .catch(error => {
                    console.error('Error fetching order items:', error);
                });

            // Fetch all orders
            axios.get(`${baseUrl}Orders/`)
                .then(response => {
                    console.log('Orders:', response.data.results);
                    setOrders(response.data.results);
                })
                .catch(error => {
                    console.error('Error fetching orders:', error);
                });

            // Fetch all buyers
            axios.get(`${baseUrl}Buyers/`)
                .then(response => {
                    console.log('Buyers:', response.data.results);
                    const buyersMap = {};
                    response.data.results.forEach(buyer => {
                        buyersMap[buyer.id] = buyer.user.username;
                    });
                    setBuyers(buyersMap);
                })
                .catch(error => {
                    console.error('Error fetching buyers:', error);
                });
        }
    }, [vendorId]);

    useEffect(() => {
        // Filter order items based on vendor products
        const filteredItems = orderItems.filter(item =>
            vendorProducts.some(product => product.id === item.Product && product.Vendor === parseInt(vendorId))
        );
        console.log('Filtered Items:', filteredItems);
        setFilteredOrderItems(filteredItems);
    }, [orderItems, vendorProducts, vendorId]);

    useEffect(() => {
        // Update localStorage whenever validatedOrders changes
        localStorage.setItem('validatedOrders', JSON.stringify(validatedOrders));
    }, [validatedOrders]);

    function calculateTotalRows(items) {
        let total = 0;
        items.forEach(item => {
            total += item.tag_list ? item.tag_list.length : 1; // Check if tag_list exists
        });
        return total;
    }

    const handleValidateOrder = (orderId) => {
        // Toggle order validation status
        setValidatedOrders(prevState => ({
            ...prevState,
            [orderId]: !prevState[orderId]
        }));

        // Send notification to buyer
        const order = orders.find(order => order.id === orderId);
        const buyerId = order.Buyer;

        // Example notification message including order ID
        const notificationMessage = `Order with the ID: ${orderId} has been validated by the vendor.`;

        // Add notification to buyer's dashboard
        addNotification({ recipient: buyerId, message: notificationMessage });
    };

    const rowCount = calculateTotalRows(filteredOrderItems);

    return (
        <section className='container mt-5'>
            <div className='row'>
                <div className='col-md-3 col-12 mb-2'>
                    <VendorSidebar />
                </div>
                <div className='col-md-9 col-12 mb-2'>
                    <div className='row'>
                        <div className='col-12'>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='table-responsive'>
                            <table className='table table-bordered table-hover' style={{ borderCollapse: 'separate', borderSpacing: '0 0px', marginTop: '-6px' }}>
                                <thead>
                                    <tr>
                                        <th style={{ fontFamily: 'Trebuchet MS', fontSize: '17px', padding: '15px', textAlign: 'center' }}>Order ID</th>
                                        <th style={{ fontFamily: 'Trebuchet MS', fontSize: '17px', padding: '15px', textAlign: 'center' }}>Buyer</th>
                                        <th style={{ fontFamily: 'Trebuchet MS', fontSize: '17px', padding: '15px', textAlign: 'center' }}>Product</th>
                                        <th style={{ fontFamily: 'Trebuchet MS', fontSize: '17px', padding: '15px', textAlign: 'center' }}>Price</th>
                                        <th style={{ fontFamily: 'Trebuchet MS', fontSize: '17px', padding: '15px', textAlign: 'center' }}>Quantity</th>
                                        <th style={{ fontFamily: 'Trebuchet MS', fontSize: '17px', padding: '15px', textAlign: 'center' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody style={{ fontFamily: 'Trebuchet MS', fontSize: '15px', color: 'black' }}>
                                    {orders.map(order => (
                                        filteredOrderItems
                                            .filter(item => item.Order === order.id)
                                            .map((item, index) => (
                                                <tr key={`${order.id}-${index}`}>
                                                    <td style={{ padding: '15px', textAlign: 'center' }}>{order.id}</td>
                                                    <td style={{ padding: '15px', textAlign: 'center' }}>{buyers[order.Buyer]}</td>
                                                    <td style={{ padding: '15px', textAlign: 'center' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <img src={item.product_image} className="img-thumbnail" width="60" alt="Product" style={{ marginRight: '10px' }} />
                                                            <p style={{ margin: '0', textAlign: 'center' }}>
                                                                <Link to="/" style={{ textDecoration: 'none', color: 'black' }}>{item.product_title}</Link>
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '15px', textAlign: 'center' }}>{item.price} Dt</td>
                                                    <td style={{ padding: '15px', textAlign: 'center' }}>{item.qty}</td>
                                                    <td style={{ padding: '15px', textAlign: 'center' }}>
                                                        <div>
                                                            <button
                                                                className={`btn btn-sm ${validatedOrders[order.id] ? 'btn-secondary' : 'btn-info'}`}
                                                                type="button"
                                                                style={{ borderRadius: '5px', padding: '6px 12px', fontSize: '14px', fontWeight: 'bold' }}
                                                                onClick={() => handleValidateOrder(order.id)}
                                                                disabled={validatedOrders[order.id]} // Disable button if already validated
                                                            >
                                                                {validatedOrders[order.id] ? 'Order Validated' : 'Validate Order'}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default VendorOrders;
