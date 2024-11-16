/* Save vehicle */
$('#btn-vehicle-save').click(function () {
    if (!validateVehicle()) {
        return;
    }

    const vehicle = {
        vehicle_code: $('#txt-vehicle-code').val(),
        license_plate: $('#txt-license-plate').val(),
        vehicle_category: $('#txt-vehicle-category').val(),
        fuel_type: $('#txt-fuel-type').val(),
        status: $('#txt-vehicle-status').val(),
        allocated_staff: $('#txt-allocated-staff').val(),
        remarks: $('#txt-vehicle-remarks').val()
    };

    $.ajax({
        method: 'POST',
        url: 'http://localhost:8080/api/v1/vehicle',
        contentType: 'application/json',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        data: JSON.stringify(vehicle),
        success: function (data) {
            if (data) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Vehicle has been saved successfully",
                    showConfirmButton: false,
                    timer: 1500
                });
                loadAllVehicles();
                setVehicleCode();
                clearVehicleFields();
            } else {
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "Failed to save the vehicle",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        }
    });
});

/* Update vehicle */
$('#tbl-vehicle').on('click', '.btn-vehicle-update', function () {
    const vehicleCode = $(this).closest('tr').find('td:eq(0) .action_label').text().trim();

    $.ajax({
        method: 'GET',
        url: `http://localhost:8080/api/v1/vehicle?vehicle_code=${vehicleCode}`,
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (vehicle) {
            $('#txt-vehicle-code').val(vehicle.vehicle_code);
            $('#txt-license-plate').val(vehicle.license_plate);
            $('#txt-vehicle-category').val(vehicle.vehicle_category);
            $('#txt-fuel-type').val(vehicle.fuel_type);
            $('#txt-vehicle-status').val(vehicle.status);
            $('#txt-allocated-staff').val(vehicle.allocated_staff);
            $('#txt-vehicle-remarks').val(vehicle.remarks);
            $('#btn-vehicle-update').css('display', 'block');
            $('#btn-vehicle-save').css('display', 'none');
            navigateToPage('#vehicle-register-page');
        }
    });
});

/* Delete vehicle */
$('#tbl-vehicle').on('click', '.btn-vehicle-delete', function () {
    const vehicleCode = $(this).closest('tr').find('td:eq(0) .action_label').text().trim();

    Swal.fire({
        title: "Are you sure you want to delete this vehicle?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#3085d6",
        confirmButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                method: 'DELETE',
                url: `http://localhost:8080/api/v1/vehicle?vehicle_code=${vehicleCode}`,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                success: function (response) {
                    if (response === true) {
                        Swal.fire({
                            title: "Deleted!",
                            text: "Vehicle has been deleted.",
                            icon: "success"
                        });
                        loadAllVehicles();
                    } else {
                        Swal.fire({
                            title: "Error!",
                            text: "Failed to delete the vehicle.",
                            icon: "error"
                        });
                    }
                }
            });
        }
    });
});

/* Set vehicle code */
function setVehicleCode() {
    $.ajax({
        method: 'GET',
        url: 'http://localhost:8080/api/v1/vehicle/id',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (vehicleCode) {
            $('#txt-vehicle-code').val(vehicleCode);
        }
    });
}

$('#btn-vehicle-clear').click(function () {
    clearVehicleFields();
});


/* Clear vehicle fields */
function clearVehicleFields() {
    $('#txt-vehicle-code').val('');
    setVehicleCode();
    $('#txt-license-plate').val('');
    $('#txt-vehicle-category').val('');
    $('#txt-fuel-type').val('');
    $('#txt-vehicle-status').val('');
    $('#txt-allocated-staff').val('');
    $('#txt-vehicle-remarks').val('');
}




/* Load all vehicles */
function loadAllVehicles() {
    $.ajax({
        method: 'GET',
        url: 'http://localhost:8080/api/v1/vehicle/all',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (vehicles) {
            $('#tbl-vehicle tbody').empty();
            vehicles.forEach(vehicle => {
                let row = `
                    <tr>
                        <td><label class="action_label">${vehicle.vehicle_code}</label></td>
                        <td><label>${vehicle.license_plate}</label></td>
                        <td><label>${vehicle.vehicle_category}</label></td>
                        <td><label>${vehicle.fuel_type}</label></td>
                        <td><label>${vehicle.status}</label></td>
                        <td><label>${vehicle.allocated_staff}</label></td>
                        <td><label>${vehicle.remarks}</label></td>
                        <td>
                            <div class="action-label">
                                <button class="btn btn-warning btn-vehicle-update">
                                    <img src="../assets/img/edit.png" alt="edit" style="width: 20px; height: 20px;">
                                </button>
                                <button class="btn btn-danger btn-vehicle-delete">
                                    <img src="../assets/img/remove.png" alt="delete" style="width: 20px; height: 20px;">
                                </button>
                            </div>
                        </td>
                    </tr>`;
                $('#tbl-vehicle tbody').append(row);
            });
        }
    });
}

