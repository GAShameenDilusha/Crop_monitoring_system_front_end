$(document).ready(function () {
    // Hide the update button by default
    $('#btn-equipment-update').hide();

    // Save Equipment
    $('#btn-equipment-save').click(function () {
        if (!validateEquipment()) return;

        const equipment = {
            equipment_id: $('#txt-equipment-code').val(),
            name: $('#txt-equipment-name').val(),
            type: $('#txt-equipment-type').val(),
            status: $('#txt-equipment-status').val(),
            assigned_staff: $('#txt-assigned-staff').val(),
            assigned_field: $('#txt-assigned-field').val(),
        };

        $.ajax({
            method: 'POST',
            url: 'http://localhost:8080/api/v1/equipment',
            contentType: 'application/json',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            data: JSON.stringify(equipment),
            success: function (response) {
                if (response) {
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Equipment saved successfully",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    loadAllEquipment();
                    setEquipmentId();
                    clearEquipmentFields();
                } else {
                    alert("Failed to save the equipment");
                }
            },
        });
    });

    // Load equipment for update
    $('#tbl-equipment').on('click', '.btn-equipment-update', function () {
        const equipmentId = $(this).closest('tr').find('td:eq(0) .action_label').text().trim();

        $.ajax({
            method: 'GET',
            url: `http://localhost:8080/api/v1/equipment?equipment_id=${equipmentId}`,
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            success: function (equipment) {
                $('#txt-equipment-code').val(equipment.equipment_id);
                $('#txt-equipment-name').val(equipment.name);
                $('#txt-equipment-type').val(equipment.type);
                $('#txt-equipment-status').val(equipment.status);
                $('#txt-assigned-staff').val(equipment.assigned_staff);
                $('#txt-assigned-field').val(equipment.assigned_field);
                $('#btn-equipment-update').show();
                $('#btn-equipment-save').hide();
                navigateToPage('#equipment-register-page');
            },
        });
    });

    // Update equipment
    $('#btn-equipment-update').click(function () {
        if (!validateEquipment()) return;

        const equipment = {
            equipment_id: $('#txt-equipment-code').val(),
            name: $('#txt-equipment-name').val(),
            type: $('#txt-equipment-type').val(),
            status: $('#txt-equipment-status').val(),
            assigned_staff: $('#txt-assigned-staff').val(),
            assigned_field: $('#txt-assigned-field').val(),
        };

        $.ajax({
            method: 'PUT',
            url: 'http://localhost:8080/api/v1/equipment',
            contentType: 'application/json',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            data: JSON.stringify(equipment),
            success: function (response) {
                if (response) {
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Equipment updated successfully",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    loadAllEquipment();
                    navigateToPage('#equipment-page');
                    setEquipmentId();
                    clearEquipmentFields();
                } else {
                    alert("Failed to update the equipment");
                }
            },
        });
    });

    // Delete equipment
    $('#tbl-equipment').on('click', '.btn-equipment-delete', function () {
        const equipmentId = $(this).closest('tr').find('td:eq(0) .action_label').text().trim();

        Swal.fire({
            title: "Are you sure you want to delete this equipment?",
            icon: "warning",
            showCancelButton: true,
            cancelButtonColor: "#3085d6",
            confirmButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    method: 'DELETE',
                    url: `http://localhost:8080/api/v1/equipment?equipment_id=${equipmentId}`,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    success: function (response) {
                        if (response) {
                            loadAllEquipment();
                            Swal.fire("Deleted!", "Your equipment has been deleted.", "success");
                        } else {
                            Swal.fire("Error!", "Your equipment could not be deleted.", "error");
                        }
                    },
                });
            }
        });
    });

    // Set new equipment ID
    function setEquipmentId() {
        $.ajax({
            method: 'GET',
            url: 'http://localhost:8080/api/v1/equipment/id',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            success: function (equipmentId) {
                $('#txt-equipment-code').val(equipmentId);
            },
        });
    }

    // Load all equipment
    function loadAllEquipment() {
        $.ajax({
            method: 'GET',
            url: 'http://localhost:8080/api/v1/equipment/all',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            success: function (equipmentList) {
                const tbody = $('#tbl-equipment tbody');
                tbody.empty();
                for (let equipment of equipmentList) {
                    const row = `
                        <tr>
                            <td><label class="action_label">${equipment.equipment_id}</label></td>
                            <td><label>${equipment.name}</label></td>
                            <td><label>${equipment.type}</label></td>
                            <td><label>${equipment.status}</label></td>
                            <td><label>${equipment.assigned_staff}</label></td>
                            <td><label>${equipment.assigned_field}</label></td>
                            <td>
                                <div class="action-label">
                                    <a class="btn btn-warning btn-equipment-update">
                                        <img src="../assets/img/edit.png" alt="edit" style="width: 20px;"/>
                                    </a>
                                    <a class="btn btn-danger btn-equipment-delete">
                                        <img src="../assets/img/remove.png" alt="delete" style="width: 20px;"/>
                                    </a>
                                </div>
                            </td>
                        </tr>`;
                    tbody.append(row);
                }
            },
        });
    }

    // Clear input fields
    function clearEquipmentFields() {
        $('#txt-equipment-code').val('');
        setEquipmentId();
        $('#txt-equipment-name').val('');
        $('#txt-equipment-type').val('');
        $('#txt-equipment-status').val('');
        $('#txt-assigned-staff').val('');
        $('#txt-assigned-field').val('');
    }

    // Validate equipment fields
    function validateEquipment() {
        const showError = (message) => {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: message,
                showConfirmButton: false,
                timer: 1500,
            });
        };

        if (!$('#txt-equipment-code').val().trim()) return showError("Equipment ID is required"), false;
        if (!$('#txt-equipment-name').val().trim()) return showError("Equipment name is required"), false;
        if (!$('#txt-equipment-type').val()) return showError("Equipment type is required"), false;
        if (!$('#txt-equipment-status').val()) return showError("Status is required"), false;
        if (!$('#txt-assigned-staff').val()) return showError("Assigned staff details are required"), false;
        if (!$('#txt-assigned-field').val()) return showError("Assigned field details are required"), false;

        return true;
    }
});



