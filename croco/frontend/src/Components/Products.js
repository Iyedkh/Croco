import { Link, useLocation } from 'react-router-dom';
import OneProduct from './OneProduct';
import { useState, useEffect } from 'react';

function Products(props) {
    const baseUrl = 'http://127.0.0.1:8000/';
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const page = queryParams.get('page') || 1;
        setCurrentPage(page);
        fetchData(baseUrl + `/Products/?page=${page}`);
    }, [location.search]);

    function fetchData(url) {
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setProducts(data.results); 
                setTotalPages(Math.ceil(data.count / data.results.length));
            });
    }
    
    function changePage(pageNumber) {
        setCurrentPage(pageNumber);
        fetchData(baseUrl + `/Products/?page=${pageNumber}`);
    }

    // Determine which page numbers to display (1 to 3)
    const pageNumbers = [];
    for (let i = 1; i <= 3; i++) {
        pageNumbers.push(i);
    }

    return (
        
        <section className="container category-product-container products-page" style={{ marginTop: '100px' }}>
            <h3 className='mb-4' style={{ fontFamily: 'Impact', fontSize: '35px', color: 'white', textAlign: 'center'}}> Nos Produits </h3>

            <div style={{ marginBottom: '60px' }}></div>

            <div className='row mb-4' style={{ fontFamily: 'Trebuchet MS', fontSize: '18px', color: 'black' }}>
                {
                   products.map((product) => <OneProduct key={product.id} product={product} currentPage={currentPage} />)
                }
            </div>

            {totalPages > 1 && (
                <nav aria-label="Page navigation example">
                    <ul className="pagination justify-content-center" >      
                        {pageNumbers.map((pageNumber) => (
                            <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                                <Link onClick={() => changePage(pageNumber)} to={`/Products/?page=${pageNumber}`} className="page-link">{pageNumber}</Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
            
        </section>
    );
}

export default Products;
