import { Link } from 'react-router-dom';

function Ordersuccess() {
    return (
        <section className="container mt-5">

                <div className="row">
                <div className="col-md-8 offset-2">
                <div className="card">
                <div className="card-body text-center">
                <p><i className="fa fa-check-circle text-success fa-3x"></i></p>
                <h3 className="text-success"style={{ fontFamily: 'Trebuchet MS', fontSize: '28px' }}>Thank you for your Order !</h3>
                <div style={{ marginBottom: '30px' }}></div>
                <Link to="/" className="btn btn-secondary btn-sm" style={{ borderRadius: '30px', fontSize: '13px', padding: '10px 20px' }}>Home</Link>
                <Link to="/Buyer/Dashboard" className="btn btn-dark btn-sm ms-1" style={{ borderRadius: '30px', fontSize: '13px', padding: '10px 20px' }}>Dashboard</Link>
                </div>
                </div>
                </div>
                </div>

        </section>
    )
}

export default Ordersuccess;
