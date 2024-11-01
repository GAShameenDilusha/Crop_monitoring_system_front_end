$('#btn-log-update').css('display', 'none');

/*save log*/
$('#btn-log-save').click(function () {
    if (!validateLog()) {
        return;
    }

    const log = {
        log_code: $('#txt-log-code').val(),
        log_date: $('#txt-log-date').val(),
        log_details: $('#txt-log-details').val(),
        observed_image: $('#file-observed-image').val(),
        field: $('#txt-log-field').val(),
        crop: $('#txt-log-crop').val(),
        staff: $('#txt-log-staff').val()
    };

    $.ajax({
        method: 'POST',
        url: 'http://localhost:8080/api/v1/log',
        contentType: 'application/json',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        data: JSON.stringify(log),
        success: function (data) {
            if (data) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Log has been saved successfully",
                    showConfirmButton: false,
                    timer: 1500
                });
                loadAllLogs();
                setLogCode();
                clearLogFields();
            } else {
                alert('Failed to save the log');
            }
        }
    });
});

/*update log*/
$('#tbl-log').on('click', '.btn-log-update', function () {
    const logCode = $(this).closest('tr').find('td:eq(0) .action_label').text().trim();

    $.ajax({
        method: 'GET',
        url: `http://localhost:8080/api/v1/log?log_code=${logCode}`,
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (log) {
            $('#txt-log-code').val(log.log_code);
            $('#txt-log-date').val(log.log_date);
            $('#txt-log-details').val(log.log_details);
            $('#file-observed-image').val(log.observed_image);
            $('#txt-log-field').val(log.field);
            $('#txt-log-crop').val(log.crop);
            $('#txt-log-staff').val(log.staff);
            $('#btn-log-update').css('display', 'block');
            $('#btn-log-save').css('display', 'none');
            navigateToPage('#log-register-page');
        }
    });
});

$('#btn-log-update').click(function () {
    if (!validateLog()) {
        return;
    }

    const log = {
        log_code: $('#txt-log-code').val(),
        log_date: $('#txt-log-date').val(),
        log_details: $('#txt-log-details').val(),
        observed_image: $('#file-observed-image').val(),
        field: $('#txt-log-field').val(),
        crop: $('#txt-log-crop').val(),
        staff: $('#txt-log-staff').val()
    };

    $.ajax({
        method: 'PUT',
        url: 'http://localhost:8080/api/v1/log',
        contentType: 'application/json',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        data: JSON.stringify(log),
        success: function (data) {
            if (data) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Log has been updated successfully",
                    showConfirmButton: false,
                    timer: 1500
                });
                loadAllLogs();
                navigateToPage('#log-page');
                setLogCode();
                clearLogFields();
            } else {
                alert('Failed to update the log');
            }
        }
    });
});

/*delete log*/
$('#tbl-log').on('click', '.btn-log-delete', function () {
    const logCode = $(this).closest('tr').find('td:eq(0) .action_label').text().trim();

    Swal.fire({
        title: "Are you sure you want to delete this Log?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#3085d6",
        confirmButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                method: 'DELETE',
                url: `http://localhost:8080/api/v1/log?log_code=${logCode}`,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                success: function (response) {
                    if (response === true) {
                        loadAllLogs();
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your Log has been deleted.",
                            icon: "success"
                        });
                    } else {
                        Swal.fire({
                            title: "Error!",
                            text: "Your Log has not been deleted.",
                            icon: "error"
                        });
                    }
                }
            });
        }
    });
});

/*set log code*/
function setLogCode() {
    $.ajax({
        method: 'GET',
        url: 'http://localhost:8080/api/v1/log/id',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (logCode) {
            $('#txt-log-code').val(logCode);
        }
    });
}

/*clear log fields*/
function clearLogFields() {
    $('#txt-log-code').val('');
    setLogCode();
    $('#txt-log-date').val('');
    $('#txt-log-details').val('');
    $('#file-observed-image').val('');
    $('#txt-log-field').val('');
    $('#txt-log-crop').val('');
    $('#txt-log-staff').val('');
}

/*load all logs*/
function loadAllLogs() {
    $.ajax({
        method: 'GET',
        url: 'http://localhost:8080/api/v1/log/all',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (logs) {
            $('#tbl-log tbody tr').remove();
            for (let log of logs) {
                let row = `
                    <tr>
                        <td>
                            <label class="action_label">${log.log_code}</label>
                        </td>
                        <td>
                            <label>${log.log_date}</label>
                        </td>
                        <td>
                            <label>${log.log_details}</label>
                        </td>
                        <td>
                            <label>${log.field}</label>
                        </td>
                        <td>
                            <label>${log.crop}</label>
                        </td>
                        <td>
                            <label>${log.staff}</label>
                        </td>
                        <td>
                            <div class="action-label">
                                <a class="btn btn-warning btn-log-update">
                                    <img src="../assets/img/edit.png" alt="edit" style="width: 20px; height: 20px;"/>
                                </a>
                                <a class="btn btn-danger btn-log-delete">
                                    <img src="../assets/img/remove.png" alt="delete" style="width: 20px; height: 20px;"/>
                                </a>
                            </div>
                        </td>
                    </tr>`;
                $('#tbl-log tbody').append(row);
            }
        }
    });
}

function validateLog() {
    const showError = (message) => {
        Swal.fire({
            position: "top-end",
            icon: "error",
            title: message,
            showConfirmButton: false,
            timer: 1500
        });
    };

    let logCode = $('#txt-log-code').val().trim();
    if (!logCode) {
        showError("Log code is required");
        return false;
    }

    let logDate = $('#txt-log-date').val().trim();
    if (!logDate) {
        showError("Log date is required");
        return false;
    }

    let logDetails = $('#txt-log-details').val().trim();
    if (!logDetails) {
        showError("Log details/observation is required");
        return false;
    }

    let field = $('#txt-log-field').val();
    if (!field) {
        showError("Please select a field");
        return false;
    }

    let crop = $('#txt-log-crop').val();
    if (!crop) {
        showError("Please select a crop");
        return false;
    }

    let staff = $('#txt-log-staff').val();
    if (!staff) {
        showError("Please select a staff member");
        return false;
    }

    return true;
}

function changeLogFiles() {
    $('#btn-log-update').css('display', 'none');
    $('#btn-log-save').css('display', 'block');
    clearLogFields();
}




//////////////////////////////////////////////////
/*image start*/
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

// To get the selected image if needed
function getObservedImage() {
    return document.getElementById('file-observed-image').files[0];
}
/*end*/