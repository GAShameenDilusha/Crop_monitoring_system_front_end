
// Row click event to open modal and populate it with staff data
$(document).on("click", ".equip-row", function () {
    const equipData = $(this).data("equip");
    populateEquipModal(equipData);
    console.log(equipData)
    $("#equipmentDetailModal").modal("show");
});

document.getElementById('equipmentStatusFilter').addEventListener('change', function() {
    const filter = this.value;
    const rows = document.querySelectorAll('#equipmentTableBody tr');

    rows.forEach(row => {
        const status = row.getAttribute('data-status');
        row.style.display = (filter === 'all' || filter === status) ? '' : 'none';
    });
});

document.getElementById('equipmentSearch').addEventListener('input', function() {
    const searchQuery = this.value.toLowerCase();
    const rows = document.querySelectorAll('#equipmentTableBody tr');

    rows.forEach(row => {
        const name = row.cells[0].textContent.toLowerCase();  // Equipment Name column
        const type = row.cells[1].textContent.toLowerCase();  // Equipment Type column

        row.style.display = (name.includes(searchQuery) || type.includes(searchQuery)) ? '' : 'none';
    });
});


$("#addNewEquipment").click(function () {
    fetchFieldsForEquipments()
    fetchStaffForEquipment()

})

function fetchFieldsForEquipments() {
    $.ajax({
        url: "http://localhost:8080/greenShadow/api/v1/fields", // Update with your actual endpoint
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (response) {
            // Assuming response is an array of FieldDto objects
            const fieldSelect = $("#newAssignedField");
            fieldSelect.empty(); // Clear existing options
            fieldSelect.append('<option value="">Select Field</option>'); // Add default option

            // Populate the select element with field names and IDs
            response.forEach(field => {
                const option = `<option value="${field.fieldId}">${field.name}</option>`;
                fieldSelect.append(option);
            });
        },
        error: function (error) {
            console.error("Error fetching fields:", error);
            showAlert("Failed to load fields. Please try again later.",'error');
        }
    });
}
function fetchStaffForEquipment(){
    $.ajax({
        url: "http://localhost:8080/greenShadow/api/v1/staffs", // Update with your actual endpoint
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (staffList) {
            // Assuming response is an array of FieldDto objects
            const staffSelect = $("#newAssignedStaff");
            staffSelect.empty();
            staffSelect.append('<option value="">Select Staff</option>'); // Default option

            // Populate the select element with fetched staff and pre-select assigned ones
            staffList.forEach(staff => {

                const option = `<option value="${staff.staffId}">${staff.firstName}</option>`;
                staffSelect.append(option);
            });
        },
        error: function (error) {
            console.error("Error fetching Staff:", error);
            showAlert("Failed to load staff. Please try again later.",'error');
        }
    });
}

// Event listener for the Save Equipment button
$("#saveEquipmentBtn").on("click", function () {
    // Gather data from the form fields
    const equipmentDto = {
        name: $("#newEquipmentName").val(),
        type: $("#newEquipmentType").val(),
        status: $("#newEquipmentStatus").val(),
        staffId: $("#newAssignedStaff").val(), // Ensure this matches your backend field name
        fieldId: $("#newAssignedField").val(), // Ensure this matches your backend field name
        remarks: $("#newEquipmentRemarks").val()
    };
    console.log(equipmentDto)

    // Validate form data (optional but recommended)
    if (!equipmentDto.name || !equipmentDto.type || !equipmentDto.status) {
        alert("Please fill in all the required fields.");
        return;
    }

    // Send the AJAX POST request
    $.ajax({
        url: "http://localhost:8080/greenShadow/api/v1/equipments", // Adjust the endpoint as necessary
        type: "POST",
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"), // Include JWT if required
        },
        data: JSON.stringify(equipmentDto),
        success: function (response) {
            showAlert("Equipment saved successfully!",'success');
            console.log("Equipment created:", response);

            // Close the modal
            $("#addEquipmentModal").modal("hide");

            // Optionally, reset the form fields
            $("#addEquipmentForm")[0].reset();
            fetchEquipmentData()

            // Optionally, refresh the equipment list or table
            //loadEquipmentList(); // Implement this function if needed
        },
        error: function (xhr) {
            console.error("Error saving equipment:", xhr.responseText);
            showAlert("Failed to save equipment. Please try again.",'error');
        }
    });
});

