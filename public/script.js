
// ======================================
// COMMON API FUNCTION
// ======================================

async function apiRequest(url, method = 'GET', data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (data !== null) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Something went wrong');
    }

    return response.json();
}


// ======================================
// DATE FORMAT FUNCTION
// ======================================

function formatDate(date) {
    if (!date) return '';

    if (typeof date === 'string') {
        return date.substring(0, 10);
    }

    const d = new Date(date);

    if (isNaN(d.getTime())) return '';

    return d.toISOString().substring(0, 10);
}


// ======================================
// CUSTOMER CRUD
// ======================================

const customerForm = document.getElementById('customerForm');

async function loadCustomers() {
    const table = document.getElementById('customerTable');

    if (!table) return;

    try {
        const customers = await apiRequest('/api/customers');

        table.innerHTML = '';

        if (customers.length === 0) {
            table.innerHTML =
                '<tr><td colspan="5">No customers found.</td></tr>';
            return;
        }

        customers.forEach(customer => {
            table.innerHTML += `
                <tr>
                    <td>${customer.customer_id}</td>
                    <td>${customer.name}</td>
                    <td>${customer.email || ''}</td>
                    <td>${customer.address || ''}</td>
                    <td>
                        <button onclick="editCustomer(${customer.customer_id})">Edit</button>
                        <button onclick="deleteCustomer(${customer.customer_id})">Delete</button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        alert('Customer Error: ' + error.message);
    }
}


// ADD OR UPDATE CUSTOMER

if (customerForm) {
    customerForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const id = document.getElementById('customer_id').value;

        const data = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value
        };

        try {
            if (id) {
                await apiRequest('/api/customers/' + id, 'PUT', data);
                alert('Customer Updated Successfully!');
            } else {
                await apiRequest('/api/customers', 'POST', data);
                alert('Customer Added Successfully!');
            }

            customerForm.reset();
            document.getElementById('customer_id').value = '';

            loadCustomers();

        } catch (error) {
            alert('Customer Error: ' + error.message);
        }
    });
}


// EDIT CUSTOMER

async function editCustomer(id) {
    try {
        const customers = await apiRequest('/api/customers');

        const customer = customers.find(
            c => String(c.customer_id) === String(id)
        );

        if (!customer) return;

        document.getElementById('customer_id').value = customer.customer_id;
        document.getElementById('name').value = customer.name;
        document.getElementById('email').value = customer.email || '';
        document.getElementById('address').value = customer.address || '';

        window.scrollTo(0, 0);

    } catch (error) {
        alert(error.message);
    }
}


// DELETE CUSTOMER

async function deleteCustomer(id) {
    if (!confirm('Are you sure you want to delete this customer?')) {
        return;
    }

    try {
        await apiRequest('/api/customers/' + id, 'DELETE');

        alert('Customer Deleted Successfully!');

        loadCustomers();

    } catch (error) {
        alert('Delete Error: ' + error.message);
    }
}


// ======================================
// PARCEL CRUD
// ======================================

const parcelForm = document.getElementById('parcelForm');

async function loadParcels() {
    const table = document.getElementById('parcelTable');

    if (!table) return;

    try {
        const parcels = await apiRequest('/api/parcels');

        table.innerHTML = '';

        if (parcels.length === 0) {
            table.innerHTML =
                '<tr><td colspan="8">No parcels found.</td></tr>';
            return;
        }

        parcels.forEach(parcel => {
            table.innerHTML += `
                <tr>
                    <td>${parcel.parcel_id}</td>
                    <td>${parcel.customer_id}</td>
                    <td>${parcel.receiver_name}</td>
                    <td>${parcel.receiver_phone}</td>
                    <td>${parcel.weight}</td>
                    <td>${formatDate(parcel.booking_date)}</td>
                    <td>${parcel.status}</td>
                    <td>
                        <button onclick="editParcel(${parcel.parcel_id})">Edit</button>
                        <button onclick="deleteParcel(${parcel.parcel_id})">Delete</button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        alert('Parcel Error: ' + error.message);
    }
}


// ADD OR UPDATE PARCEL

if (parcelForm) {
    parcelForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const id = document.getElementById('parcel_id').value;

        const data = {
            customer_id: document.getElementById('customer_id').value,
            sender_address: document.getElementById('sender_address').value,
            receiver_name: document.getElementById('receiver_name').value,
            receiver_phone: document.getElementById('receiver_phone').value,
            receiver_address: document.getElementById('receiver_address').value,
            weight: document.getElementById('weight').value,
            booking_date: document.getElementById('booking_date').value,
            status: document.getElementById('status').value
        };

        try {
            if (id) {
                await apiRequest('/api/parcels/' + id, 'PUT', data);
                alert('Parcel Updated Successfully!');
            } else {
                await apiRequest('/api/parcels', 'POST', data);
                alert('Parcel Added Successfully!');
            }

            parcelForm.reset();
            document.getElementById('parcel_id').value = '';

            loadParcels();

        } catch (error) {
            alert('Parcel Error: ' + error.message);
        }
    });
}


