$('#btn-field-update').css('display', 'none');

// Save field
$('#btn-field-save').click(function () {
    const field = {
        field_code: $('#txt-field-code').val(),
        name: $('#txt-field-name').val(),
        location: { // Coordinate
            latitude: parseFloat($('#txt-field-lat').val()),
            longitude: parseFloat($('#txt-field-lon').val())
        },
        extent_size: parseFloat($('#txt-field-extent').val()),
        crops: $('#txt-field-crops').val().split(',').map(c => c.trim()),
        staff: $('#txt-field-staff').val().split(',').map(s => s.trim()),
        image1: $('#file-field-image1').val(),
        image2: $('#file-field-image2').val()
    };

    if (checkValidity(field)) {
        $.ajax({
            method: 'post',
            url: 'http://localhost:8080/api/v1/field',
            contentType: 'application/json',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: JSON.stringify(field),
            success: function () {
                alert('Field has been saved successfully');
                clearFieldFields();
                loadAllFields();
                setFieldCode();
            }
        });
    }
});

// Update field
$('#tbl-field').on('click', '.btn-field-update', function () {
    const fieldCode = $(this).closest('tr').find('td:eq(0) .action_label').text().trim();

    $.ajax({
        method: 'GET',
        url: `http://localhost:8080/api/v1/field?field_code=${fieldCode}`,
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (field) {
            $('#txt-field-code').val(field.field_code);
            $('#txt-field-name').val(field.name);
            $('#txt-field-lat').val(field.location.latitude);
            $('#txt-field-lon').val(field.location.longitude);
            $('#txt-field-extent').val(field.extent_size);
            $('#txt-field-crops').val(field.crops.join(', '));
            $('#txt-field-staff').val(field.staff.join(', '));
            $('#file-field-image1').val(field.image1);
            $('#file-field-image2').val(field.image2);
            $('#btn-field-save').css('display', 'none');
            $('#btn-field-update').css('display', 'block');
            navigateToPage('#field-register-page');
        }
    });
});

// Delete field
$('#tbl-field').on('click', '.btn-field-delete', function () {
    const fieldCode = $(this).closest('tr').find('td:eq(0) .action_label').text().trim();
    deleteField(fieldCode);
});

function clearFieldFields() {
    $('#txt-field-code').val('');
    $('#txt-field-name').val('');
    $('#txt-field-lat').val('');
    $('#txt-field-lon').val('');
    $('#txt-field-extent').val('');
    $('#txt-field-crops').val('');
    $('#txt-field-staff').val('');
    $('#file-field-image1').val('');
    $('#file-field-image2').val('');
}

function setFieldCode() {
    $.ajax({
        method: 'get',
        url: 'http://localhost:8080/api/v1/field/id',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (fieldCode) {
            $('#txt-field-code').val(fieldCode);
        }
    });
}

function loadAllFields() {
    $('#tbl-field tbody tr').remove();
    $.ajax({
        method: 'get',
        url: 'http://localhost:8080/api/v1/field/all',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (fields) {
            for (let field of fields) {
                let row = `
                 <tr>
                    <td>
                        <label class="action_label">${field.field_code}</label>
                    </td>
                    <td>
                        <label>${field.name}</label>
                    </td>
                    <td>
                        <label>${field.location.latitude}, ${field.location.longitude}</label>
                    </td>
                    <td><label class="action_label2">${field.extent_size}</label></td>
                    <td><label>${field.crops.join(', ')}</label></td>
                    <td><label>${field.staff.join(', ')}</label></td>
                    <td>
                        <div class="action-label">
                            <a class="btn btn-warning btn-field-update">
                                <img src="../assets/img/edit.png" alt="edit" style="width: 20px; height: 20px;">
                            </a>
                            <a class="btn btn-danger btn-field-delete">
                                <img src="../assets/img/remove.png" alt="delete" style="width: 20px; height: 20px;">
                            </a>
                        </div>
                    </td>
                </tr>
                `;
                $('#tbl-field tbody').append(row);
            }
        }
    });
}

function checkValidity(field) {
    const showError = (message) => {
        Swal.fire({
            position: "top-end",
            icon: "error",
            title: message,
            showConfirmButton: false,
            timer: 1500
        });
    };

    if (field.field_code === '') {
        showError('Field code is required');
        return false;
    }
    if (field.name === '') {
        showError('Field name is required');
        return false;
    }
    if (isNaN(field.location.latitude) || isNaN(field.location.longitude)) {
        showError('Location coordinates are required');
        return false;
    }
    if (isNaN(field.extent_size)) {
        showError('Extent size is required');
        return false;
    }
    if (field.crops.length === 0) {
        showError('Crops are required');
        return false;
    }
    if (field.staff.length === 0) {
        showError('Staff are required');
        return false;
    }
    return true;
}

function deleteField(fieldCode) {
    Swal.fire({
        title: "Are you sure you want to delete this Field?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#3085d6",
        confirmButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                method: 'DELETE',
                url: `http://localhost:8080/api/v1/field?field_code=${fieldCode}`,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                success: function (response) {
                    if (response === true) {
                        loadAllFields();
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your Field has been deleted.",
                            icon: "success"
                        });
                    } else {
                        Swal.fire({
                            title: "Error!",
                            text: "Your Field has not been deleted.",
                            icon: "error"
                        });
                    }
                }
            });
        }
    });
}



/////////////////////////////////////////////////////
/*imaged start*/
function previewFieldImage(input, previewId) {
    const preview = document.getElementById(previewId);

    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function(e) {
            preview.src = e.target.result;
        }

        reader.readAsDataURL(input.files[0]);
    } else {
        preview.src = '../assets/img/no-image-img.jpg';
    }
}

// To get the selected files later (if needed)
function getSelectedImages() {
    const image1 = document.getElementById('field-image1').files[0];
    const image2 = document.getElementById('field-image2').files[0];
    return { image1, image2 };
}
/*end*/





/*location start*/
const locationInput = document.getElementById('txt-field-location');
const errorMessage = document.querySelector('.error-message');

// Validate the coordinate format
function validateCoordinates(value) {
    const regex = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/;
    if (!value) return true; // Empty is allowed
    if (!regex.test(value)) return false;

    const [lat, lng] = value.split(',').map(coord => parseFloat(coord.trim()));
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

// Format coordinates to 6 decimal places
function formatCoordinates(lat, lng) {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}

// Get current location using Geolocation API
function getCurrentLocation() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                locationInput.value = formatCoordinates(latitude, longitude);
                errorMessage.style.display = 'none';
            },
            (error) => {
                console.error('Error getting location:', error);
                alert('Unable to get current location. Please enter coordinates manually.');
            }
        );
    } else {
        alert('Geolocation is not supported by your browser');
    }
}

// Input validation
locationInput.addEventListener('input', (e) => {
    if (validateCoordinates(e.target.value)) {
        errorMessage.style.display = 'none';
        e.target.setCustomValidity('');
    } else {
        errorMessage.style.display = 'block';
        e.target.setCustomValidity('Invalid coordinates format');
    }
});

// Format on blur
locationInput.addEventListener('blur', (e) => {
    if (e.target.value) {
        const [lat, lng] = e.target.value.split(',').map(coord => parseFloat(coord.trim()));
        if (!isNaN(lat) && !isNaN(lng)) {
            e.target.value = formatCoordinates(lat, lng);
        }
    }
});
/*end*/