import React, { useEffect, useState } from 'react';
import axios from 'axios';
import VendorSidebar from './VendorSidebar';

const baseUrl = 'http://127.0.0.1:8000/';

function AddProduct() {
    const vendor_id = localStorage.getItem('vendor_id');
    const [ErrorMsg, setErrorMsg] = useState('');
    const [SuccessMsg, setSuccessMsg] = useState('');
    const [CategoryData, setCategoryData] = useState([]);
    const [SubcategoryData, setSubcategoryData] = useState([]);
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

    const inputHandler = (event) => {
        const { name, value } = event.target;

        if (name === 'title') {
            const slugValue = value.toLowerCase().replace(/\s+/g, '-');
            setProductData({
                ...ProductData,
                [name]: value,
                'slug': slugValue
            });
        } else if (name === 'Subcategory') {
            setProductData({
                ...ProductData,
                'Subcategory': parseInt(value, 10)
            });
        } else if (name === 'Category') {
            const selectedCategory = CategoryData.find(cat => cat.id === parseInt(value, 10));
            setProductData({
                ...ProductData,
                'Category': value,
                'tags': selectedCategory ? selectedCategory.title : ''
            });
            fetchSubcategories(baseUrl + 'Subcategories/' + value + '/');
        } else {
            setProductData({
                ...ProductData,
                [name]: value
            });
        }
    };

    const fileHandler = (event) => {
        const files = event.target.files;
        if (event.target.name === 'mainImage') {
            setProductData({
                ...ProductData,
                'mainImage': files[0]
            });
        } else if (event.target.name === 'productImgs') {
            const updatedProductImgs = Array.isArray(ProductData.productImgs) ? [...ProductData.productImgs, ...files] : [...files];
            setProductData({
                ...ProductData,
                'productImgs': updatedProductImgs
            });
        }
    };

    const submitHandler = () => {
        if (!ProductData.Subcategory) {
            setErrorMsg('Please select a subcategory');
            setSuccessMsg('');
            return;
        }

        const formData = new FormData();
        formData.append('Vendor', vendor_id);
        formData.append('Category', ProductData.Category);
        formData.append('Subcategory', ProductData.Subcategory);
        formData.append('title', ProductData.title);
        formData.append('slug', ProductData.slug);
        formData.append('detail', ProductData.detail);
        formData.append('price', ProductData.price);
        formData.append('tags', ProductData.tags);
        formData.append('image', ProductData.mainImage);
        formData.append('demo_url', ProductData.demo_url);
        formData.append('quantity', ProductData.quantity);
        formData.append('discount', ProductData.discount);

        ProductData.productImgs.forEach((image) => {
            formData.append('productImgs', image);
        });

        axios.post(baseUrl + 'Products/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((response) => {
            if (response.status === 201) {
                setSuccessMsg('Product created successfully');
                setErrorMsg('');
                setProductData({
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
            }
        })
        .catch((error) => {
            console.log(error);
            setErrorMsg('Failed to create product');
            setSuccessMsg('');
        });
    };

    useEffect(() => {
        fetchData(baseUrl + 'Categories/');
    }, []);

    const fetchData = (url) => {
        axios.get(url)
            .then((response) => {
                setCategoryData(response.data.results);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const fetchSubcategories = (url) => {
        axios.get(url)
            .then((response) => {
                setSubcategoryData(response.data.results);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <section className="container mt-5">
            <div className="row">
                <div className="col-md-3 col-12 mb-2">
                    <VendorSidebar />
                </div>
                <div className="col-md-9 col-12 mb-2">
                    <div className="card p-4">
                        <h4 className="text-center" style={{ fontFamily: 'Trebuchet MS', fontSize: '28px', color: 'black', fontWeight: 'bold' }}>Add Product</h4>
                        <div className="card-body">
                            {SuccessMsg && <p style={{ fontFamily: 'Trebuchet MS', fontSize: '20px',textAlign: 'center',fontWeight: 'bold'}} className="text-success">{SuccessMsg}</p>}
                            {ErrorMsg && <p style={{ fontFamily: 'Trebuchet MS', fontSize: '20px',textAlign: 'center',fontWeight: 'bold'}} className="text-danger">{ErrorMsg}</p>}
                            <form>
                                <div className="mb-3">
                                    <label style={{ fontSize: '17px',fontWeight: 'bold'}} htmlFor="Category" className="form-label">Category</label>
                                    <select className='form-control' name='Category' onChange={inputHandler}>
                                        <option value="">-- Select Category --</option>
                                        {CategoryData.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label style={{ fontSize: '17px',fontWeight: 'bold'}} htmlFor="Subcategory" className="form-label">Subcategory</label>
                                    <select className='form-control' name='Subcategory' onChange={inputHandler}>
                                        <option value="">-- Select Subcategory --</option>
                                        {SubcategoryData.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label style={{ fontSize: '17px',fontWeight: 'bold'}} htmlFor="Title" className="form-label">Title</label>
                                    <input type="text" name="title" value={ProductData.title} onChange={inputHandler} className="form-control" id="Title" />
                                </div>
                                <div className="mb-3">
                                    <label style={{ fontSize: '17px',fontWeight: 'bold'}} htmlFor="Slug" className="form-label">Slug</label>
                                    <input type="text" name="slug" value={ProductData.slug} onChange={inputHandler} className="form-control" id="Slug" />
                                </div>
                                <div className="mb-3">
                                    <label style={{ fontSize: '17px',fontWeight: 'bold'}} htmlFor="Price" className="form-label">Price</label>
                                    <input type="number" name="price" value={ProductData.price} onChange={inputHandler} className="form-control" id="Price" />
                                </div>
                                <div className="mb-3">
                                    <label style={{ fontSize: '17px',fontWeight: 'bold'}} htmlFor="Detail" className="form-label">Detail</label>
                                    <textarea className="form-control" name="detail" value={ProductData.detail} onChange={inputHandler} id="Detail"></textarea>
                                </div>
                                <div className="mb-3">
                                    <label style={{ fontSize: '17px',fontWeight: 'bold'}} htmlFor="Tags" className="form-label">Tags</label>
                                    <textarea className="form-control" name="tags" value={ProductData.tags} onChange={inputHandler}></textarea>
                                </div>
                                <div className="mb-3">
                                    <label style={{ fontSize: '17px',fontWeight: 'bold'}} htmlFor="Quantity" className="form-label">Quantity</label>
                                    <input type="number" name="quantity" value={ProductData.quantity} onChange={inputHandler} className="form-control" id="Quantity" />
                                </div>
                                <div className="mb-3">
                                    <label style={{ fontSize: '17px',fontWeight: 'bold'}} htmlFor="Discount" className="form-label">Discount</label>
                                    <input type="number" name="discount" value={ProductData.discount} onChange={inputHandler} className="form-control" id="Discount" />
                                </div>
                                <div className="mb-3">
                                    <label style={{ fontSize: '17px',fontWeight: 'bold'}} htmlFor="mainImage" className="form-label">Main Image</label>
                                    <input type="file" name="mainImage" onChange={fileHandler} className="form-control" id="mainImage" />
                                </div>
                                <div className="mb-3">
                                    <label style={{ fontSize: '17px',fontWeight: 'bold'}} htmlFor="productImgs" className="form-label">Product Images</label>
                                    <input type="file" name="productImgs" onChange={fileHandler} className="form-control" id="productImgs" multiple />
                                </div>

                                <button  style={{ fontFamily: 'Trebuchet MS', borderRadius: '8px', width: '120px', height: '44px', fontSize: '16px', fontWeight: 'bold', marginTop: '15px'}} type="button" onClick={submitHandler} className="btn btn-primary d-block mx-auto">Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AddProduct;