// EDIT PARCEL

async function editParcel(id) {
    try {
        const parcels = await apiRequest('/api/parcels');

        const parcel = parcels.find(
            p => String(p.parcel_id) === String(id)
        );

        if (!parcel) return;

        document.getElementById('parcel_id').value = parcel.parcel_id;
        document.getElementById('customer_id').value = parcel.customer_id;
        document.getElementById('sender_address').value = parcel.sender_address;
        document.getElementById('receiver_name').value = parcel.receiver_name;
        document.getElementById('receiver_phone').value = parcel.receiver_phone;
        document.getElementById('receiver_address').value = parcel.receiver_address;
        document.getElementById('weight').value = parcel.weight;
        document.getElementById('booking_date').value = formatDate(parcel.booking_date);
        document.getElementById('status').value = parcel.status;

        window.scrollTo(0, 0);

    } catch (error) {
        alert(error.message);
    }
}


// DELETE PARCEL

async function deleteParcel(id) {
    if (!confirm('Are you sure you want to delete this parcel?')) {
        return;
    }

    try {
        await apiRequest('/api/parcels/' + id, 'DELETE');

        alert('Parcel Deleted Successfully!');

        loadParcels();

    } catch (error) {
        alert('Delete Error: ' + error.message);
    }
}


// ======================================
// TRACKING CRUD
// ======================================

const trackingForm = document.getElementById('trackingForm');

async function loadTracking() {
    const table = document.getElementById('trackingTable');

    if (!table) return;

    try {
        const tracking = await apiRequest('/api/tracking');

        table.innerHTML = '';

        if (tracking.length === 0) {
            table.innerHTML =
                '<tr><td colspan="8">No tracking details found.</td></tr>';
            return;
        }

        tracking.forEach(item => {
            table.innerHTML += `
                <tr>
                    <td>${item.tracking_id}</td>
                    <td>${item.parcel_id}</td>
                    <td>${item.current_location}</td>
                    <td>${item.tracking_status}</td>
                    <td>${formatDate(item.updated_date)}</td>
                    <td>${item.updated_time}</td>
                    <td>${item.remarks || ''}</td>
                    <td>
                        <button onclick="editTracking(${item.tracking_id})">Edit</button>
                        <button onclick="deleteTracking(${item.tracking_id})">Delete</button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        alert('Tracking Error: ' + error.message);
    }
}


// ADD OR UPDATE TRACKING

if (trackingForm) {
    trackingForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const id = document.getElementById('tracking_id').value;

        const data = {
            parcel_id: document.getElementById('track_parcel_id').value,
            current_location: document.getElementById('current_location').value,
            tracking_status: document.getElementById('tracking_status').value,
            updated_date: document.getElementById('updated_date').value,
            updated_time: document.getElementById('updated_time').value,
            remarks: document.getElementById('remarks').value
        };

        try {
            if (id) {
                await apiRequest('/api/tracking/' + id, 'PUT', data);
                alert('Tracking Updated Successfully!');
            } else {
                await apiRequest('/api/tracking', 'POST', data);
                alert('Tracking Details Added Successfully!');
            }

            trackingForm.reset();
            document.getElementById('tracking_id').value = '';

            loadTracking();

        } catch (error) {
            alert('Tracking Error: ' + error.message);
        }
    });
}


// EDIT TRACKING

async function editTracking(id) {
    try {
        const records = await apiRequest('/api/tracking');

        const item = records.find(
            t => String(t.tracking_id) === String(id)
        );

        if (!item) return;

        document.getElementById('tracking_id').value = item.tracking_id;
        document.getElementById('track_parcel_id').value = item.parcel_id;
        document.getElementById('current_location').value = item.current_location;
        document.getElementById('tracking_status').value = item.tracking_status;
        document.getElementById('updated_date').value = formatDate(item.updated_date);
        document.getElementById('updated_time').value =
            String(item.updated_time || '').substring(0, 5);
        document.getElementById('remarks').value = item.remarks || '';

        window.scrollTo(0, 0);

    } catch (error) {
        alert(error.message);
    }
}


// DELETE TRACKING

async function deleteTracking(id) {
    if (!confirm('Are you sure you want to delete this tracking record?')) {
        return;
    }

    try {
        await apiRequest('/api/tracking/' + id, 'DELETE');

        alert('Tracking Details Deleted Successfully!');

        loadTracking();

    } catch (error) {
        alert('Delete Error: ' + error.message);
    }
}


// ======================================
// LOAD DATA WHEN PAGE OPENS
// ======================================

document.addEventListener('DOMContentLoaded', function() {
    loadCustomers();
    loadParcels();
    loadTracking();
});