function fetchEquipmentData() {
    $.ajax({
        url: "http://localhost:8080/greenShadow/api/v1/equipments",
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (response) {
            const tableBody = $("#equipmentTableBody");
            tableBody.empty(); // Clear existing rows

            if (response && response.length > 0) {
                $(".no-data").hide(); // Hide the no-data placeholder
                $(".equipment-container").show(); // Show the table container

                // Populate the table with vehicle data
                response.forEach(equip => {
                    const fieldName = getField(equip.fieldId)
                    const staffName = getStaff(equip.staffId)
                    const row = `
                        <tr class="equip-row" data-status="${equip.status.toLowerCase()}">
                            <td>${equip.name}</td>
                            <td>${equip.type}</td>
                            <td>${equip.status}</td>
                            <td>${staffName}</td>
                            <td>${fieldName}</td>
                        </tr>
                    `;
                    const $row = $(row);
                    $row.data("equip", equip); // Attach the staff object to the row
                    tableBody.append($row);

                });

            } else {
                $(".equipment-container").hide(); // Hide the table container
                $(".no-data").show(); // Show the no-data placeholder
            }
        },
        error: function (xhr) {
            console.error("Error fetching vehicle data:", xhr.responseText);
            alert("Failed to load vehicle data. Please try again.");
        }
    });
}

function getField(fieldId) {
    let fieldName = "N/A";

    $.ajax({
        url: `http://localhost:8080/greenShadow/api/v1/fields/${fieldId}`,
        type: "GET",
        async: false,
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"),
        },
        success: function (response) {
            fieldName = response.name || "N/A";
        },
        error: function (xhr) {
            console.error("Error fetching field name:", xhr.responseText);
        }
    });
   console.log(fieldName)
    return fieldName;
}
function getStaff(staffId) {
    let staffName = "N/A"; // Default value in case the staff is not found

    $.ajax({
        url: `http://localhost:8080/greenShadow/api/v1/staffs/${staffId}`,
        type: "GET",
        async: false,
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"),
        },
        success: function (response) {
            staffName = response.firstName +" "+response.lastName|| "N/A";
        },
        error: function (xhr) {
            console.error("Error fetching staff name:", xhr.responseText);
        }
    });
   console.log(staffName)
    return staffName;
}
function   populateEquipModal(equipData){
    // Populate Equipment ID
    $("#equipmentId").val(equipData.equipmentId || "N/A");

    // Populate Equipment Name
    $("#equipmentName").val(equipData.name || "N/A");

    // Populate Equipment Type
    $("#equipmentType").val(equipData.type || "N/A");

    // Populate Equipment Status
    $("#equipmentStatus").val(equipData.status || "N/A");

    // Fetch and populate Assigned Staff Name
    const staffName = equipData.staffId ? getStaff(equipData.staffId) : "N/A";
    $("#EqAssignedStaff").val(staffName);

    // Fetch and populate Assigned Field Name
    const fieldName = equipData.fieldId ? getField(equipData.fieldId) : "N/A";
    $("#assignedField").val(fieldName);

    // Populate Remarks
    $("#equipmentRemarks").val(equipData.remarks || "N/A");

}
function changeVehicleModalData(){
    // Change the modal header to "Update Member"
    document.getElementById('addEquipmentModalLabel').innerText = 'Add Equipment';

    // Change the button text from "Add Staff" to "Save Changes"
    // Hide the "Add Field" button
    document.getElementById("saveEquipmentBtn").style.display = "inline-block";
    // Show the "Save Changes" button
    document.getElementById("equipSaveBtn").style.display = "none";

}
function toggleEquipmentEditMode() {
    const  equipId = $("#equipmentId").val()
    // Close the staffDetailModal
    $('#equipmentDetailModal').modal('hide');

    // Open the addStaffModal
    $('#addEquipmentModal').modal('show');
    fetchStaffForEquipment()
    fetchFieldsForEquipments()
    populateEquipData(equipId);



}
var equipmentId;
function populateEquipData(equipId){
    equipmentId = equipId;
    $.ajax({
        url: `http://localhost:8080/greenShadow/api/v1/equipments/${equipId}`, // Replace with your API endpoint
        method: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (data) {
            console.log(data)
            $("#newEquipmentName").val(data.name)
            $("#newEquipmentType").val(data.type)
            $("#newEquipmentStatus").val(data.status)
            $("#newAssignedStaff").val(data.staffId)
            $("#newAssignedField").val(data.fieldId)
            $("#newEquipmentRemarks").val(data.remarks)

            // Change the modal header to "Update Member"
            document.getElementById('addEquipmentModalLabel').innerText = 'Update Equipment';

            // Hide the "Add Field" button
            document.getElementById("saveEquipmentBtn").style.display = "none";
            // Show the "Save Changes" button
            document.getElementById("equipSaveBtn").style.display = "inline-block";
        },
        error: function () {
            alert("Failed to load Equipment details. Please try again.");
        }
    });
}

