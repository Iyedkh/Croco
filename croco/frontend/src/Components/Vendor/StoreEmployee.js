

import { Link } from 'react-router-dom';
import VendorSidebar from './VendorSidebar';

function StoreEmployee(props) {
    return (
        <section className='container mt-4'>
            <div className='row'>
                <div className='col-md-3 col-12 mb-2'>
                          <VendorSidebar/>
                </div>
                <div className='col-md-9 col-12 mb-2'>
                    <div className='row'>


                    <div className='table-responsive'>
    <table className='table table-bordered table-hover' style={{ borderCollapse: 'separate', borderSpacing: '0 7px', marginTop: '-6px' }}>
        <thead>
            <tr>
                    <td colspan="10" align="right" style={{ backgroundColor: 'transparent' , border: 'transparent'}}>
                       <Link to="/Vendor/AddEmployee" className='btn btn-dark mb-2 float-end'><i className='fa fa-plus-circle'></i> Add Store Employee</Link>
                    </td>
            </tr>
            <tr>
                <th style={{ fontFamily: 'Trebuchet MS', padding: '15px', textAlign: 'center' }}>#</th>
                <th style={{ fontFamily: 'Trebuchet MS', padding: '15px', textAlign: 'center' }}>Name</th>
                <th style={{ fontFamily: 'Trebuchet MS', padding: '15px', textAlign: 'center' }}>Phone</th>
                <th style={{ fontFamily: 'Trebuchet MS', padding: '15px', textAlign: 'center' }}>Address</th>
                <th style={{ fontFamily: 'Trebuchet MS', padding: '15px', textAlign: 'center' }}>E-mail</th>
                <th style={{ fontFamily: 'Trebuchet MS', padding: '15px', textAlign: 'center' }}>Action</th>
            </tr>
        </thead>
        <tbody style={{ fontFamily: 'Trebuchet MS', fontSize: '13px', color: 'black' }}>
        <tr>
                <td style={{ padding: '15px', textAlign: 'center' }}>1</td>
                <td style={{ padding: '15px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    
                        <p style={{ margin: '0', textAlign: 'center' }}><Link to="/" style={{ textDecoration: 'none', color: 'black' }}>Name</Link></p>
                    </div>
                </td>
                <td style={{ fontFamily: 'Trebuchet MS', padding: '15px', textAlign: 'center' }}>Phone number</td>
                <td style={{ fontFamily: 'Trebuchet MS', padding: '15px', textAlign: 'center' }}>Address 1</td>
                <td style={{ fontFamily: 'Trebuchet MS', padding: '15px', textAlign: 'center' }}>E-mail 1</td>
                <td style={{ padding: '15px', textAlign: 'center' }}>
                    
                <button className='btn btn-danger btn-sm ms-2' >Remove Store Employee</button>
                    
                </td>
            </tr>
            <tr>
                <td style={{ padding: '15px', textAlign: 'center' }}>2</td>
                <td style={{ padding: '15px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    
                        <p style={{ margin: '0', textAlign: 'center' }}><Link to="/" style={{ textDecoration: 'none', color: 'black' }}>Name</Link></p>
                    </div>
                </td>
                <td style={{ fontFamily: 'Trebuchet MS', padding: '15px', textAlign: 'center' }}>Phone number</td>
                <td style={{ fontFamily: 'Trebuchet MS', padding: '15px', textAlign: 'center' }}>Address 2</td>
                <td style={{ fontFamily: 'Trebuchet MS', padding: '15px', textAlign: 'center' }}>E-mail 2</td>
                <td style={{ padding: '15px', textAlign: 'center' }}>
                    
                <button className='btn btn-danger btn-sm ms-2' >Remove Store Employee</button>
                    
                </td>
            </tr>
            <tr>
                <td style={{ padding: '15px', textAlign: 'center' }}>3</td>
                <td style={{ padding: '15px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    
                        <p style={{ margin: '0', textAlign: 'center' }}><Link to="/" style={{ textDecoration: 'none', color: 'black' }}>Name</Link></p>
                    </div>
                </td>
                <td style={{ fontFamily: 'Trebuchet MS', padding: '15px', textAlign: 'center' }}>Phone number</td>
                <td style={{ fontFamily: 'Trebuchet MS', padding: '15px', textAlign: 'center' }}>Address 3</td>
                <td style={{ fontFamily: 'Trebuchet MS', padding: '15px', textAlign: 'center' }}>E-mail 3</td>
                <td style={{ padding: '15px', textAlign: 'center' }}>
                    
                <button className='btn btn-danger btn-sm ms-2' >Remove Store Employee</button>
                    
                </td>
            </tr>
            <tr>
                <td style={{ padding: '15px', textAlign: 'center' }}>3</td>
                <td style={{ padding: '15px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    
                        <p style={{ margin: '0', textAlign: 'center' }}><Link to="/" style={{ textDecoration: 'none', color: 'black' }}>Name</Link></p>
                    </div>
                </td>
                <td style={{ fontFamily: 'Trebuchet MS', padding: '15px', textAlign: 'center' }}>Phone number</td>
                <td style={{ fontFamily: 'Trebuchet MS', padding: '15px', textAlign: 'center' }}>Address 4</td>
                <td style={{ fontFamily: 'Trebuchet MS', padding: '15px', textAlign: 'center' }}>E-mail 4</td>
                <td style={{ padding: '15px', textAlign: 'center' }}>
                    
                <button className='btn btn-danger btn-sm ms-2' >Remove Store Employee</button>
                    
                </td>
            </tr>
        </tbody>
    </table>
</div>


                    </div>
                </div>
            </div>
        </section>
    )
}

export default StoreEmployee;