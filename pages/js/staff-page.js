// Global variable for storing staff image
let staffImageBase64 = '';

// Handle staff registration button click
$('#btn-register-staff').click(function () {
    $('#btn-emp-update').css('display', 'none');
    $('#btn-emp-save').css('display', 'block');
    clearStaffFields();
    setBranches();
    setStaffCode();
});

// Handle save staff
$('#btn-emp-save').click(function () {
    let firstName = $('#txt-emp-first-name').val();
    let lastName = $('#txt-emp-last-name').val();
    let fullName = firstName + ' ' + lastName;
    let gender = $('#txt-emp-gender').val();
    let genderCode = gender === 'MALE' ? 0 : (gender === 'FEMALE' ? 1 : null);

    let dob = $('#txt-emp-dob').val();
    let buildNo = $('#txt-emp-build-no').val();
    let lane = $('#txt-emp-lane').val();
    let city = $('#txt-emp-city').val();
    let state = $('#txt-emp-state').val();
    let postalCode = $('#txt-emp-post-code').val();
    let contact = $('#txt-emp-contact').val();
    let email = $('#txt-emp-email').val();
    let code = $('#txt-emp-code').val();
    let designation = $('#txt-emp-designation').val();
    let branch = $('#txt-emp-branch').val();
    let joinDate = $('#txt-emp-join-date').val();
    let role = $('#txt-emp-role').val();
    let vehicle = $('#txt-emp-vehicle').val();

    let roleCode = role === 'ADMIN' ? 0 : 1;

    let staffDTO = {
        name: fullName,
        gender: genderCode,
        dob: dob,
        building_number: buildNo,
        lane: lane,
        city: city,
        state: state,
        postal_code: postalCode,
        contact: contact,
        email: email,
        employee_code: code,
        designation: designation,
        branch: {
            branch_code: branch
        },
        joined_date: joinDate,
        role: roleCode,
        vehicle: vehicle
    };

    if (checkValidity(staffDTO)) {
        $.ajax({
            url: 'http://localhost:8080/api/v1/employee',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            contentType: 'application/json',
            data: JSON.stringify(staffDTO),
            success: function (response) {
                if (response === true) {
                    alert('Staff Added Successfully');
                    loadAllStaff();
                    setBranches();
                    setStaffCode();
                    clearStaffFields();
                } else {
                    alert('Failed to Add Staff');
                }
            }
        });
    }
});

// Handle update button click in table
$('#tbl-staff').on('click', '.btn-emp-update', function () {
    setBranches();
    const staffId = $(this).closest('tr').find('td:eq(0) .action_label').text().trim();

    $.ajax({
        url: `http://localhost:8080/api/v1/employee?employee_code=${staffId}`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (staff) {
            // Get branch info
            $.ajax({
                url: `http://localhost:8080/api/v1/employee/branch?employee_code=${staffId}`,
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                success: function (branch) {
                    $('#txt-emp-branch').val(branch.branch_code);
                }
            });

            // Split full name into first and last name
            let nameParts = staff.name.split(' ');
            $('#txt-emp-first-name').val(nameParts[0]);
            $('#txt-emp-last-name').val(nameParts.slice(1).join(' '));

            $('#txt-emp-gender').val(staff.gender === 0 ? 'MALE' : 'FEMALE');
            $('#txt-emp-dob').val(staff.dob);
            $('#txt-emp-build-no').val(staff.building_number);
            $('#txt-emp-lane').val(staff.lane);
            $('#txt-emp-city').val(staff.city);
            $('#txt-emp-state').val(staff.state);
            $('#txt-emp-post-code').val(staff.postal_code);
            $('#txt-emp-contact').val(staff.contact);
            $('#txt-emp-email').val(staff.email);
            $('#txt-emp-code').val(staff.employee_code);
            $('#txt-emp-designation').val(staff.designation);
            $('#txt-emp-join-date').val(staff.joined_date);
            $('#txt-emp-role').val(staff.role === 0 ? 'ADMIN' : 'USER');
            $('#txt-emp-vehicle').val(staff.vehicle);

            $('#btn-emp-save').css('display', 'none');
            $('#btn-emp-update').css('display', 'block');
        }
    });
});

// Handle update staff
$('#btn-emp-update').click(function () {
    let firstName = $('#txt-emp-first-name').val();
    let lastName = $('#txt-emp-last-name').val();
    let fullName = firstName + ' ' + lastName;
    let gender = $('#txt-emp-gender').val();
    let genderCode = gender === 'MALE' ? 0 : 1;

    let dob = $('#txt-emp-dob').val();
    let buildNo = $('#txt-emp-build-no').val();
    let lane = $('#txt-emp-lane').val();
    let city = $('#txt-emp-city').val();
    let state = $('#txt-emp-state').val();
    let postalCode = $('#txt-emp-post-code').val();
    let contact = $('#txt-emp-contact').val();
    let email = $('#txt-emp-email').val();
    let code = $('#txt-emp-code').val();
    let designation = $('#txt-emp-designation').val();
    let branch = $('#txt-emp-branch').val();
    let joinDate = $('#txt-emp-join-date').val();
    let role = $('#txt-emp-role').val();
    let vehicle = $('#txt-emp-vehicle').val();

    let roleCode = role === 'ADMIN' ? 0 : 1;

    let staffDTO = {
        name: fullName,
        gender: genderCode,
        dob: dob,
        building_number: buildNo,
        lane: lane,
        city: city,
        state: state,
        postal_code: postalCode,
        contact: contact,
        email: email,
        employee_code: code,
        designation: designation,
        branch: {
            branch_code: branch
        },
        joined_date: joinDate,
        role: roleCode,
        vehicle: vehicle
    };

    $.ajax({
        url: 'http://localhost:8080/api/v1/employee',
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        contentType: 'application/json',
        data: JSON.stringify(staffDTO),
        success: function (response) {
            if (response === true) {
                alert('Staff Updated Successfully');
                loadAllStaff();
                clearStaffFields();
                $('#btn-emp-update').css('display', 'none');
                $('#btn-emp-save').css('display', 'block');
            } else {
                alert('Failed to Update Staff');
            }
        }
    });
});