//////////////////////////////////////
$(document).ready(function () {
    console.log("Document ready: Initializing equipment management script...");

    // Hide the update button by default
    $('#btn-equipment-update').hide();

    // Save Equipment
    $('#btn-equipment-save').click(function () {
        if (!validateEquipment()) return;

        const equipment = {
            equipment_id: $('#txt-equipment-code').val(),
            name: $('#txt-equipment-name').val(),
            type: $('#txt-equipment-type').val(),
            status: $('#txt-equipment-status').val(),
            assigned_staff: $('#txt-assigned-staff').val(),
            assigned_field: $('#txt-assigned-field').val(),
        };

        console.log("Saving equipment:", equipment);

        $.ajax({
            method: 'POST',
            url: 'http://localhost:8080/api/v1/equipment',
            contentType: 'application/json',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            data: JSON.stringify(equipment),
            success: function (response) {
                console.log("Save response:", response);
                if (response) {
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Equipment saved successfully",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    loadAllEquipment();
                    setEquipmentId();
                    clearEquipmentFields();
                } else {
                    alert("Failed to save the equipment");
                }
            },
        });
    });

    // Clear input fields
    $(document).on('click', '#btn-equipment-clear', function () {
        console.log("Clear button clicked");
        clearEquipmentFields();
    });

    function clearEquipmentFields() {
        console.log("Clearing equipment fields...");

        $('#txt-equipment-code').val('');
        console.log("Cleared #txt-equipment-code");

        setEquipmentId();
        console.log("Reset equipment ID");

        $('#txt-equipment-name').val('');
        console.log("Cleared #txt-equipment-name");

        $('#txt-equipment-type').val('');
        console.log("Cleared #txt-equipment-type");

        $('#txt-equipment-status').val('');
        console.log("Cleared #txt-equipment-status");

        $('#txt-assigned-staff').val('');
        console.log("Cleared #txt-assigned-staff");

        $('#txt-assigned-field').val('');
        console.log("Cleared #txt-assigned-field");

        console.log("All fields cleared.");
    }

    // Validate equipment fields
    function validateEquipment() {
        const showError = (message) => {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: message,
                showConfirmButton: false,
                timer: 1500,
            });
        };

        console.log("Validating equipment fields...");

        if (!$('#txt-equipment-code').val().trim()) {
            showError("Equipment ID is required");
            return false;
        }
        if (!$('#txt-equipment-name').val().trim()) {
            showError("Equipment name is required");
            return false;
        }
        if (!$('#txt-equipment-type').val()) {
            showError("Equipment type is required");
            return false;
        }
        if (!$('#txt-equipment-status').val()) {
            showError("Status is required");
            return false;
        }
        if (!$('#txt-assigned-staff').val()) {
            showError("Assigned staff details are required");
            return false;
        }
        if (!$('#txt-assigned-field').val()) {
            showError("Assigned field details are required");
            return false;
        }

        console.log("All fields validated successfully.");
        return true;
    }

    // Set new equipment ID
    function setEquipmentId() {
        console.log("Fetching new equipment ID...");
        $.ajax({
            method: 'GET',
            url: 'http://localhost:8080/api/v1/equipment/id',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            success: function (equipmentId) {
                console.log("New equipment ID fetched:", equipmentId);
                $('#txt-equipment-code').val(equipmentId);
            },
        });
    }
});
//////////////////////////////////////////////////////////////////
document.getElementById("btn-equipment-clear").addEventListener("click", function () {
    // Clear all text inputs
    document.getElementById("txt-equipment-code").value = "";
    document.getElementById("txt-equipment-name").value = "";

    // Reset dropdowns to their default options
    document.getElementById("txt-equipment-type").selectedIndex = 0;
    document.getElementById("txt-equipment-status").selectedIndex = 0;
    document.getElementById("txt-assigned-staff").selectedIndex = 0;
    document.getElementById("txt-assigned-field").selectedIndex = 0;

    console.log("All fields in the equipment registration form have been cleared!");
});
