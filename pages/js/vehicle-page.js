$('#btn-vehicle-update').css('display', 'none');

/*save vehicle*/
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
                alert('Failed to save the vehicle');
            }
        }
    });
});

/*update vehicle*/
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

$('#btn-vehicle-update').click(function () {
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
        method: 'PUT',
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
                    title: "Vehicle has been updated successfully",
                    showConfirmButton: false,
                    timer: 1500
                });
                loadAllVehicles();
                navigateToPage('#vehicle-page');
                setVehicleCode();
                clearVehicleFields();
            } else {
                alert('Failed to update the vehicle');
            }
        }
    });
});

/*delete vehicle*/
$('#tbl-vehicle').on('click', '.btn-vehicle-delete', function () {
    const vehicleCode = $(this).closest('tr').find('td:eq(0) .action_label').text().trim();

    Swal.fire({
        title: "Are you sure you want to delete this Vehicle?",
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
                        loadAllVehicles();
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your Vehicle has been deleted.",
                            icon: "success"
                        });
                    } else {
                        Swal.fire({
                            title: "Error!",
                            text: "Your Vehicle has not been deleted.",
                            icon: "error"
                        });
                    }
                }
            });
        }
    });
});

/*set vehicle code*/
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

/*clear vehicle fields*/
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

/*load all vehicles*/
function loadAllVehicles() {
    $.ajax({
        method: 'GET',
        url: 'http://localhost:8080/api/v1/vehicle/all',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (vehicles) {
            $('#tbl-vehicle tbody tr').remove();
            for (let vehicle of vehicles) {
                let row = `
                    <tr>
                        <td>
                            <label class="action_label">${vehicle.vehicle_code}</label>
                        </td>
                        <td>
                            <label>${vehicle.license_plate}</label>
                        </td>
                        <td>
                            <label>${vehicle.vehicle_category}</label>
                        </td>
                        <td>
                            <label>${vehicle.fuel_type}</label>
                        </td>
                        <td>
                            <label>${vehicle.status}</label>
                        </td>
                        <td>
                            <label>${vehicle.allocated_staff}</label>
                        </td>
                        <td>
                            <label>${vehicle.remarks}</label>
                        </td>
                        <td>
                            <div class="action-label">
                                <a class="btn btn-warning btn-vehicle-update">
                                    <img src="../assets/img/edit.png" alt="edit" style="width: 20px; height: 20px;"/>
                                </a>
                                <a class="btn btn-danger btn-vehicle-delete">
                                    <img src="../assets/img/remove.png" alt="delete" style="width: 20px; height: 20px;"/>
                                </a>
                            </div>
                        </td>
                    </tr>`;
                $('#tbl-vehicle tbody').append(row);
            }
        }
    });
}

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

function changeVehicleFiles() {
    $('#btn-vehicle-update').css('display', 'none');
    $('#btn-vehicle-save').css('display', 'block');
    clearVehicleFields();
}