/* Validate vehicle fields */
function validateVehicle() {
    const showError = (message) => {
        Swal.fire({
            position: "top-end",
            icon: "error",
            title: message,
            showConfirmButton: false,
            timer: 1500
        });
    };

    if (!$('#txt-vehicle-code').val().trim()) {
        showError("Vehicle code is required");
        return false;
    }
    if (!$('#txt-license-plate').val().trim()) {
        showError("License plate number is required");
        return false;
    }
    if (!$('#txt-vehicle-category').val().trim()) {
        showError("Vehicle category is required");
        return false;
    }
    if (!$('#txt-fuel-type').val().trim()) {
        showError("Fuel type is required");
        return false;
    }
    if (!$('#txt-vehicle-status').val().trim()) {
        showError("Status is required");
        return false;
    }
    if (!$('#txt-allocated-staff').val().trim()) {
        showError("Allocated staff member details are required");
        return false;
    }

    return true;
}

/* Navigate to a specific page */
function navigateToPage(pageId) {
    $('.page-wrapper').hide();
    $(pageId).show();
}

///////////////////////////////////////////////
$(document).ready(function () {
    // Clear Button Click Event
    $('#btn-vehicle-clear').click(function () {
        clearVehicleFields(); // Call the function to clear fields
    });

    // Function to Clear All Text Fields
    function clearVehicleFields() {
        // Clear each input field
        $('#txt-vehicle-code').val('');
        setVehicleCode(); // Optionally reset the vehicle code to a new value
        $('#txt-license-plate').val('');
        $('#txt-vehicle-category').val('');
        $('#txt-fuel-type').val('');
        $('#txt-vehicle-status').val('');
        $('#txt-allocated-staff').val('');
        $('#txt-vehicle-remarks').val('');

        // Log the action for debugging
        console.log('All fields cleared');
    }

    // Example Implementation of setVehicleCode
    function setVehicleCode() {
        // Simulate setting a new vehicle code
        $.ajax({
            method: 'GET',
            url: 'http://localhost:8080/api/v1/vehicle/id',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function (vehicleCode) {
                $('#txt-vehicle-code').val(vehicleCode); // Set the new vehicle code
            },
            error: function () {
                console.log('Error fetching vehicle code');
            }
        });
    }

    // Example Validation Function (Optional)
    function validateVehicle() {
        const showError = (message) => {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: message,
                showConfirmButton: false,
                timer: 1500
            });
        };

        let vehicleCode = $('#txt-vehicle-code').val().trim();
        if (!vehicleCode) {
            showError("Vehicle code is required");
            return false;
        }

        let licensePlate = $('#txt-license-plate').val().trim();
        if (!licensePlate) {
            showError("License plate number is required");
            return false;
        }

        let vehicleCategory = $('#txt-vehicle-category').val();
        if (!vehicleCategory) {
            showError("Please select a vehicle category");
            return false;
        }

        let fuelType = $('#txt-fuel-type').val();
        if (!fuelType) {
            showError("Please select a fuel type");
            return false;
        }

        let status = $('#txt-vehicle-status').val();
        if (!status) {
            showError("Please select a status");
            return false;
        }

        let allocatedStaff = $('#txt-allocated-staff').val();
        if (!allocatedStaff) {
            showError("Allocated staff member details are required");
            return false;
        }

        return true;
    }
});


///////////////////////////////////////////////////////////////
document.getElementById("btn-vehicle-clear").addEventListener("click", function() {
    // Clear all text inputs
    document.getElementById("txt-vehicle-code").value = "";
    document.getElementById("txt-license-plate").value = "";
    document.getElementById("txt-vehicle-category").value = "";
    document.getElementById("txt-fuel-type").value = "";
    document.getElementById("txt-vehicle-status").value = "";
    document.getElementById("txt-vehicle-remarks").value = "";

    // Reset dropdown for allocated staff
    document.getElementById("txt-allocated-staff").selectedIndex = 0;

    console.log("All fields have been cleared!");
});
