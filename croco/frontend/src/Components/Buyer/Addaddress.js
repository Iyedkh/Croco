import React from 'react';
import Sidebar from './Sidebar';

function Addaddress() {
    return (
        <section className="container mt-4">
            <div className="row">
                <div className="col-md-3 col-12 mb-2">
                    <Sidebar />
                </div>
                <div className="col-md-9 col-3 ">
                    <div className="card p-4" style={{ borderRadius: '10px', width: '60%' }}>
                        <h4 className="text-center mb-3" style={{ fontFamily: 'Trebuchet MS', fontSize: '20px', color: 'black' }}>Add Address</h4>
                        <div className="card-body">
                            <form>
                                <div className="mb-2">
                                    <label htmlFor="address" className="form-label">Address</label>
                                    <textarea className="form-control" id="address" style={{ fontSize: '12px', padding: '6px', height: '60px' }}></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary d-block mx-auto" style={{ fontFamily: 'Trebuchet MS', borderRadius: '20px', fontSize: '15px', width: '80px' }}>Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Addaddress;
