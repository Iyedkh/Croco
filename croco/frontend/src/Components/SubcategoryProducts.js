import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import OneProduct from './OneProduct';

function SubcategoryProducts() {
    const baseUrl = 'http://127.0.0.1:8000/';
    const { subcategoryId } = useParams();
    const [products, setProducts] = useState([]);
    const [totalResults, setTotalResults] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchData();
    }, [subcategoryId, currentPage]);

    const fetchData = () => {
        fetch(`${baseUrl}Subcategory/${subcategoryId}/products/?page=${currentPage}`)
            .then(response => response.json())
            .then(data => {
                setProducts(data.results);
                setTotalResults(data.count);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };

    const Limit = 10;
    const totalLinks = Math.ceil(totalResults / Limit);
    const paginationVisible = totalResults > Limit;

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const pageLinks = [];
    for (let i = 1; i <= totalLinks; i++) {
        pageLinks.push(
            <li className={`page-item ${currentPage === i ? 'active' : ''}`} key={i}>
                <Link to={`/Subcategory/${subcategoryId}/products?page=${i}`} className="page-link" onClick={() => handlePageClick(i)}>{i}</Link>
            </li>
        );
    }

    return (
        <section className="container mt-5 category-product-container">
            <h3 className='mb-4' style={{ fontFamily: 'Trebuchet MS', fontSize: '28px', color: 'black', fontWeight: 'bold' }}>Existing products </h3>
            <div style={{ marginBottom: '40px' }}></div>
            <div className='row mb-5'>
                {products.map(product => (
                    <OneProduct key={product.id} product={product} />
                ))}
            </div>

            {paginationVisible && (
                <div className="pagination-container">
                    <nav aria-label="Page navigation example">
                        <ul className="pagination">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <Link className="page-link" to={`/Subcategory/${subcategoryId}/products?page=${currentPage - 1}`} onClick={() => handlePageClick(currentPage - 1)} aria-label="Previous">
                                    <span aria-hidden="true">&laquo;</span>
                                </Link>
                            </li>
                            {pageLinks}
                            <li className={`page-item ${currentPage === totalLinks ? 'disabled' : ''}`}>
                                <Link className="page-link" to={`/Subcategory/${subcategoryId}/products?page=${currentPage + 1}`} onClick={() => handlePageClick(currentPage + 1)} aria-label="Next">
                                    <span aria-hidden="true">&raquo;</span>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}
        </section>
    );
}

export default SubcategoryProducts;
