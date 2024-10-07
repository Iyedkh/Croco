
import VendorSidebar from './VendorSidebar';

function Reports () {
    return (
        <section className='container mt-4'>
            <div className='row'>
                <div className='col-md-3 col-12 mb-2'>
                          <VendorSidebar/>
                </div>
                <div className='col-md-9 col-12 mb-2'>
                    <div className='row'>
                        <div className='col-md-4 mb-2'>
                            <div className='card' style={{ borderRadius: '7px' }}>
                                <div className='card-body text-center'style={{ fontFamily: 'Arial, sans-serif', color:'black' }}>
                                     <h5>Daily Reports</h5>
                                     <h6><a href='#' className='btn btn-warning'>View</a></h6>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-4 mb-2'>
                            <div className='card' style={{ borderRadius: '7px' }}>
                                <div className='card-body text-center'style={{ fontFamily: 'Arial, sans-serif', color:'black' }}>
                                     <h5>Monthly Reports</h5>
                                     <h6><a href='#' className='btn btn-warning'>View</a></h6>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-4 mb-2'>
                            <div className='card' style={{ borderRadius: '7px' }}>
                                <div className='card-body text-center'style={{ fontFamily: 'Arial, sans-serif', color:'black' }}>
                                     <h5>Yearly Reports</h5>
                                     <h6><a href='#' className='btn btn-warning'>View</a></h6>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Reports;
