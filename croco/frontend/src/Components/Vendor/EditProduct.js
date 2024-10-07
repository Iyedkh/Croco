import React, { useEffect, useState } from 'react';
import axios from 'axios';
import VendorSidebar from './VendorSidebar';
import { useParams, useNavigate } from 'react-router-dom';

const baseUrl = 'http://127.0.0.1:8000/';

function EditProduct() {
    const vendor_id = localStorage.getItem('vendor_id');
    const { id } = useParams();
    const navigate = useNavigate();

    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [categoryData, setCategoryData] = useState([]);
    const [subcategoryData, setSubcategoryData] = useState([]);
    const [ProductData, setProductData] = useState({
        'Category': '',
        'Subcategory': '',
        'Vendor': vendor_id,
        'title': '',
        'slug': '',
        'detail': '',
        'price': '',
        'tags': '',
        'mainImage': '',
        'demo_url': '',
        'quantity': '',
        'productImgs': [],
        'discount': ''
    });

    useEffect(() => {
        axios.get(`${baseUrl}Categories/`)
            .then((response) => {
                setCategoryData(response.data.results);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    useEffect(() => {
        if (ProductData.Category) {
            axios.get(`${baseUrl}Subcategories/${ProductData.Category}/`)
                .then((response) => {
                    setSubcategoryData(response.data.results);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [ProductData.Category]);

    useEffect(() => {
        axios.get(`${baseUrl}Product/${id}/`)
            .then((response) => {
                setProductData(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [id]);

    const inputHandler = (event) => {
        const { name, value } = event.target;

        if (name === 'Category') {
            const selectedCategory = categoryData.find(category => category.id === parseInt(value));
            console.log('Selected Category:', selectedCategory);

            setProductData({
                ...ProductData,
                [name]: value,
                'tags': selectedCategory ? selectedCategory.title : ''
            });
        } else if (name === 'Subcategory') {
            setProductData({
                ...ProductData,
                'Subcategory': parseInt(value, 10)
            });
        } else {
            setProductData({
                ...ProductData,
                [name]: value
            });
        }
    }

    const fileHandler = (event) => {
        const files = event.target.files;
        if (event.target.name === 'mainImage') {
            setProductData({
                ...ProductData,
                'mainImage': files[0]
            });
        } else if (event.target.name === 'productImgs') {
            setProductData({
                ...ProductData,
                'productImgs': [...files]
            });
        }
    }

    const submitHandler = () => {
        if (!ProductData.Subcategory) {
            setErrorMsg('Please select a subcategory');
            setSuccessMsg('');
            return;
        }

        const formData = new FormData();
        formData.append('Vendor', vendor_id);
        formData.append('Category', ProductData.Category);
        formData.append('subcategory', ProductData.Subcategory);
        formData.append('title', ProductData.title);
        formData.append('slug', ProductData.slug);
        formData.append('detail', ProductData.detail);
        formData.append('price', ProductData.price);
        formData.append('tags', ProductData.tags);
        formData.append('image', ProductData.mainImage);
        formData.append('demo_url', ProductData.demo_url || '');
        formData.append('quantity', ProductData.quantity);
        formData.append('discount', ProductData.discount);
        
        ProductData.productImgs.forEach((image) => {
            formData.append('productImgs', image);
        });

        // Include the flag to delete images
        formData.append('deleteImages', 'true');

        axios.put(`${baseUrl}Product/${id}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((response) => {
            if (response.status === 200) {
                setSuccessMsg('Product updated successfully');
                setErrorMsg('');
                navigate(`/Vendor/EditProduct/${id}`);
            }
        })
        .catch((error) => {
            console.log(error);
            setErrorMsg('Failed to update product');
            setSuccessMsg('');
        });
    }

    return (
        <section className="container mt-5">
            <div className="row">
                <div className="col-md-3 col-12 mb-2">
                    <VendorSidebar />
                </div>
                <div className="col-md-9 col-12 mb-2">
                    <div className="card p-4" style={{ borderRadius: '0px' }}>
                        <h4 className="text-center" style={{ fontFamily: 'Trebuchet MS', fontSize: '28px', color: 'black', fontWeight: 'bold' }}>Edit Product</h4>
                        <div className="card-body">
                            {successMsg && <p style={{ fontFamily: 'Trebuchet MS', fontSize: '19px', textAlign: 'center', fontWeight: 'bold' }} className="text-success">{successMsg}</p>}
                            {errorMsg && <p style={{ fontFamily: 'Trebuchet MS', fontSize: '19px', textAlign: 'center', fontWeight: 'bold' }} className="text-danger">{errorMsg}</p>}
                            <form>
                                <div className="mb-3">
                                    <label style={{ fontSize: '17px', fontWeight: 'bold' }} htmlFor="Category" className="form-label">Category</label>
                                    <select className='form-control' name='Category' value={ProductData.Category} onChange={inputHandler}>
                                        <option value="">-- Select Category --</option>
                                        {categoryData.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label style={{ fontSize: '17px', fontWeight: 'bold' }} htmlFor="Subcategory" className="form-label">Subcategory</label>
                                    <select className='form-control' name='Subcategory' value={ProductData.Subcategory} onChange={inputHandler}>
                                        <option value="">-- Select Subcategory --</option>
                                        {subcategoryData.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label style={{ fontSize: '17px', fontWeight: 'bold' }} htmlFor="Title" className="form-label">Title</label>
                                    <input type="text" name="title" value={ProductData.title} onChange={inputHandler} className="form-control" id="Title" />
                                </div>
                                <div className="mb-3">
                                    <label style={{ fontSize: '17px', fontWeight: 'bold' }} htmlFor="Slug" className="form-label">Slug</label>
                                    <input type="text" name="slug" value={ProductData.slug} onChange={inputHandler} className="form-control" id="Slug" />
                                </div>
                                <div className="mb-3">
                                    <label style={{ fontSize: '17px', fontWeight: 'bold' }} htmlFor="Price" className="form-label">Price</label>
                                    <input type="number" name="price" value={ProductData.price} onChange={inputHandler} className="form-control" id="Price" />
                                </div>
                                <div className="mb-3">
                                    <label style={{ fontSize: '17px', fontWeight: 'bold' }} htmlFor="Detail" className="form-label">Detail</label>
                                    <textarea className="form-control" name="detail" value={ProductData.detail} onChange={inputHandler} id="Detail"></textarea>
                                </div>
                                <div className="mb-3">
                                    <label style={{ fontSize: '17px', fontWeight: 'bold' }} htmlFor="Tags" className="form-label">Tags</label>
                                    <textarea className="form-control" name="tags" value={ProductData.tags} onChange={inputHandler} id="Tags"></textarea>
                                </div>
                                <div className="mb-3">
                                    <label style={{ fontSize: '17px', fontWeight: 'bold' }} htmlFor="Demo_URL" className="form-label">Demo URL</label>
                                    <input type="url" name="demo_url" value={ProductData.demo_url} onChange={inputHandler} className="form-control" id="Demo_URL" />
                                </div>
                                <div className="mb-3">
                                    <label style={{ fontSize: '17px', fontWeight: 'bold' }} htmlFor="Quantity" className="form-label">Quantity</label>
                                    <input type="number" name="quantity" value={ProductData.quantity} onChange={inputHandler} className="form-control" id="Quantity" />
                                </div>
                                <div className="mb-3">
                                    <label style={{ fontSize: '17px', fontWeight: 'bold' }} htmlFor="Discount" className="form-label">Discount Percentage</label>
                                    <input type="text" name="discount" value={ProductData.discount} onChange={inputHandler} className="form-control" id="Discount" />
                                </div>
                                <div className="mb-3">
                                    <label style={{ fontSize: '17px', fontWeight: 'bold' }} htmlFor="mainImage" className="form-label">Main Product Image</label>
                                    <input type="file" name='mainImage' className="form-control" onChange={fileHandler} id="mainImage" />
                                </div>
                                <div className="mb-3">
                                    <label style={{ fontSize: '17px', fontWeight: 'bold' }} htmlFor="productImgs" className="form-label">Product Images</label>
                                    <input type="file" name='productImgs' multiple className="form-control" onChange={fileHandler} id="productImgs" />
                                    <div>
                                        {Array.isArray(ProductData.productImgs) && ProductData.productImgs.map((image, index) => (
                                            <img key={index} src={URL.createObjectURL(image)} alt={`Product Image ${index + 1}`} style={{ maxWidth: '100px', maxHeight: '100px', marginRight: '10px', marginBottom: '10px' }} />
                                        ))}
                                    </div>
                                </div>

                                <button type="button" onClick={submitHandler} className="btn btn-primary d-block mx-auto" style={{ fontFamily: 'Trebuchet MS', borderRadius: '8px', width: '120px', height: '44px', fontSize: '16px', fontWeight: 'bold', marginTop: '15px'}}>Save</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default EditProduct;
