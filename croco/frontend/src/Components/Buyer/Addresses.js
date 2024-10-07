

import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';

function Addresses(props) {
    return (
        <section className="container mt-4">
    <div className="row">
        <div className="col-md-3 col-12 mb-2">
            <Sidebar />
        </div>
        <div className="col-md-9 col-12 mb-2">
            <div className="row"> 
                <div className='col-12'>
                   <Link to='/Buyer/Addaddress'className='btn btn-outline-success mb-4 float-end'><i className='fa fa-plus-circle'></i> Add Address</Link>
                </div>
            </div>




            <div className="row">
              <div className='col-4 mb-3'>
                <div className="card"  style={{ borderRadius: '7px' }}>
                   <div className="card-body text-muted" style={{ fontFamily: 'Trebuchet MS', color:'black' }}>
                      <h6>
                        <i className='fa fa-check-circle text-success mb-2'></i><br/>

                        Address 1

                      </h6>
                   </div>
                </div>
              </div>
              <div className='col-4 mb-3'>
                <div className="card"  style={{ borderRadius: '7px' }}>
                   <div className="card-body text-muted" style={{ fontFamily: 'Trebuchet MS', color:'black' }} >
                      <h6> 
                      <span className='badge bg-info mb-2' style={{ fontSize: '10px', padding: '4px 8px' }}>Mark default</span><br/>
                        Address 2
                      </h6>
                   </div>
                </div>
              </div>
              <div className='col-4 mb-3'>
                <div className="card"  style={{ borderRadius: '7px' }}>
                   <div className="card-body text-muted" style={{ fontFamily: 'Trebuchet MS', color:'black' }}>
                      <h6>
                      <span className='badge bg-info mb-2' style={{ fontSize: '10px', padding: '4px 8px' }}>Mark default</span><br/>
                        Address 3
                      </h6>
                   </div>
                </div>
              </div>
              <div className='col-4 mb-3'>
                <div className="card"  style={{ borderRadius: '7px' }}>
                   <div className="card-body text-muted" style={{ fontFamily: 'Trebuchet MS', color:'black' }}>
                      <h6>
                      <span className='badge bg-info mb-2' style={{ fontSize: '10px', padding: '4px 8px' }}>Mark default</span><br/>
                        Address 4
                      </h6>
                   </div>
                </div>
              </div>
              <div className='col-4 mb-3'>
                <div className="card"  style={{ borderRadius: '7px' }}>
                   <div className="card-body text-muted" style={{ fontFamily: 'Trebuchet MS', color:'black' }}>
                      <h6>
                      <span className='badge bg-info mb-2' style={{ fontSize: '10px', padding: '4px 8px' }}>Mark default</span><br/>
                        Address 5
                      </h6>
                   </div>
                </div>
              </div>
              <div className='col-4 mb-3'>
                <div className="card"  style={{ borderRadius: '7px' }}>
                   <div className="card-body text-muted" style={{ fontFamily: 'Trebuchet MS', color:'black' }}>
                      <h6>
                      <span className='badge bg-info mb-2' style={{ fontSize: '10px', padding: '4px 8px' }}>Mark default</span><br/>
                        Address 6
                      </h6>
                   </div>
                </div>
              </div>
         </div>
       </div>
    </div>
</section>


    )
}

export default Addresses;
