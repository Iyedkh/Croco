import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Modal, Button, Alert } from 'react-bootstrap';
import VendorSidebar from './VendorSidebar';

const baseUrl = 'http://127.0.0.1:8000/';

function VendorProducts() {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const vendorId = localStorage.getItem('vendor_id');
        if (vendorId) {
            fetchData(`${baseUrl}Products/`, vendorId);
        }
    }, []);

    function fetchData(url, vendorId) {
        axios.get(url, {
            params: {
                vendor: vendorId
            }
        })
        .then((response) => {
            const vendorProducts = response.data.results.filter(product => product.Vendor === Number(vendorId));
            setProducts(vendorProducts);
        })
        .catch((error) => {
            console.error('Error fetching products:', error);
        });
    }

    function handleViewProduct(slug, productId) {
        window.location.href = `/product/${slug}/${productId}`;
    }

    function handleEditProduct(product) {
        navigate(`/Vendor/EditProduct/${product.id}`, { state: { product } });
    }
    
    function confirmDeleteProduct(productId) {
        setProductToDelete(productId);
        setShowModal(true);
    }

    function handleDeleteProduct() {
        const vendorId = localStorage.getItem('vendor_id');
        axios.delete(`${baseUrl}Product/${productToDelete}/`, {
            data: { vendor: vendorId }
        })
        .then((response) => {
            fetchData(`${baseUrl}Products/`, vendorId);
            setShowModal(false);
            setSuccessMessage('Product deleted successfully');
            setTimeout(() => setSuccessMessage(''), 3000); // Clear the message after 3 seconds
        })
        .catch((error) => {
            console.error('Error deleting product:', error);
        });
    }

    return (
        <section className='container mt-5'>
            <div className='row'>
                <div className='col-md-3 col-12 mb-2'>
                    <VendorSidebar/>
                </div>
                <div className='col-md-9 col-12 mb-2'>
                    {successMessage && (
                        <Alert variant="success">
                            {successMessage}
                        </Alert>
                    )}
                    <div className='row'>
                        <div className='table-responsive'>
                            <table className='table table-bordered table-hover' style={{ borderCollapse: 'separate', borderSpacing: '0 0px', marginTop: '-6px' }}>
                                <thead>
                                <tr>
                                    <td colSpan="5" align="right" style={{ backgroundColor: 'transparent', border: 'transparent' }}>
                                        <Link to="/Vendor/AddProduct" className='btn btn-dark mb-2 float-end' style={{ borderRadius: '5px', padding: '8px 16px', fontSize: '14px', fontWeight: 'bold'}}>
                                            <i className='fa fa-plus-circle me-2'></i> Add Product
                                        </Link>
                                    </td>
                                </tr>



                                    <tr>
                                        <th style={{ fontFamily: 'Trebuchet MS',fontSize: '17px', padding: '10px', textAlign: 'center' }}>id</th>
                                        <th style={{ fontFamily: 'Trebuchet MS',fontSize: '17', padding: '10px', textAlign: 'center' }}>Product</th>
                                        <th style={{ fontFamily: 'Trebuchet MS',fontSize: '17px',padding: '10px', textAlign: 'center' }}>Price</th>
                                        <th style={{ fontFamily: 'Trebuchet MS',fontSize: '17px', padding: '10px', textAlign: 'center' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody style={{ fontFamily: 'Trebuchet MS', fontSize: '13px', color: 'black' }}>
                                    {products.map((product, index) => (
                                        <tr key={index}>
                                            <td style={{ fontFamily: 'Trebuchet MS',fontSize: '15px', padding: '10px', textAlign: 'center' }}>{product.id}</td>
                                            <td style={{ fontFamily: 'Trebuchet MS',fontSize: '15px', padding: '10px', textAlign: 'center', verticalAlign: 'middle' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <img src={product.image} alt={product.title} style={{ maxWidth: '60px', maxHeight: '60px', marginRight: '10px' }} />
                                                    <p>{product.title}</p>
                                                </div>
                                            </td>
                                            <td style={{ fontFamily: 'Trebuchet MS',fontSize: '15px', padding: '10px', textAlign: 'center' }}>{product.price} DT</td>
                                            <td style={{ padding: '10px', textAlign: 'center' }}>
                                                <button style={{ borderRadius: '5px', padding: '6px 14px', fontSize: '14px', fontWeight: 'bold'}}
                                                    className="btn btn-primary me-2"
                                                    onClick={() => handleViewProduct(product.slug, product.id)}
                                                >
                                                    View
                                                </button>
                                                <button style={{ borderRadius: '5px', padding: '6px 14px', fontSize: '14px', fontWeight: 'bold' }}
                                                    className="btn btn-warning me-2"
                                                    onClick={() => handleEditProduct(product)}
                                                >
                                                    Edit
                                                </button>
                                                <button style={{ borderRadius: '5px', padding: '6px 14px', fontSize: '14px', fontWeight: 'bold' }}
                                                    className="btn btn-danger"
                                                    onClick={() => confirmDeleteProduct(product.id)}
                                                >
                                                    Delete
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

            <Modal className="custom-modal" show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title style={{ fontFamily: 'Trebuchet MS', fontSize: '27px', padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ fontFamily: 'Trebuchet MS', fontSize: '18px', padding: '10px', textAlign: 'center' }}>Are you sure you want to delete this product?</Modal.Body>
                <Modal.Footer>
                    <Button style={{ fontFamily: 'Trebuchet MS', fontSize: '15px', textAlign: 'center' }} variant="secondary" onClick={() => setShowModal(false)}>
                        No
                    </Button>
                    <Button style={{ fontFamily: 'Trebuchet MS', fontSize: '15px', textAlign: 'center' }} variant="danger" onClick={handleDeleteProduct}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>

        </section>
    );
}

export default VendorProducts;
