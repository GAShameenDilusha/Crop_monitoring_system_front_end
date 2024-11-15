// Hide update button initially
$('#btn-field-update').css('display', 'none');

// Save field
$('#btn-field-save').click(function () {
    const locationValue = $('#txt-field-location').val();
    const [latitude, longitude] = locationValue.split(',').map(coord => parseFloat(coord.trim()));

    const field = {
        field_code: $('#txt-field-code').val(),
        name: $('#txt-field-name').val(),
        location: {
            latitude: latitude,
            longitude: longitude
        },
        extent_size: parseFloat($('#txt-field-extent-size').val()),
        crops: $('#txt-field-crops').val(),
        staff: $('#txt-field-staff').val(),
        image1: $('#field-image1')[0].files[0],
        image2: $('#field-image2')[0].files[0]
    };

    if (checkValidity(field)) {
        // Create FormData to handle file uploads
        const formData = new FormData();
        formData.append('field', JSON.stringify({
            field_code: field.field_code,
            name: field.name,
            location: field.location,
            extent_size: field.extent_size,
            crops: field.crops,
            staff: field.staff
        }));
        formData.append('image1', field.image1);
        formData.append('image2', field.image2);

        $.ajax({
            method: 'POST',
            url: 'http://localhost:8080/api/v1/field',
            contentType: false,
            processData: false,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: formData,
            success: function () {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Field has been saved successfully",
                    showConfirmButton: false,
                    timer: 1500
                });
                clearFieldFields();
                loadAllFields();
                setFieldCode();
            }
        });
    }
});

// Update field
$('#tbl-field').on('click', '.btn-field-update', function () {
    const fieldCode = $(this).closest('tr').find('td:eq(0)').text().trim();

    $.ajax({
        method: 'GET',
        url: `http://localhost:8080/api/v1/field?field_code=${fieldCode}`,
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (field) {
            $('#txt-field-code').val(field.field_code);
            $('#txt-field-name').val(field.name);
            $('#txt-field-location').val(`${field.location.latitude}, ${field.location.longitude}`);
            $('#txt-field-extent-size').val(field.extent_size);
            $('#txt-field-crops').val(field.crops);
            $('#txt-field-staff').val(field.staff);

            // Handle image previews
            if (field.image1) {
                $('#preview-image1').attr('src', field.image1);
            }
            if (field.image2) {
                $('#preview-image2').attr('src', field.image2);
            }

            $('#btn-field-save').css('display', 'none');
            $('#btn-field-update').css('display', 'block');
            navigateToPage('#field-register-page');
        }
    });
});

// Delete field
$('#tbl-field').on('click', '.btn-field-delete', function () {
    const fieldCode = $(this).closest('tr').find('td:eq(0)').text().trim();
    deleteField(fieldCode);
});

// Clear button handler
$('#btn-field-clear').click(function() {
    clearFieldFields();
});

function clearFieldFields() {
    $('#txt-field-code').val('');
    $('#txt-field-name').val('');
    $('#txt-field-location').val('');
    $('#txt-field-extent-size').val('');
    $('#txt-field-crops').val('');
    $('#txt-field-staff').val('');

    // Reset image previews
    $('#preview-image1').attr('src', '../assets/img/no-image-img.jpg');
    $('#preview-image2').attr('src', '../assets/img/no-image-img.jpg');

    // Clear file inputs
    $('#field-image1').val('');
    $('#field-image2').val('');
}

function setFieldCode() {
    $.ajax({
        method: 'GET',
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
        method: 'GET',
        url: 'http://localhost:8080/api/v1/field/all',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (fields) {
            fields.forEach(field => {
                const row = `
                    <tr>
                        <td>${field.field_code}</td>
                        <td>${field.name}</td>
                        <td>${field.location.latitude}, ${field.location.longitude}</td>
                        <td>${field.extent_size}</td>
                        <td>${field.crops}</td>
                        <td>${field.staff}</td>
                        <td><img src="${field.image1 || '../assets/img/no-image-img.jpg'}" alt="Field Image 1" class="table-image"></td>
                        <td><img src="${field.image2 || '../assets/img/no-image-img.jpg'}" alt="Field Image 2" class="table-image"></td>
                        <td>
                            <button class="btn btn-warning btn-field-update">
                                <img src="../assets/img/edit.png" alt="edit" style="width: 20px; height: 20px;">
                            </button>
                            <button class="btn btn-danger btn-field-delete">
                                <img src="../assets/img/remove.png" alt="delete" style="width: 20px; height: 20px;">
                            </button>
                        </td>
                    </tr>
                `;
                $('#tbl-field tbody').append(row);
            });
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

    if (!field.field_code) {
        showError('Field code is required');
        return false;
    }
    if (!field.name) {
        showError('Field name is required');
        return false;
    }
    if (isNaN(field.location.latitude) || isNaN(field.location.longitude)) {
        showError('Valid location coordinates are required');
        return false;
    }
    if (isNaN(field.extent_size) || !field.extent_size) {
        showError('Valid extent size is required');
        return false;
    }
    if (!field.crops) {
        showError('Crops selection is required');
        return false;
    }
    if (!field.staff) {
        showError('Staff selection is required');
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
                            text: "Field has been deleted successfully.",
                            icon: "success"
                        });
                    } else {
                        Swal.fire({
                            title: "Error!",
                            text: "Failed to delete the field.",
                            icon: "error"
                        });
                    }
                }
            });
        }
    });
}