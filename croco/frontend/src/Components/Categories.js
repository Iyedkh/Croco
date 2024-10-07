import { Link } from 'react-router-dom';
import './Categories.css';
import { useState, useEffect } from 'react';

function Categories() {
    const baseUrl = 'http://127.0.0.1:8000/';
    const [categories, setCategories] = useState([]);
    const [totalResult, setTotalResults] = useState(0);

    useEffect(() => {
        fetchData(baseUrl + '/Categories/');
    }, []);

    function fetchData(baseUrl) {
        fetch(baseUrl)
            .then((response) => response.json())
            .then((data) => {
                setCategories(data.results);
                setTotalResults(data.count);
            });
    }

    function changeUrl(baseUrl) {
        fetchData(baseUrl);
    }

    var Links = [];
    var limit = 1;
    var totalLinks = totalResult / limit;
    for (let i = 1; i <= totalLinks; i++) {
        Links.push(
            <li className="page-item" key={i}>
                <Link onClick={() => changeUrl(baseUrl + `/Categories/?page=${i}`)} to={`/Categories/?page=${i}`} className="page-link">{i}</Link>
            </li>
        );
    }

    return (
        <section className="container" style={{ marginTop: '100px' }}>
            {/* categories */}
            <h3 className='mb-4' style={{ fontFamily: 'Impact', fontSize: '35px', color: 'white', textAlign: 'center'}}> Nos catégories </h3>
            <div className='row mb-2'>
                <div style={{ marginBottom: '33px' }}></div>
                {
                    categories.map((category) =>
                        <div className='col-12 col-md-3 mb-2' key={category.id}>
                            <div className="card card-hover">
                                <Link to={`/Category/${category.title}/${category.id}`} style={{ textDecoration: 'none' }}>
                                <img src={category.image} alt="Category" style={{ maxWidth: '160px', maxHeight: '120px', paddingTop: '20px' }} className="no-blend-mode" />
                                    <div className="card-body" style={{ fontFamily: 'Trebuchet MS', fontSize: '16px', textAlign: 'center' }}>
                                        <h5 className="card-title" style={{ fontSize: '18px', color: 'black', textDecoration: 'none' }}>{category.title}</h5>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    )
                }
            </div>
            {/* End categories */}
            <div className="pagination-container">
                <nav aria-label="Page navigation example">
                    <ul className="pagination">
                        {/* Pagination Links */}
                    </ul>
                </nav>
            </div>
        </section>
    )
}

export default Categories;
