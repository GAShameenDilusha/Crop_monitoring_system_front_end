$('#btn-monitoring-log-update').css('display', 'none');

/*save monitoring log*/
$('#btn-log-save').click(function () {
    if (!validateMonitoringLog()) {
        return;
    }

    const monitoringLog = {
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
        data: JSON.stringify(monitoringLog),
        success: function (data) {
            if (data) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Monitoring log has been saved successfully",
                    showConfirmButton: false,
                    timer: 1500
                });
                loadAllMonitoringLogs();
                setMonitoringLogCode();
                clearMonitoringLogFields();
            } else {
                alert('Failed to save the monitoring log');
            }
        }
    });
});

/*update monitoring log*/
$('#tbl-monitoring-log').on('click', '.btn-log-update', function () {
    const logCode = $(this).closest('tr').find('td:eq(0)').text().trim();

    $.ajax({
        method: 'GET',
        url: `http://localhost:8080/api/v1/log?log_code=${logCode}`,
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (monitoringLog) {
            $('#txt-log-code').val(monitoringLog.log_code);
            $('#txt-log-date').val(monitoringLog.log_date);
            $('#txt-log-details').val(monitoringLog.log_details);
            $('#file-observed-image').val(monitoringLog.observed_image);
            $('#txt-log-field').val(monitoringLog.field);
            $('#txt-log-crop').val(monitoringLog.crop);
            $('#txt-log-staff').val(monitoringLog.staff);
            $('#btn-monitoring-log-update').css('display', 'block');
            $('#btn-log-save').css('display', 'none');
            navigateToPage('#monitoring-log-register-page');
        }
    });
});

$('#btn-monitoring-log-update').click(function () {
    if (!validateMonitoringLog()) {
        return;
    }

    const monitoringLog = {
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
        data: JSON.stringify(monitoringLog),
        success: function (data) {
            if (data) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Monitoring log has been updated successfully",
                    showConfirmButton: false,
                    timer: 1500
                });
                loadAllMonitoringLogs();
                navigateToPage('#monitoring-log-page');
                setMonitoringLogCode();
                clearMonitoringLogFields();
            } else {
                alert('Failed to update the monitoring log');
            }
        }
    });
});

/*delete monitoring log*/
$('#tbl-monitoring-log').on('click', '.btn-log-delete', function () {
    const logCode = $(this).closest('tr').find('td:eq(0)').text().trim();

    Swal.fire({
        title: "Are you sure you want to delete this Monitoring Log?",
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
                        loadAllMonitoringLogs();
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your Monitoring Log has been deleted.",
                            icon: "success"
                        });
                    } else {
                        Swal.fire({
                            title: "Error!",
                            text: "Your Monitoring Log has not been deleted.",
                            icon: "error"
                        });
                    }
                }
            });
        }
    });
});

