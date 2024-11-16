// Hide update button initially
$('#btn-crop-update').css('display', 'none');

// Save crop
$('#btn-crop-save').click(function () {
    if (!validateCrop()) {
        return;
    }

    const crop = {
        crop_code: $('#txt-crop-code').val(),
        common_name: $('#txt-crop-common-name').val(),
        scientific_name: $('#txt-crop-scientific-name').val(),
        image: getImageData(),
        category: $('#txt-crop-category').val(),
        season: $('#txt-crop-season').val(),
        field: $('#txt-crop-field').val()
    };

    $.ajax({
        method: 'POST',
        url: 'http://localhost:8080/api/v1/crop',
        contentType: 'application/json',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        data: JSON.stringify(crop),
        success: function (data) {
            if (data) {
                showSuccessMessage('Crop has been saved successfully');
                loadAllCrops();
                setCropCode();
                clearCropFields();
            } else {
                showErrorMessage('Failed to save the crop');
            }
        }
    });
});

// Update crop functionality
$('#tbl-crop').on('click', '.btn-crop-update', function () {
    const cropCode = $(this).closest('tr').find('td:eq(0) .action_label').text().trim();

    $.ajax({
        method: 'GET',
        url: `http://localhost:8080/api/v1/crop?crop_code=${cropCode}`,
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (crop) {
            populateCropFields(crop);
            $('#btn-crop-update').css('display', 'block');
            $('#btn-crop-save').css('display', 'none');
            navigateToPage('#crop-register-page');
        }
    });
});

$('#btn-crop-update').click(function () {
    if (!validateCrop()) {
        return;
    }

    const crop = {
        crop_code: $('#txt-crop-code').val(),
        common_name: $('#txt-crop-common-name').val(),
        scientific_name: $('#txt-crop-scientific-name').val(),
        image: getImageData(),
        category: $('#txt-crop-category').val(),
        season: $('#txt-crop-season').val(),
        field: $('#txt-crop-field').val()
    };

    $.ajax({
        method: 'PUT',
        url: 'http://localhost:8080/api/v1/crop',
        contentType: 'application/json',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        data: JSON.stringify(crop),
        success: function (data) {
            if (data) {
                showSuccessMessage('Crop has been updated successfully');
                loadAllCrops();
                navigateToPage('#crop-page');
                setCropCode();
                clearCropFields();
            } else {
                showErrorMessage('Failed to update the crop');
            }
        }
    });
});

// Delete crop
$('#tbl-crop').on('click', '.btn-crop-delete', function () {
    const cropCode = $(this).closest('tr').find('td:eq(0) .action_label').text().trim();

    Swal.fire({
        title: "Are you sure you want to delete this Crop?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#3085d6",
        confirmButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            deleteCrop(cropCode);
        }
    });
});

// Helper Functions
function setCropCode() {
    $.ajax({
        method: 'GET',
        url: 'http://localhost:8080/api/v1/crop/id',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (cropCode) {
            $('#txt-crop-code').val(cropCode);
        }
    });
}

function clearCropFields() {
    $('#txt-crop-code').val('');
    $('#txt-crop-common-name').val('');
    $('#txt-crop-scientific-name').val('');
    $('#file-crop-image').val('');
    $('#preview-crop-image').attr('src', '../assets/img/no-image-img.jpg');
    $('#txt-crop-category').val('');
    $('#txt-crop-season').val('');
    $('#txt-crop-field').val('');
    setCropCode();
}

function loadAllCrops() {
    $.ajax({
        method: 'GET',
        url: 'http://localhost:8080/api/v1/crop/all',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (crops) {
            populateCropTable(crops);
        }
    });
}

function populateCropTable(crops) {
    const tbody = $('#tbl-crop tbody');
    tbody.empty();

    crops.forEach(crop => {
        const row = `
            <tr>
                <td><label class="action_label">${crop.crop_code}</label></td>
                <td><label>${crop.common_name}</label></td>
                <td><label>${crop.scientific_name}</label></td>
                <td><img src="${crop.image}" alt="Crop" style="width: 50px; height: 50px;"></td>
                <td><label>${crop.category}</label></td>
                <td><label>${crop.season}</label></td>
                <td><label>${crop.field}</label></td>
                <td>
                    <div class="action-label">
                        <a class="btn btn-warning btn-crop-update">
                            <img src="../assets/img/edit.png" alt="edit" style="width: 20px; height: 20px;"/>
                        </a>
                        <a class="btn btn-danger btn-crop-delete">
                            <img src="../assets/img/remove.png" alt="delete" style="width: 20px; height: 20px;"/>
                        </a>
                    </div>
                </td>
            </tr>`;
        tbody.append(row);
    });
}

