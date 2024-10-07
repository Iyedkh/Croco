import { Link } from 'react-router-dom';
import OneProduct from './OneProduct';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function TagProducts(props) {
    const baseUrl = 'http://127.0.0.1:8000/';
    const [products, setProducts] = useState([]);
    const [totalResult, setTotalResults] = useState(0);
    const {tag} = useParams();
    

    useEffect(() => {
        fetchData(baseUrl + '/Products/'+tag);
    }, []);

    function fetchData(baseUrl) {
        fetch(baseUrl)
            .then((response) => response.json())
            .then((data) => {
                setProducts(data.results); 
                setTotalResults(data.count);
            });
    }
    
    function changeUrl(baseUrl) {
        fetchData(baseUrl);
    }

    var links = [];
    var limit = 1;
    var totalLinks = totalResult/limit ;
    
    for (let i = 1; i <= totalLinks; i++) {

        links.push(
            <li className="page-item" >
                <Link onClick={() => changeUrl(baseUrl + `/Products/${tag}/?page=${i}`)} to={`/Products/${tag}/?page=${i}`} className="page-link">{i}</Link>
            </li>
        );
    }

    return (
        <section className="container mt-4 category-product-container">
            <h3 className='mb-4' style={{ fontFamily: 'Trebuchet MS', fontSize: '28px', color: 'black' }}> All Products 
            <a href='#' className='float-end btn btn-sm btn-secondary mb-2'> View all products <i className="fa-solid fa-circle-chevron-right pr-" style={{ marginLeft: '4px' }}></i></a></h3>

            <div className='row mb-4'>
                {

                   products.map((product) => <OneProduct product={product} />)
                   
                }
            </div>

            <div className="pagination-container">
                <nav aria-label="Page navigation example">
                    <ul className="pagination">
                        <li className="page-item">
                            <a className="page-link" href="#" aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                            </a>
                        </li>
                        {links} 
                        <li className="page-item">
                            <a className="page-link" href="#" aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </section>
    );
}

export default TagProducts;