/*set monitoring log code*/
function setMonitoringLogCode() {
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

/*clear monitoring log fields*/
/*function clearMonitoringLogFields() {
    $('#txt-log-code').val('');
    setMonitoringLogCode();
    $('#txt-log-date').val('');
    $('#txt-log-details').val('');
    $('#file-observed-image').val('');
    $('#preview-observed-image').attr('src', '../assets/img/no-image-img.jpg');
    $('#txt-log-field').val('');
    $('#txt-log-crop').val('');
    $('#txt-log-staff').val('');
}*/

/*load all monitoring logs*/
function loadAllMonitoringLogs() {
    $.ajax({
        method: 'GET',
        url: 'http://localhost:8080/api/v1/log/all',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (logs) {
            $('#tbl-monitoring-log tbody tr').remove();
            logs.forEach(log => {
                const row = `
                    <tr>
                        <td>${log.log_code}</td>
                        <td>${log.log_date}</td>
                        <td>${log.log_details}</td>
                        <td>
                            <img src="${log.observed_image}" alt="Observed Image" 
                                style="max-width: 100px; max-height: 100px;">
                        </td>
                        <td>${log.field}</td>
                        <td>${log.crop}</td>
                        <td>${log.staff}</td>
                        <td>
                            <div class="action-label">
                                <button class="btn btn-warning btn-log-update">
                                    <img src="../assets/img/edit.png" alt="edit" style="width: 20px; height: 20px;"/>
                                </button>
                                <button class="btn btn-danger btn-log-delete">
                                    <img src="../assets/img/remove.png" alt="delete" style="width: 20px; height: 20px;"/>
                                </button>
                            </div>
                        </td>
                    </tr>`;
                $('#tbl-monitoring-log tbody').append(row);
            });
        }
    });
}

function validateMonitoringLog() {
    const showError = (message) => {
        Swal.fire({
            position: "top-end",
            icon: "error",
            title: message,
            showConfirmButton: false,
            timer: 1500
        });
    };

    const logCode = $('#txt-log-code').val().trim();
    if (!logCode) {
        showError("Log code is required");
        return false;
    }

    const logDate = $('#txt-log-date').val().trim();
    if (!logDate) {
        showError("Log date is required");
        return false;
    }

    const logDetails = $('#txt-log-details').val().trim();
    if (!logDetails) {
        showError("Log details/observation is required");
        return false;
    }

    const field = $('#txt-log-field').val();
    if (!field) {
        showError("Please select a field");
        return false;
    }

    const crop = $('#txt-log-crop').val();
    if (!crop) {
        showError("Please select a crop");
        return false;
    }

    const staff = $('#txt-log-staff').val();
    if (!staff) {
        showError("Please select a staff member");
        return false;
    }

    return true;
}

// Event handler for register monitoring log button
$('#btn-register-monitoring-log').click(function() {
    navigateToPage('#monitoring-log-register-page');
    $('#btn-monitoring-log-update').css('display', 'none');
    $('#btn-log-save').css('display', 'block');
    clearMonitoringLogFields();
});

// Event handler for monitoring log home button
$('#btn-monitoring-log-home').click(function() {
    navigateToPage('#monitoring-log-page');
});

// Image preview functionality
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

// Initialize the page
$(document).ready(function() {
    setMonitoringLogCode();
    loadAllMonitoringLogs();
});


//////////////////////////////////////////////////////////
function clearMonitoringLogFields() {
    $('#txt-log-code').val(''); // Clear the log code field
    setMonitoringLogCode(); // Generate a new log code
    $('#txt-log-date').val(''); // Clear the date field
    $('#txt-log-details').val(''); // Clear the details field
    $('#file-observed-image').val(''); // Reset the file input
    $('#preview-observed-image').attr('src', '../assets/img/no-image-img.jpg'); // Reset the image preview
    $('#txt-log-field').val(''); // Clear the field dropdown
    $('#txt-log-crop').val(''); // Clear the crop dropdown
    $('#txt-log-staff').val(''); // Clear the staff dropdown
}

$('#btn-log-clear').click(function() {
    clearMonitoringLogFields();
});


/* Register monitoring log button */
$('#btn-register-monitoring-log').click(function() {
    navigateToPage('#monitoring-log-register-page');
    $('#btn-monitoring-log-update').css('display', 'none');
    $('#btn-log-save').css('display', 'block');
    clearMonitoringLogFields();
});

/* Load the monitoring log page */
$('#btn-monitoring-log-home').click(function() {
    navigateToPage('#monitoring-log-page');
});

/* Initialize the page */
$(document).ready(function() {
    setMonitoringLogCode();
    loadAllMonitoringLogs();
});
document.getElementById("btn-monitoring log-clear").addEventListener("click", function() {
    // Clear all input fields
    document.getElementById("txt-log-code").value = "";
    document.getElementById("txt-log-date").value = "";
    document.getElementById("txt-log-details").value = "";
    document.getElementById("file-observed-image").value = "";

    // Reset the image preview to default
    document.getElementById("preview-observed-image").src = "../assets/img/no-image-img.jpg";

    // Reset all dropdowns
    document.getElementById("txt-log-field").selectedIndex = 0;
    document.getElementById("txt-log-crop").selectedIndex = 0;
    document.getElementById("txt-log-staff").selectedIndex = 0;
});
