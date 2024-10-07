import { Link } from 'react-router-dom';

function Orderfailure() {
    return (
        <section className="container mt-5">

                <div className="row">
                <div className="col-md-8 offset-2">
                <div className="card">
                <div className="card-body text-center">
                <p><i className="fa fa-times-circle text-danger fa-3x"></i></p>
                <h3 className="text-danger"style={{ fontFamily: 'Trebuchet MS', fontSize: '28px' }}>Something Went Wrong , Try again</h3>
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

export default Orderfailure;
