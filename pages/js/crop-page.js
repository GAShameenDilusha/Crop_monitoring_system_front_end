$('#btn-crop-update').css('display', 'none');

/*save crop*/
$('#btn-crop-save').click(function () {
    if (!validateCrop()) {
        return;
    }

    const crop = {
        crop_code: $('#txt-crop-code').val(),
        common_name: $('#txt-crop-common-name').val(),
        scientific_name: $('#txt-crop-scientific-name').val(),
        image: $('#file-crop-image').val(),
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
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Crop has been saved successfully",
                    showConfirmButton: false,
                    timer: 1500
                });
                loadAllCrops();
                setCropCode();
                clearCropFields();
            } else {
                alert('Failed to save the crop');
            }
        }
    });
});

/*update crop*/
$('#tbl-crop').on('click', '.btn-crop-update', function () {
    const cropCode = $(this).closest('tr').find('td:eq(0) .action_label').text().trim();

    $.ajax({
        method: 'GET',
        url: `http://localhost:8080/api/v1/crop?crop_code=${cropCode}`,
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (crop) {
            $('#txt-crop-code').val(crop.crop_code);
            $('#txt-crop-common-name').val(crop.common_name);
            $('#txt-crop-scientific-name').val(crop.scientific_name);
            $('#file-crop-image').val(crop.image);
            $('#txt-crop-category').val(crop.category);
            $('#txt-crop-season').val(crop.season);
            $('#txt-crop-field').val(crop.field);
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
        image: $('#file-crop-image').val(),
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
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Crop has been updated successfully",
                    showConfirmButton: false,
                    timer: 1500
                });
                loadAllCrops();
                navigateToPage('#crop-page');
                setCropCode();
                clearCropFields();
            } else {
                alert('Failed to update the crop');
            }
        }
    });
});

/*delete crop*/
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
            $.ajax({
                method: 'DELETE',
                url: `http://localhost:8080/api/v1/crop?crop_code=${cropCode}`,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                success: function (response) {
                    if (response === true) {
                        loadAllCrops();
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your Crop has been deleted.",
                            icon: "success"
                        });
                    } else {
                        Swal.fire({
                            title: "Error!",
                            text: "Your Crop has not been deleted.",
                            icon: "error"
                        });
                    }
                }
            });
        }
    });
});

/*set crop code*/
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

/*clear crop fields*/
function clearCropFields() {
    $('#txt-crop-code').val('');
    setCropCode();
    $('#txt-crop-common-name').val('');
    $('#txt-crop-scientific-name').val('');
    $('#file-crop-image').val('');
    $('#txt-crop-category').val('');
    $('#txt-crop-season').val('');
    $('#txt-crop-field').val('');
}

/*load all crops*/
function loadAllCrops() {
    $.ajax({
        method: 'GET',
        url: 'http://localhost:8080/api/v1/crop/all',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (crops) {
            $('#tbl-crop tbody tr').remove();
            for (let crop of crops) {
                let row = `
                    <tr>
                        <td>
                            <label class="action_label">${crop.crop_code}</label>
                        </td>
                        <td>
                            <label>${crop.common_name}</label>
                        </td>
                        <td>
                            <label>${crop.scientific_name}</label>
                        </td>
                        <td>
                            <label>${crop.category}</label>
                        </td>
                        <td>
                            <label>${crop.season}</label>
                        </td>
                        <td>
                            <label>${crop.field}</label>
                        </td>
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
                $('#tbl-crop tbody').append(row);
            }
        }
    });
}

function validateCrop() {
    const showError = (message) => {
        Swal.fire({
            position: "top-end",
            icon: "error",
            title: message,
            showConfirmButton: false,
            timer: 1500
        });
    };

    let cropCode = $('#txt-crop-code').val().trim();
    if (!cropCode) {
        showError("Crop code is required");
        return false;
    }

    let commonName = $('#txt-crop-common-name').val().trim();
    if (!commonName) {
        showError("Common name is required");
        return false;
    }

    let scientificName = $('#txt-crop-scientific-name').val().trim();
    if (!scientificName) {
        showError("Scientific name is required");
        return false;
    }

    let category = $('#txt-crop-category').val();
    if (!category) {
        showError("Please select a category");
        return false;
    }

    let season = $('#txt-crop-season').val();
    if (!season) {
        showError("Please select a season");
        return false;
    }

    let field = $('#txt-crop-field').val();
    if (!field) {
        showError("Please select a field");
        return false;
    }

    return true;
}

function changeCropFiles() {
    $('#btn-crop-update').css('display', 'none');
    $('#btn-crop-save').css('display', 'block');
    clearCropFields();
}