import { Link } from 'react-router-dom';


function NewOrders(props) {
    return (
        <section className="container mt-4">
            <h3>Your Orders (4)</h3>
            <div className="table-responsive">
    <table className="table table-bordered table-hover" style={{  borderSpacing: '0 7px', marginTop: '-6px' }}>
        <thead>
            <tr>
                <th style={{ fontFamily: 'Arial, sans-serif', padding: '15px', textAlign: 'center' }}>#</th>
                <th style={{ fontFamily: 'Arial, sans-serif', padding: '15px', textAlign: 'center' }}>Product</th>
                <th style={{ fontFamily: 'Arial, sans-serif', padding: '15px', textAlign: 'center' }}>Price</th>
            </tr>
        </thead>
        <tbody style={{ fontFamily: 'Arial, sans-serif', fontSize: '15px', color: 'black' }}>
            <tr>
                <td style={{ padding: '15px', textAlign: 'center' }}>1</td>
                <td style={{ padding: '15px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src="/222.png" className="img-thumbnail" width="70" alt="Product" style={{ marginRight: '10px' }} />
                        <p style={{ margin: '0', textAlign: 'center' }}><Link to="/" style={{ textDecoration: 'none', color: 'black' }}>Product Name</Link></p>
                    </div>
                </td>
                <td style={{ padding: '15px', textAlign: 'center' }}>2,500Dt</td>
            </tr>
            <tr>
                <td style={{ padding: '15px', textAlign: 'center' }}>2</td>
                <td style={{ padding: '15px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src="/222.png" className="img-thumbnail" width="70" alt="Product" style={{ marginRight: '10px' }} />
                        <p style={{ margin: '0', textAlign: 'center' }}><Link to="/" style={{ textDecoration: 'none', color: 'black' }}>Product Name</Link></p>
                    </div>
                </td>
                <td style={{ padding: '15px', textAlign: 'center' }}>1,900Dt</td>
            </tr>
            <tr>
                <td style={{ padding: '15px', textAlign: 'center' }}>3</td>
                <td style={{ padding: '15px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src="/222.png" className="img-thumbnail" width="70" alt="Product" style={{ marginRight: '10px' }} />
                        <p style={{ margin: '0', textAlign: 'center' }}><Link to="/" style={{ textDecoration: 'none', color: 'black' }}>Product Name</Link></p>
                    </div>
                </td>
                <td style={{ padding: '15px', textAlign: 'center' }}>600Dt</td>
            </tr>
            <tr>
                <td style={{ padding: '15px', textAlign: 'center' }}>4</td>
                <td style={{ padding: '15px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src="/222.png" className="img-thumbnail" width="70" alt="Product" style={{ marginRight: '10px' }} />
                        <p style={{ margin: '0', textAlign: 'center' }}><Link to="/" style={{ textDecoration: 'none', color: 'black' }}>Product Name</Link></p>
                    </div>
                </td>
                <td style={{ padding: '15px', textAlign: 'center' }}>3,200Dt</td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <th></th>
                <th style={{ fontFamily: 'Arial, sans-serif', padding: '15px', textAlign: 'center' }}>Total</th>
                <th style={{ fontFamily: 'Arial, sans-serif', padding: '15px', textAlign: 'center' }}>8,200Dt</th>
            </tr>
            <tr>
    <td colSpan="3" align="center" style={{ backgroundColor: 'transparent' , border: 'transparent'}}>
        <Link to="/Categories" className="btn btn-dark ">Continue Shopping</Link>
        <Link to="/" className="btn btn-success ms-1">Proceed to Payment</Link>
    </td>
</tr>


        </tfoot>
    </table>
</div>

        </section>
    )
}

export default NewOrders;