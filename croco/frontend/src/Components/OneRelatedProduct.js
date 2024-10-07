import { Link } from 'react-router-dom';

function OneRelatedProduct(props) {
    const { product, cartAddButtonHandler, addToWishlistHandler } = props; // Destructure product and handlers from props

    return (
        <div className='row justify-content-center'>
            <div className='col-12 col-md-12 col-sm-5 mb-4'>
                <div className="card">
                    <Link to={`/product/${product.slug}/${product.id}`} style={{ textDecoration: 'none', color: 'black' }}>
                        <img src={product.image} className='card-title' alt="..." />
                    </Link>
                    <div className="card-body" style={{ fontFamily: 'Trebuchet MS', fontSize: '16px', color: 'black' }}>
                        <h5 className="card-title">
                            <Link to={`/product/${product.slug}/${product.id}`} style={{ textDecoration: 'none', color: 'black' }}>{product.title}</Link>
                        </h5>
                        <h6 className="card-title text-muted">Price: {product.price}</h6>
                    </div>
                    <div className='card-footer' style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <button
                            title='Add to cart'
                            className='btn btn-success btn-sm'
                            style={{ flex: '1', marginRight: '5px', borderRadius: '0px' }} // Adjust the margin as needed
                            onClick={() => cartAddButtonHandler(product)}
                        >
                            <i className="fa-solid fa-cart-plus"></i>
                        </button>
                        <button
                            title='Add to wishlist'
                            className='btn btn-warning btn-sm'
                            style={{ flex: '1', marginLeft: '5px', borderRadius: '0px' }} // Adjust the margin as needed
                            onClick={() => addToWishlistHandler(product)}
                        >
                            <i className="fa-solid fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OneRelatedProduct;
