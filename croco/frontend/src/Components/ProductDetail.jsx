import React, { useState, useEffect, useContext } from 'react';
import './ProductDetail.css';
import { Link, useParams, useLocation } from 'react-router-dom';
import OneRelatedProduct from './OneRelatedProduct';
import { UserContext, CartContext } from './Context';
import axios from 'axios';

function ProductDetail() {
    const baseUrl = 'http://127.0.0.1:8000/';
    const [productData, setProductData] = useState({});
    const [productImgs, setProductImgs] = useState([]);
    const [productTags, setProductTags] = useState([]);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const { Product_id } = useParams();
    const [cartButtonClickStatus, setCartButtonClickStatus] = useState(false);
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const { cartData, setCartData } = useContext(CartContext);
    const userContext = useContext(UserContext);
    const [wishlistMessage, setWishlistMessage] = useState('');
    const location = useLocation();

    useEffect(() => {
        fetchData(baseUrl + 'Product/' + Product_id + '/');
        fetchRelatedData(baseUrl + 'Related-Products/' + Product_id + '/');
        checkProductInCart(parseInt(Product_id));
    }, [Product_id]);

    useEffect(() => {
        const previousCart = localStorage.getItem('cartData');
        const cartJson = JSON.parse(previousCart);
        if (cartJson != null) {
            const isInCart = cartJson.some(cart => cart.product.id === parseInt(Product_id));
            setCartButtonClickStatus(isInCart);
        }
    }, [Product_id]);

    function checkProductInCart(product_id) {
        const previousCart = localStorage.getItem('cartData');
        const cartJson = JSON.parse(previousCart);
        if (cartJson != null) {
            cartJson.forEach((cart) => {
                if (cart != null && cart.product.id === product_id) {
                    setCartButtonClickStatus(true);
                }
            });
        }
    }

    async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Product Data:', data); // Debug log
            setProductData(data);
            setProductImgs(data.product_imgs || []);
            setProductTags(data.tag_list || []);
        } catch (error) {
            console.error('Error fetching product data:', error);
        }
    }

    async function fetchRelatedData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Related Products:', data); // Debug log
            setRelatedProducts(data.results || []);
        } catch (error) {
            console.error('Error fetching related products:', error);
        }
    }

    const tagsLinks = productTags.map((tag, index) => (
        <Link key={index} className='badge bg-secondary text-white me-1' to={`/products/${tag.trim()}`}>
            {tag.trim()}
        </Link>
    ));

    const cartAddButtonHandler = () => {
        const previousCart = localStorage.getItem('cartData');
        const cartJson = JSON.parse(previousCart) || [];
        const cartData = {
            product: {
                id: productData.id,
                title: productData.title,
                price: productData.price,
                image: productData.image,
            },
            quantity: selectedQuantity,
            user: {
                id: 1, // Assuming user ID is hardcoded or fetched from context
            },
        };
        const updatedCartJson = [...cartJson, cartData];
        localStorage.setItem('cartData', JSON.stringify(updatedCartJson));
        setCartData(updatedCartJson);
        setCartButtonClickStatus(true);
    };

    const cartRemoveButtonHandler = () => {
        const previousCart = localStorage.getItem('cartData');
        const cartJson = JSON.parse(previousCart) || [];
        const updatedCartJson = cartJson.filter(cart => cart.product.id !== productData.id);
        localStorage.setItem('cartData', JSON.stringify(updatedCartJson));
        setCartData(updatedCartJson);
        setCartButtonClickStatus(false);
    };

    function saveInWishList() {
        const buyerId = localStorage.getItem('buyer_id'); // Adjust according to your actual key

        if (!buyerId) {
            console.error('Buyer ID not found in localStorage');
            return;
        }

        const formData = new FormData();
        formData.append('Buyer', buyerId);
        formData.append('product', productData.id);

        axios
            .post(baseUrl + 'Wishlist/', formData)
            .then(function (response) {
                setWishlistMessage(
                    <div style={{ fontFamily: 'Impact', fontWeight: 'bold', textAlign: 'center', maxWidth: '300px', margin: '0 auto' }}>
                        Product added to wishlist successfully.
                    </div>
                );
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const { discount } = productData;

    const openDemoPage = () => {
        if (productData.demo_url) {
            window.open(productData.demo_url, '_blank');
        } else {
            alert('No demo link available for this product.');
        }
    };

    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [isZoomed, setIsZoomed] = useState(false);

    const handleMouseMove = (e, index) => {
        const { left, top, width, height } = e.target.getBoundingClientRect();
        const offsetX = (e.pageX - left) / width * 100;
        const offsetY = (e.pageY - top) / height * 100;
        setZoomPosition({ x: offsetX, y: offsetY });
        setIsZoomed(true);
    };

    const handleMouseLeave = () => {
        setIsZoomed(false);
    };

    return (
        <>
            <div style={{marginTop:'150px', display:'flex', justifyContent:'center'}}>
                 <section className="container ">
                            <div className="row" style={{ marginTop: '50px'}}>
                                <div className="col-4">
                                    <div id="productThumbnailSlider" className="carousel carousel-dark slide carousel-fade" data-bs-ride="true">
                                        <div className="carousel-indicators">
                                            {productImgs.map((img, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    data-bs-target="#productThumbnailSlider"
                                                    data-bs-slide-to={index}
                                                    className={index === 0 ? "active" : ""}
                                                    aria-current={index === 0 ? "true" : "false"}
                                                    aria-label={`Slide ${index + 1}`}
                                                    style={{ borderRadius: '5px', fontSize: '14px', fontWeight: 'bold' }}
                                                ></button>
                                            ))}
                                        </div>
                                        <div className="carousel-inner">
                                            {productImgs.map((img, index) => (
                                                <div
                                                    key={index}
                                                    className={index === 0 ? "carousel-item active" : "carousel-item"}
                                                    style={{
                                                        position: 'relative',
                                                        overflow: 'visible',
                                                        display: 'flex',
                                                        justifyContent: 'center', // Center content horizontally
                                                        alignItems: 'center', // Center content vertically
                                                    }}
                                                >
                                                    <div
                                                        className="img-container"
                                                        onMouseMove={(e) => handleMouseMove(e, index)}
                                                        onMouseLeave={handleMouseLeave}
                                                        style={{ position: 'relative' }}
                                                    >
                                                        <img
                                                            src={img.image}
                                                            className="img-thumbnail mb-5"
                                                            alt={`Slide ${index + 1}`}
                                                            style={{ width: "500px", height: "400px" }} // Set fixed width and height
                                                        />
                                                        {isZoomed && (
                                                            <div
                                                                className="zoom-overlay"
                                                                style={{
                                                                    position: 'absolute',
                                                                    top: '50%',
                                                                    left: '50%',
                                                                    transform: 'translate(-50%, -50%)',
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    backgroundImage: `url(${img.image})`,
                                                                    backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                                                                    backgroundSize: '300% 300%', // Adjust this for the zoom level
                                                                    zIndex: 100,
                                                                    pointerEvents: 'none',
                                                                    borderRadius: '10px',
                                                                    border: '1px solid #fff',
                                                                }}
                                                            ></div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <button className="carousel-control-prev image-control" type="button" data-bs-target="#productThumbnailSlider" data-bs-slide="prev" style={{ borderRadius: '5px', fontSize: '14px', width: '40px', height: '400px', margin: '0 -15px' }}>
                                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                            <span className="visually-hidden">Previous</span>
                                        </button>
                                        <button className="carousel-control-next image-control" type="button" data-bs-target="#productThumbnailSlider" data-bs-slide="next" style={{ borderRadius: '5px', fontSize: '14px', width: '40px', height: '400px', margin: '0 -15px' }}>
                                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                            <span className="visually-hidden">Next</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="col-8">
                <div style={{ marginLeft: '50px'}}>
                    <h3 style={{ fontFamily: 'Impact', fontSize: '40px', color: 'black',letterSpacing: '1.5px'}}>{productData.title}</h3>
                    <div style={{ marginBottom: '30px' }}></div>
                    <p style={{ fontFamily: 'Impact', fontSize: '23px', color: 'black' }}>{productData.detail}</p>
                    <div style={{ marginBottom: '60px' }}></div>
                    <h3 style={{ fontFamily: 'Impact', fontSize: '33px', color: 'black', display: 'inline-block',letterSpacing: '1.5px' }}>Prix: {productData.price}DT</h3>
                    <div style={{ marginBottom: '15px' }}></div>
                    <h5 style={{ 
                        fontFamily: 'Impact', 
                        fontSize: '17px', 
                        color: '#FFFFFF', 
                        display: 'inline-block', 
                        padding: '5px 10px', 
                        border: '2px solid #59abe3', 
                        borderRadius: '5px', 
                        backgroundColor: '#59abe3',
                        letterSpacing: '1.5px'
                    }}>
                        Pourcentage de réduction : {discount}%
                    </h5>

                    <div style={{ marginBottom: '5px'}}></div>
                    <p className='mt-3' style={{ marginLeft: '-7px'}}>
                        {!cartButtonClickStatus &&
                            <button style={{ fontFamily: 'Impact', borderRadius: '5px', padding: '8px 14px', fontSize: '14px',letterSpacing: '1.5px' }} className='btn btn-primary ms-2' title="Add to Cart" type='button' onClick={cartAddButtonHandler}>
                                <i className="fa-solid fa-cart-plus"></i> Ajouter au panier
                            </button>
                        }
                        {cartButtonClickStatus &&
                            <button style={{ fontFamily: 'Impact', borderRadius: '5px', padding: '7px 14px', fontSize: '14px',letterSpacing: '1.5px' }} className='btn btn-warning ms-2' title="Remove from Cart" type='button' onClick={cartRemoveButtonHandler}>
                                <i className="fa-solid fa-circle-minus"></i> supprimer du panier
                            </button>
                        }
                        {
                            userContext && !userContext.login ? (
                                <button onClick={saveInWishList} style={{ fontFamily: 'Impact', borderRadius: '5px', padding: '8px 14px', fontSize: '14px',letterSpacing: '1.5px', }} className='btn btn-danger ms-2' title="Add to Wishlist">
                                    <i className="fa fa-heart"></i> Ajouter à la liste des souhaits
                                </button>
                            ) : (
                                <button 
                                    style={{ fontFamily: 'Impact', borderRadius: '5px', padding: '8px 14px', fontSize: '14px'}} 
                                    className='btn btn-danger ms-2' 
                                    title="Add to Wishlist" 
                                    disabled={!userContext || !userContext.login}
                                >
                                    <i className="fa fa-heart"></i> Add to Wishlist
                                </button>
                            )}
                        <div style={{ fontFamily: 'Impact', display: 'inline-block', marginLeft: '90px', backgroundColor: '#e4f1fe', padding: '13px 15px', marginTop: '18px', borderRadius: '5px', fontSize: '14px',letterSpacing: '1.5px', }}>Available quantity: {productData.quantity}</div>
                    </p>
                    <div className='producttags mt-3'>
                        <h5 style={{ fontFamily: 'Impact', fontSize: '20px',letterSpacing: '1.5px', }}>Tags</h5>
                        <p style={{ fontFamily: 'Impact',letterSpacing: '1.5px'}} >
                            {tagsLinks}
                        </p>
                    </div>
                </div>
                </div>
                </div>

                {wishlistMessage && (
                <div className="alert alert-success" role="alert" style={{ padding: '15px 16px', margin: '10px auto', maxWidth: '400px', textAlign: 'center', borderRadius: '5px', fontSize: '14px' }}>
                {wishlistMessage}
                </div>
                )}

                {/* Related Products */}
                <h3 style={{ fontFamily: 'Impact', color: 'black', margin: '2rem 0 1.5rem', textAlign: 'center', letterSpacing: '1.5px' }}>
                    Related Products
                </h3>
                <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                    {/* Carousel Indicators */}
                    <div className="carousel-indicators">
                        {relatedProducts.reduce((acc, _, index) => {
                            if (index % 4 === 0) {
                                acc.push([]);
                            }
                            acc[acc.length - 1].push(index);
                            return acc;
                        }, []).map((group, groupIndex) => (
                            <button
                                key={groupIndex}
                                type="button"
                                data-bs-target="#carouselExampleIndicators"
                                data-bs-slide-to={groupIndex}
                                className={groupIndex === 0 ? "active" : ""}
                                aria-current={groupIndex === 0 ? "true" : "false"}
                                aria-label={`Slide ${groupIndex + 1}`}
                            />
                        ))}
                    </div>

                    {/* Carousel Inner */}
                    <div className="carousel-inner" style={{ marginTop: '80px' }}>
                        {relatedProducts.reduce((acc, product, index) => {
                            // Create a new slide every 4 products
                            if (index % 4 === 0) {
                                acc.push([]);
                            }
                            acc[acc.length - 1].push(
                                <div className="col" key={index} style={{ display: 'flex', justifyContent: 'center', padding: '0' }}>
                                    <div style={{ width: '250px', height: '350px', margin: '0px' }}> {/* Adjusted size */}
                                        <OneRelatedProduct product={product} />
                                    </div>
                                </div>
                            );
                            return acc;
                        }, []).map((productGroup, groupIndex) => (
                            <div className={groupIndex === 0 ? "carousel-item active" : "carousel-item"} key={groupIndex}>
                                <div className="row2" style={{ display: 'flex', justifyContent: 'center' }}>
                                    {productGroup}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Carousel Controls */}
                    <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide="prev"
                    style={{ marginTop: '-90px' }} // Adjust the value as needed
                >
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide="next"
                    style={{ marginTop: '-90px' }} // Adjust the value as needed
                >
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>

                </div>
                {/* End Related Products */}






                <div style={{ marginBottom: '120px' }}></div>
                        </section>
            </div>
               
        </>
        
);
}

export default ProductDetail;