// Handle delete staff
$('#tbl-staff').on('click', '.btn-emp-delete', function () {
    const staffId = $(this).closest('tr').find('td:eq(0) .action_label').text().trim();

    if (confirm('Are you sure you want to delete this staff member?')) {
        $.ajax({
            url: `http://localhost:8080/api/v1/employee?employee_code=${staffId}`,
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function (response) {
                if (response === true) {
                    alert('Staff Deleted Successfully');
                    loadAllStaff();
                } else {
                    alert('Failed to Delete Staff');
                }
            }
        });
    }
});

// Clear staff fields
$('#btn-emp-clear').click(function () {
    clearStaffFields();
});

// Utility Functions
function clearStaffFields() {
    $('#txt-emp-first-name').val('');
    $('#txt-emp-last-name').val('');
    $('#txt-emp-gender').val('');
    $('#txt-emp-dob').val('');
    $('#txt-emp-build-no').val('');
    $('#txt-emp-lane').val('');
    $('#txt-emp-city').val('');
    $('#txt-emp-state').val('');
    $('#txt-emp-post-code').val('');
    $('#txt-emp-contact').val('');
    $('#txt-emp-email').val('');
    $('#txt-emp-code').val('');
    $('#txt-emp-designation').val('');
    $('#txt-emp-branch').val('');
    $('#txt-emp-join-date').val('');
    $('#txt-emp-role').val('');
    $('#txt-emp-vehicle').val('');
}

function setStaffCode() {
    $.ajax({
        url: 'http://localhost:8080/api/v1/employee/id',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (staffCode) {
            $('#txt-emp-code').val(staffCode);
        }
    });
}

function setBranches() {
    $('#txt-emp-branch').empty();
    $('#txt-emp-branch').append(new Option('Select Field', ''));

    $.ajax({
        url: 'http://localhost:8080/api/v1/branch/all',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (branches) {
            if (branches.length === 0) {
                alert('No Fields Found! Please Add Fields First!');
            } else {
                branches.forEach(branch => {
                    $('#txt-emp-branch').append(new Option(branch.branch_name, branch.branch_code));
                });
            }
        }
    });
}

function loadAllStaff() {
    $('#tbl-staff tbody').empty();

    $.ajax({
        url: 'http://localhost:8080/api/v1/employee/all',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (staffList) {
            staffList.forEach(staff => {
                $.ajax({
                    url: `http://localhost:8080/api/v1/employee/branch?employee_code=${staff.employee_code}`,
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    success: function (branch) {
                        const row = `
                            <tr>
                                <td><label class="action_label">${staff.employee_code}</label></td>
                                <td><label>${staff.name}</label></td>
                                <td><label>${staff.designation}</label></td>
                                <td><label>${staff.contact}</label></td>
                                <td><label>${branch.branch_name}</label></td>
                                <td><label>${staff.role === 0 ? 'ADMIN' : 'USER'}</label></td>
                                <td>
                                    <div class="action-label">
                                        <a class="btn btn-warning btn-emp-update">
                                            <img src="../assets/img/edit.png" alt="edit" style="width: 20px; height: 20px;"/>
                                        </a>
                                        <a class="btn btn-danger btn-emp-delete">
                                            <img src="../assets/img/remove.png" alt="delete" style="width: 20px; height: 20px;"/>
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        `;
                        $('#tbl-staff tbody').append(row);
                    }
                });
            });
        }
    });
}

function setStaffCounts() {
    $.ajax({
        url: 'http://localhost:8080/api/v1/employee/count',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (counts) {
            $('#total-staffs').text(counts.totalEmployeeCount);
            $('#total-users').text(counts.totalUserEmployeeCount);
            $('#total-admins').text(counts.totalAdminEmployeeCount);
        }
    });
}

function checkValidity(data) {
    // Email and contact validation patterns
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const contactPattern = /^\d{10}$/;

    // Date validations
    const currentDate = new Date();
    const dobDate = new Date(data.dob);
    const joinDate = new Date(data.joined_date);

    if (!data.name) {
        alert('Staff name is required');
        return false;
    }

    if (data.gender === null) {
        alert('Gender is required');
        return false;
    }

    if (!data.dob) {
        alert('Date of birth is required');
        return false;
    }

    if (dobDate >= currentDate) {
        alert('Date of birth cannot be in the future');
        return false;
    }

    if (!data.contact) {
        alert('Contact number is required');
        return false;
    }

    if (!contactPattern.test(data.contact)) {
        alert('Invalid contact number format');
        return false;
    }

    if (!data.email) {
        alert('Email is required');
        return false;
    }

    if (!emailPattern.test(data.email)) {
        alert('Invalid email format');
        return false;
    }

    if (!data.building_number) {
        alert('Building number is required');
        return false;
    }

    if (!data.lane) {
        alert('Lane is required');
        return false;
    }

    if (!data.city) {
        alert('City is required');
        return false;
    }

    if (!data.branch.branch_code) {
        alert('Field is required');
        return false;
    }

    if (!data.designation) {
        alert('Designation is required');
        return false;
    }

    if (!data.joined_date) {
        alert('Join date is required');
        return false;
    }

    if (joinDate > currentDate) {
        alert('Join date cannot be in the future');
        return false;
    }

    return true;
}