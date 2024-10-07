import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import { Modal, Button, Alert } from 'react-bootstrap';

function Orders() {
    const [orderItems, setOrderItems] = useState([]);
    const [showModal, setShowModal] = useState(false); // State for modal visibility
    const [productToDelete, setProductToDelete] = useState(null); // State for product to delete
    const [showMessage, setShowMessage] = useState(false); // State for displaying message

    const buyerId = localStorage.getItem('buyer_id'); // Get buyer ID from localStorage

    useEffect(() => {
        if (buyerId) {
            fetchOrderItems(buyerId);
        }
    }, [buyerId]);

    const fetchOrderItems = async (buyerId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/Buyer/${buyerId}/orderitems/`);
            console.log('Order items:', response.data); // Log order items
            setOrderItems(response.data);
        } catch (error) {
            console.error('Error fetching order items:', error);
        }
    };

    const confirmDeleteProduct = (productId) => {
        setProductToDelete(productId);
        setShowModal(true);
    };

    const handleDeleteProduct = async () => {
        try {
            // Delete the product
            await axios.delete(`http://127.0.0.1:8000/delete-order-items/${productToDelete}/`);
            
            // Fetch updated order items
            await fetchOrderItems(buyerId);
            
            // Hide the modal
            setShowModal(false);

            // Show message
            setShowMessage(true);
            // Hide message after 2 seconds
            setTimeout(() => {
                setShowMessage(false);
            }, 2000);
        } catch (error) {
            console.error('Error removing product:', error);
        }
    };

    return (
        <section className='container mt-5'>
            {/* Confirmation Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title style={{ fontFamily: 'Trebuchet MS', fontSize: '27px', padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ fontFamily: 'Trebuchet MS', fontSize: '18px', padding: '10px', textAlign: 'center' }}>Are you sure you want to cancel this Order ?</Modal.Body>
                <Modal.Footer>
                    <Button style={{ fontFamily: 'Trebuchet MS', fontSize: '15px', textAlign: 'center' }} variant="secondary" onClick={() => setShowModal(false)}>
                        No
                    </Button>
                    <Button style={{ fontFamily: 'Trebuchet MS', fontSize: '15px', textAlign: 'center' }} variant="danger" onClick={handleDeleteProduct}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Notification */}
            {showMessage && 
                <Alert variant="success" onClose={() => setShowMessage(false)} dismissible style={{ position: 'absolute', top: '80px', left: '50%', transform: 'translateX(-50%)', zIndex: 999 }}>
                    Order is canceled
                </Alert>
            }


            {/* Orders */}
            <div className='row'>
                <div className='col-md-3 col-12 mb-2'>
                    <Sidebar />
                </div>
                <div className='col-md-9 col-12 mb-2' style={{ marginTop: '10px' }}>
                    <div className='row'>
                        <div className='table-responsive'>
                            <table className='table table-bordered table-hover' style={{ borderCollapse: 'separate', borderSpacing: '0 0px', marginTop: '-6px', fontFamily: 'Trebuchet MS' }}>
                                <thead>
                                    <tr>
                                        <th>Order_id</th>
                                        <th>Product</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                        <th>Actions</th> {/* Add this new column for Remove button */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderItems.map((orderItem, index) => (
                                        <tr key={index}>
                                            <td>{orderItem.id}</td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    {/* Log the product image URL */}
                                                    {console.log('Product Image URL:', orderItem.product_image)}
                                                    <img src={`http://127.0.0.1:8000${orderItem.product_image}`} alt={orderItem.product_title} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                                                    <span>{orderItem.product_title}</span>
                                                </div>
                                            </td>
                                            <td>{orderItem.qty}</td>
                                            <td>{orderItem.price}</td>
                                            <td>
                                                <button onClick={() => confirmDeleteProduct(orderItem.id)} className='btn btn-danger btn-sm ms-1' style={{ borderRadius: '5px', fontSize: '14px', padding: '7px 14px' }}>
                                                 Cancel order
                                                </button>
                                            </td>
                                        </tr>
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

export default Orders;