function validateCrop() {
    const fields = [
        { id: '#txt-crop-code', message: 'Crop code is required' },
        { id: '#txt-crop-common-name', message: 'Common name is required' },
        { id: '#txt-crop-scientific-name', message: 'Scientific name is required' },
        { id: '#txt-crop-category', message: 'Category is required' },
        { id: '#txt-crop-season', message: 'Season is required' },
        { id: '#txt-crop-field', message: 'Field is required' }
    ];

    for (const field of fields) {
        const value = $(field.id).val()?.trim();
        if (!value) {
            showErrorMessage(field.message);
            return false;
        }
    }

    return true;
}

// Image handling
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

function getImageData() {
    const preview = document.getElementById('preview-crop-image');
    return preview.src;
}

// Utility functions
function showSuccessMessage(message) {
    Swal.fire({
        position: "top-end",
        icon: "success",
        title: message,
        showConfirmButton: false,
        timer: 1500
    });
}

function showErrorMessage(message) {
    Swal.fire({
        position: "top-end",
        icon: "error",
        title: message,
        showConfirmButton: false,
        timer: 1500
    });
}

function deleteCrop(cropCode) {
    $.ajax({
        method: 'DELETE',
        url: `http://localhost:8080/api/v1/crop?crop_code=${cropCode}`,
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (response) {
            if (response === true) {
                showSuccessMessage('Crop has been deleted successfully');
                loadAllCrops();
            } else {
                showErrorMessage('Failed to delete the crop');
            }
        }
    });
}

function populateCropFields(crop) {
    $('#txt-crop-code').val(crop.crop_code);
    $('#txt-crop-common-name').val(crop.common_name);
    $('#txt-crop-scientific-name').val(crop.scientific_name);
    $('#preview-crop-image').attr('src', crop.image);
    $('#txt-crop-category').val(crop.category);
    $('#txt-crop-season').val(crop.season);
    $('#txt-crop-field').val(crop.field);
}

// Initialize
$(document).ready(function() {
    loadAllCrops();
    setCropCode();

    // Register button handler
    $('#btn-register-crop').click(function() {
        navigateToPage('#crop-register-page');
        clearCropFields();
    });

    // Clear button handler
    $('#btn-crop-clear').click(function() {
        clearCropFields();
    });
});


///////////////////////////////////////////////////////////////////////////////////
// ... (previous code remains the same until clearCropFields function)

function clearCropFields() {
    // Fix the crop code selector (remove the # since it's already in the ID)
    $('#\\#txt-crop-code').val('');  // Escape the # in the ID
    $('#txt-crop-common-name').val('');
    $('#txt-crop-scientific-name').val('');
    $('#file-crop-image').val('');
    $('#preview-crop-image').attr('src', '../assets/img/no-image-img.jpg');
    $('#txt-crop-category').val('');
    $('#txt-crop-season').val('');
    $('#txt-crop-field').val('');

    // Reset the button states
    $('#btn-crop-update').css('display', 'none');
    $('#btn-crop-save').css('display', 'block');

    // Get new crop code after clearing
    setCropCode();
}

// Clear button handler
$('#btn-crop-clear').click(function() {
    clearCropFields();
});

// Similarly, update other functions that reference the crop code field
function setCropCode() {
    $.ajax({
        method: 'GET',
        url: 'http://localhost:8080/api/v1/crop/id',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (cropCode) {
            $('#\\#txt-crop-code').val(cropCode);
        }
    });
}

// Update the validation function as well
function validateCrop() {
    const fields = [
        { id: '#\\#txt-crop-code', message: 'Crop code is required' },
        { id: '#txt-crop-common-name', message: 'Common name is required' },
        { id: '#txt-crop-scientific-name', message: 'Scientific name is required' },
        { id: '#txt-crop-category', message: 'Category is required' },
        { id: '#txt-crop-season', message: 'Season is required' },
        { id: '#txt-crop-field', message: 'Field is required' }
    ];

    for (const field of fields) {
        const value = $(field.id).val()?.trim();
        if (!value) {
            showErrorMessage(field.message);
            return false;
        }
    }

    return true;
}

// Update the save function
$('#btn-crop-save').click(function () {
    if (!validateCrop()) {
        return;
    }

    const crop = {
        crop_code: $('#\\#txt-crop-code').val(),
        common_name: $('#txt-crop-common-name').val(),
        scientific_name: $('#txt-crop-scientific-name').val(),
        image: getImageData(),
        category: $('#txt-crop-category').val(),
        season: $('#txt-crop-season').val(),
        field: $('#txt-crop-field').val()
    };

    // ... rest of the save function remains the same
});

// Update the populateCropFields function
function populateCropFields(crop) {
    $('#\\#txt-crop-code').val(crop.crop_code);
    $('#txt-crop-common-name').val(crop.common_name);
    $('#txt-crop-scientific-name').val(crop.scientific_name);
    $('#preview-crop-image').attr('src', crop.image);
    $('#txt-crop-category').val(crop.category);
    $('#txt-crop-season').val(crop.season);
    $('#txt-crop-field').val(crop.field);
}

// ... (rest of the code remains the same)