$("#equipSaveBtn").click(function (){
    const equipmentDto = {
        name: $("#newEquipmentName").val(),
        type: $("#newEquipmentType").val(),
        status: $("#newEquipmentStatus").val(),
        staffId: $("#newAssignedStaff").val(), // Ensure this matches your backend field name
        fieldId: $("#newAssignedField").val(), // Ensure this matches your backend field name
        remarks: $("#newEquipmentRemarks").val()
    };
    console.log(equipmentDto)

    // Validate form data (optional but recommended)
    if (!equipmentDto.name || !equipmentDto.type || !equipmentDto.status) {
        alert("Please fill in all the required fields.");
        return;
    }

    // Send the AJAX POST request
    $.ajax({
        url: `http://localhost:8080/greenShadow/api/v1/equipments/${equipmentId}`, // Adjust the endpoint as necessary
        type: "PUT",
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"), // Include JWT if required
        },
        data: JSON.stringify(equipmentDto),
        success: function (response) {
            showAlert("Equipment Updated successfully!",'success');
            console.log("Equipment updated:", response);

            // Close the modal
            $("#addEquipmentModal").modal("hide");

            // Optionally, reset the form fields
            $("#addEquipmentForm")[0].reset();

            fetchEquipmentData()
        },
        error: function (xhr) {
            console.error("Error updating equipment:", xhr.responseText);
            showAlert("Failed to update equipment. Please try again.",'error');
        }
    });
})

$("#deleteEquipmentBtn").click(function () {
    const equipId = $("#equipmentId").val(); // Assuming a hidden input or other source for field ID.

    if (!equipId) {
        Swal.fire({
            icon: 'error',
            title: 'Equipment ID is missing!',
            text: 'Cannot delete the Equipment.',
            confirmButtonText: 'OK'
        });
        return;
    }
    if (equipId){
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            text: 'This action cannot be undone.',
            showCancelButton: true,
            confirmButtonColor: "green",
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                // Proceed with the deletion action
                $.ajax({
                    url: `http://localhost:8080/greenShadow/api/v1/equipments/${equipId}`, // Your delete endpoint
                    type: "DELETE",
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token") // Include JWT in Authorization header
                    },
                    success: function (response) {
                        // Perform actions on successful deletion
                        showAlert("Equipment deleted successfully.", "success");
                        $("#equipmentDetailModal").modal("hide"); // Hide the modal

                        fetchEquipmentData()
                        fetchLogs()
                        fetchVehicleData()

                    },
                    error: function (xhr, status, error) {
                        // Handle errors
                        if (xhr.status === 404) {
                            showAlert("member not found.", "error");
                        } else if (xhr.status === 400) {
                            showAlert("Invalid member ID.", "error");
                        } else {
                            showAlert("Error deleting Equipment. Please try again.", "error");
                        }
                    }
                });
            }
        });
    }




});




