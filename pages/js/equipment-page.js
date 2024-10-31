$('#btn-equipment-update').css('display', 'none');

/*save equipment*/
$('#btn-equipment-save').click(function () {
    if (!validateEquipment()) {
        return;
    }

    const equipment = {
        equipment_id: $('#txt-equipment-id').val(),
        name: $('#txt-equipment-name').val(),
        type: $('#txt-equipment-type').val(),
        status: $('#txt-equipment-status').val(),
        assigned_staff: $('#txt-assigned-staff').val(),
        assigned_field: $('#txt-assigned-field').val()
    };

    $.ajax({
        method: 'POST',
        url: 'http://localhost:8080/api/v1/equipment',
        contentType: 'application/json',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        data: JSON.stringify(equipment),
        success: function (data) {
            if (data) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Equipment has been saved successfully",
                    showConfirmButton: false,
                    timer: 1500
                });
                loadAllEquipment();
                setEquipmentId();
                clearEquipmentFields();
            } else {
                alert('Failed to save the equipment');
            }
        }
    });
});

/*update equipment*/
$('#tbl-equipment').on('click', '.btn-equipment-update', function () {
    const equipmentId = $(this).closest('tr').find('td:eq(0) .action_label').text().trim();

    $.ajax({
        method: 'GET',
        url: `http://localhost:8080/api/v1/equipment?equipment_id=${equipmentId}`,
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (equipment) {
            $('#txt-equipment-id').val(equipment.equipment_id);
            $('#txt-equipment-name').val(equipment.name);
            $('#txt-equipment-type').val(equipment.type);
            $('#txt-equipment-status').val(equipment.status);
            $('#txt-assigned-staff').val(equipment.assigned_staff);
            $('#txt-assigned-field').val(equipment.assigned_field);
            $('#btn-equipment-update').css('display', 'block');
            $('#btn-equipment-save').css('display', 'none');
            navigateToPage('#equipment-register-page');
        }
    });
});

$('#btn-equipment-update').click(function () {
    if (!validateEquipment()) {
        return;
    }

    const equipment = {
        equipment_id: $('#txt-equipment-id').val(),
        name: $('#txt-equipment-name').val(),
        type: $('#txt-equipment-type').val(),
        status: $('#txt-equipment-status').val(),
        assigned_staff: $('#txt-assigned-staff').val(),
        assigned_field: $('#txt-assigned-field').val()
    };

    $.ajax({
        method: 'PUT',
        url: 'http://localhost:8080/api/v1/equipment',
        contentType: 'application/json',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        data: JSON.stringify(equipment),
        success: function (data) {
            if (data) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Equipment has been updated successfully",
                    showConfirmButton: false,
                    timer: 1500
                });
                loadAllEquipment();
                navigateToPage('#equipment-page');
                setEquipmentId();
                clearEquipmentFields();
            } else {
                alert('Failed to update the equipment');
            }
        }
    });
});

/*delete equipment*/
$('#tbl-equipment').on('click', '.btn-equipment-delete', function () {
    const equipmentId = $(this).closest('tr').find('td:eq(0) .action_label').text().trim();

    Swal.fire({
        title: "Are you sure you want to delete this Equipment?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#3085d6",
        confirmButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                method: 'DELETE',
                url: `http://localhost:8080/api/v1/equipment?equipment_id=${equipmentId}`,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                success: function (response) {
                    if (response === true) {
                        loadAllEquipment();
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your Equipment has been deleted.",
                            icon: "success"
                        });
                    } else {
                        Swal.fire({
                            title: "Error!",
                            text: "Your Equipment has not been deleted.",
                            icon: "error"
                        });
                    }
                }
            });
        }
    });
});

/*set equipment id*/
function setEquipmentId() {
    $.ajax({
        method: 'GET',
        url: 'http://localhost:8080/api/v1/equipment/id',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (equipmentId) {
            $('#txt-equipment-id').val(equipmentId);
        }
    });
}

/*clear equipment fields*/
function clearEquipmentFields() {
    $('#txt-equipment-id').val('');
    setEquipmentId();
    $('#txt-equipment-name').val('');
    $('#txt-equipment-type').val('');
    $('#txt-equipment-status').val('');
    $('#txt-assigned-staff').val('');
    $('#txt-assigned-field').val('');
}

/*load all equipment*/
function loadAllEquipment() {
    $.ajax({
        method: 'GET',
        url: 'http://localhost:8080/api/v1/equipment/all',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (equipmentList) {
            $('#tbl-equipment tbody tr').remove();
            for (let equipment of equipmentList) {
                let row = `
                    <tr>
                        <td>
                            <label class="action_label">${equipment.equipment_id}</label>
                        </td>
                        <td>
                            <label>${equipment.name}</label>
                        </td>
                        <td>
                            <label>${equipment.type}</label>
                        </td>
                        <td>
                            <label>${equipment.status}</label>
                        </td>
                        <td>
                            <label>${equipment.assigned_staff}</label>
                        </td>
                        <td>
                            <label>${equipment.assigned_field}</label>
                        </td>
                        <td>
                            <div class="action-label">
                                <a class="btn btn-warning btn-equipment-update">
                                    <img src="../assets/img/edit.png" alt="edit" style="width: 20px; height: 20px;"/>
                                </a>
                                <a class="btn btn-danger btn-equipment-delete">
                                    <img src="../assets/img/remove.png" alt="delete" style="width: 20px; height: 20px;"/>
                                </a>
                            </div>
                        </td>
                    </tr>`;
                $('#tbl-equipment tbody').append(row);
            }
        }
    });
}

function validateEquipment() {
    const showError = (message) => {
        Swal.fire({
            position: "top-end",
            icon: "error",
            title: message,
            showConfirmButton: false,
            timer: 1500
        });
    };

    let equipmentId = $('#txt-equipment-id').val().trim();
    if (!equipmentId) {
        showError("Equipment ID is required");
        return false;
    }

    let name = $('#txt-equipment-name').val().trim();
    if (!name) {
        showError("Equipment name is required");
        return false;
    }

    let type = $('#txt-equipment-type').val();
    if (!type) {
        showError("Please select an equipment type");
        return false;
    }

    let status = $('#txt-equipment-status').val();
    if (!status) {
        showError("Please select a status");
        return false;
    }

    let assignedStaff = $('#txt-assigned-staff').val();
    if (!assignedStaff) {
        showError("Assigned staff details are required");
        return false;
    }

    let assignedField = $('#txt-assigned-field').val();
    if (!assignedField) {
        showError("Assigned field details are required");
        return false;
    }

    return true;
}

function changeEquipmentFiles() {
    $('#btn-equipment-update').css('display', 'none');
    $('#btn-equipment-save').css('display', 'block');
    clearEquipmentFields();
}