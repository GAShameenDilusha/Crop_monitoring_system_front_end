
// Row click event to open modal and populate it with staff data
$(document).on("click", ".staff-row", function () {
    const staffData = $(this).data("staff");
    populateModal(staffData);
    console.log(staffData)
    $("#staffDetailModal").modal("show");
});



function toggleStaffEditMode() {
    const staffId = $("#sId").val(); // Assume the button has a data attribute
    populateStaffDetails(staffId);
    // Close the staffDetailModal
    $('#staffDetailModal').modal('hide');

    // Open the addStaffModal
    $('#addStaffModal').modal('show');

}
function populateStaffDetails(staffId) {
    $.ajax({
        url: `http://localhost:8080/greenShadow/api/v1/staffs/${staffId}`, // Replace with your API endpoint
        method: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (data) {
            // Populate basic fields
            $("#staffId").val(data.staffId);
            $("#firstNameModal").val(data.firstName);
            $("#lastNameModal").val(data.lastName);
            $("#emailModal").val(data.email);
            $("#addressModal").val(data.address);
            $("#contactModal").val(data.contact);
            $("#dobModal").val(data.dob);
            $("#genderModal").val(data.gender);
            $("#roleModal").val(data.role);
            $("#designationModal").val(data.designation);
            $("#joinDateModal").val(data.joinDate);

            // Populate assigned fields dynamically
            populateAssignedFields(data.staffId);
            // Change the modal header to "Update Member"
            document.getElementById('addStaffModalLabel').innerText = 'Update '+data.firstName+' Details';

            // Change the button text from "Add Staff" to "Save Changes"
            // Hide the "Add Field" button
            document.getElementById("addStaffBtn").style.display = "none";
            // Show the "Save Changes" button
            document.getElementById("saveBtn").style.display = "inline-block";
        },
        error: function () {
            alert("Failed to load staff details. Please try again.");
        }
    });
}
function populateAssignedFields(staffId) {
    $.ajax({
        url: `http://localhost:8080/greenShadow/api/v1/fields`, // Fetch all fields
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (allFields) {
            $.ajax({
                url: `http://localhost:8080/greenShadow/api/v1/staffs/${staffId}/field`, // Fetch assigned fields
                type: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                success: function (assignedFields) {
                    const container = $("#assignedFieldsContainer");
                    container.empty(); // Clear existing fields

                    if (assignedFields && assignedFields.length > 0) {
                        // Loop through assigned fields to create one dropdown per assigned field
                        assignedFields.forEach(assignedField => {
                            const fieldElement = `
                                <div class="d-flex align-items-center mb-2">
                                    <select class="form-control glass-input mr-2 fieldForStaff" name="assignedFields[]">
                                        ${allFields.map(field => `
                                            <option value="${field.fieldId}" ${field.fieldId === assignedField.fieldId ? "selected" : ""}>
                                                ${field.name}
                                            </option>
                                        `).join("")}
                                    </select>
                                    <button type="button" class="btn btn-sm custom-btn" onclick="removeField(this)">
                                        <i class="fa-regular fa-trash-can" style="color:green"></i>
                                    </button>
                                </div>`;
                            container.append(fieldElement);
                        });
                    } else {
                        const fieldElement = `
                                <div class="d-flex align-items-center mb-2">
                                    <select class="form-control glass-input mr-2 fieldForStaff" name="assignedFields[]">
                                    <option value="" disabled selected>Select a field</option>
                                        ${allFields.map(field => `
                                            <option value="${field.fieldId}" >
                                                ${field.name}
                                            </option>
                                        `).join("")}
                                    </select>
                                    <button type="button" class="btn btn-sm custom-btn" onclick="removeField(this)">
                                        <i class="fa-regular fa-trash-can" style="color:green"></i>
                                    </button>
                                </div>`;
                        container.append(fieldElement);
                    }
                },
                error: function () {
                    alert("Failed to load assigned fields for the staff. Please try again.");
                }
            });
        },
        error: function () {
            alert("Failed to load all fields. Please try again.");
        }
    });
}



$('#saveBtn').click(function () {
    const firstName = $("#firstNameModal").val();
    const lastName = $("#lastNameModal").val();
    const email = $("#emailModal").val();
    const address = $("#addressModal").val();
    const contact = $("#contactModal").val();
    const dob = $("#dobModal").val();
    const gender = $("#genderModal").val();
    const role = $("#roleModal").val();
    const designation = $("#designationModal").val();
    const joinDate = $("#joinDateModal").val();

    // Get all selected field IDs
    const assignedFields = [];
    $(".fieldForStaff").each(function () {
        const fieldId = $(this).val();
        if (fieldId) {
            assignedFields.push(fieldId);
        }
    });

    // Create the payload
    const staffData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        contact: contact,
        dob: dob,
        address:address,
        gender: gender,
        role: role,
        designation: designation,
        joinDate:joinDate,
        fieldIds: assignedFields // Field IDs as a list
    };
    console.log(staffData)
      const id = $("#staffId").val()

    // AJAX call to save staff
    $.ajax({
        url: `http://localhost:8080/greenShadow/api/v1/staffs/${id}`, // Replace with your backend URL
        type: "PUT",
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        data: JSON.stringify(staffData),
        success: function (response) {
            showAlert("Staff Update successfully!","success");
            $("#addStaffModal").modal("hide"); // Close the modal
            $("#addStaffForm")[0].reset(); // Clear the form
            resetFormData();
            fetchStaffData()
        },
        error: function (xhr) {
            console.error("Error while saving staff:", xhr.responseText);
            showAlert("Failed to add staff. Please try again.","error");
        }
    });


})
function resetFormData(){
    document.getElementById('addStaffModalLabel').innerText = 'Add Staff ';

    // Change the button text from "Add Staff" to "Save Changes"
    // Hide the "Add Field" button
    document.getElementById("addStaffBtn").style.display = "inline-block";
    // Show the "Save Changes" button
    document.getElementById("saveBtn").style.display = "none";
}

document.getElementById('staffSearch').addEventListener('input', function () {
    const filter = this.value.toLowerCase();
    const rows = document.querySelectorAll('.staff-table tbody tr');

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const match = Array.from(cells).some(cell =>
            cell.textContent.toLowerCase().includes(filter)
        );
        row.style.display = match ? '' : 'none'; // Show row if match, hide if not
    });
});


// Function to add an assigned field combo box
function addField() {
    // Fetch existing options from the first dropdown
    const existingOptions = $('.fieldForStaff:first').html();

    // Create a new dropdown with the same options
    const container = document.getElementById('assignedFieldsContainer');
    const fieldDiv = document.createElement('div');
    fieldDiv.className = 'd-flex align-items-center mb-2';
    fieldDiv.innerHTML = `
        <select class="form-control glass-input mr-2 fieldForStaff" name="assignedFields[]" required>
            ${existingOptions || '<option value="">Select Field</option>'}
        </select>
        <button type="button" class="btn btn-sm custom-btn" onclick="removeField(this)">
            <i class="fa-regular fa-trash-can" style="color:green"></i>
        </button>
    `;
    container.appendChild(fieldDiv);
}

// Function to remove an assigned field combo box
function removeField(button) {
    button.parentElement.remove();
}


// Function to clear the form
function clearStaffForm() {
    document.getElementById("addStaffForm").reset();
    document.getElementById("assignedFieldsContainer").innerHTML = '';
    document.getElementById("assignedVehiclesContainer").innerHTML = '';
    addField(); // Add one initial field combo box
   // addVehicle(); // Add one initial vehicle combo box
}

function fetchAllFieldsForStaff() {
    $.ajax({
        url: "http://localhost:8080/greenShadow/api/v1/fields", // Update with your actual endpoint
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (response) {
            // Assuming response is an array of FieldDto objects
            const fieldSelect = $(".fieldForStaff");
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
$("#staffSave").click(function (){
    fetchAllFieldsForStaff()
    $("#addStaffModal").modal("show")
})

$("#addStaffBtn").click(function (){
    console.log("clicked")
    // Gather form data

    const firstName = $("#firstNameModal").val();
    const lastName = $("#lastNameModal").val();
    const email = $("#emailModal").val();
    const address = $("#addressModal").val();
    const contact = $("#contactModal").val();
    const dob = $("#dobModal").val();
    const gender = $("#genderModal").val();
    const role = $("#roleModal").val();
    const designation = $("#designationModal").val();
    const joinDate = $("#joinDateModal").val();

    // Get all selected field IDs
    const assignedFields = [];
    $(".fieldForStaff").each(function () {
        const fieldId = $(this).val();
        if (fieldId) {
            assignedFields.push(fieldId);
        }
    });

    // Create the payload
    const staffData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        contact: contact,
        dob: dob,
        address:address,
        gender: gender,
        role: role,
        designation: designation,
        joinDate:joinDate,
        fieldIds: assignedFields // Field IDs as a list
    };
    console.log(staffData)


    // AJAX call to save staff
    $.ajax({
        url: "http://localhost:8080/greenShadow/api/v1/staffs", // Replace with your backend URL
        type: "POST",
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        data: JSON.stringify(staffData),
        success: function (response) {
            showAlert("Staff added successfully!","success");
            $("#addStaffModal").modal("hide"); // Close the modal
            $("#addStaffForm")[0].reset(); // Clear the form
            fetchStaffData()
        },
        error: function (xhr) {
            console.error("Error while saving staff:", xhr.responseText);
            showAlert("Failed to add staff. Please try again.","error");
        }
    });


})

function fetchStaffData() {
    $.ajax({
        url: "http://localhost:8080/greenShadow/api/v1/staffs", // Replace with your backend GET endpoint
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (response) {
            const tableBody = $(".staff-table tbody");
            tableBody.empty(); // Clear existing rows

            if (response.length > 0) {
                $(".no-data").hide(); // Hide the no-data placeholder
                $(".staff-table-container").show();

                // Populate the table with staff data
                response.forEach(staff => {
                    const row = `
                        <tr class="staff-row" style="cursor: pointer">
                            <td>${staff.firstName}</td>
                            <td>${staff.lastName}</td>
                            <td>${staff.gender}</td>
                            <td>${staff.joinDate}</td>
                            <td>${staff.email}</td>
                            <td>${staff.contact}</td>
                            <td>${staff.designation}</td>
                            <td>${staff.role}</td>
                        </tr>
                    `;
                    const $row = $(row);
                    $row.data("staff", staff); // Attach the staff object to the row
                    tableBody.append($row);
                });
            } else {
                $(".staff-table-container").hide(); // Hide the table
                $(".no-data").show(); // Show the no-data placeholder
            }
        },
        error: function (xhr) {
            console.error("Error fetching staff data:", xhr.responseText);
            alert("Failed to load staff data. Please try again.");
        }
    });
}

function populateModal(staff) {
    // Set static fields
    $("#sId").val(staff.staffId || "");
    $("#staffName").text(`${staff.firstName} ${staff.lastName}`);
    $("#firstName").val(staff.firstName || "");
    $("#lastName").val(staff.lastName || "");
    $("#email").val(staff.email || "");
    $("#gender").val(staff.gender || "");
    $("#contact").val(staff.contact || "");
    $("#address").val(staff.address || "");
    $("#dob").val(staff.dob || "");
    $("#role").val(staff.role || "");
    $("#designation").val(staff.designation || "");
    $("#joinDate").val(staff.joinDate || "");
   // $("#assignedVehicles").val(staff.assignedVehicles?.join(", ") || "");

    // Fetch and set assigned fields
    fetchAssignedFields(staff.staffId);
}
// Fetch assigned fields for the staff
function fetchAssignedFields(staffId) {
    $.ajax({
        url: `http://localhost:8080/greenShadow/api/v1/staffs/${staffId}/field`, // Replace with your endpoint
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (fields) {
            if (fields.length === 0) {
                $("#assignedFields").val("No assigned fields");
            } else {
                const fieldNames = fields.map(field => field.name).join(", ");
                $("#assignedFields").val(fieldNames);
            }
        },
        error: function (xhr) {
            console.error("Error fetching assigned fields:", xhr.responseText);
            alert("Failed to load assigned fields. Please try again.");
        }
    });
}

$("#staffUpdateBtn").on("click", function () {

    $("#addStaffModal").modal("show");
});

$("#staffDeleteBtn").click(function () {
    const StaffId = $("#sId").val(); // Assuming a hidden input or other source for field ID.

    if (!StaffId) {
        Swal.fire({
            icon: 'error',
            title: 'Staff ID is missing!',
            text: 'Cannot delete the Staff.',
            confirmButtonText: 'OK'
        });
        return;

    }

    if (StaffId){
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
                    url: `http://localhost:8080/greenShadow/api/v1/staffs/${StaffId}`, // Your delete endpoint
                    type: "DELETE",
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token") // Include JWT in Authorization header
                    },
                    success: function (response) {
                        // Perform actions on successful deletion
                        showAlert("Staff deleted successfully.", "success");
                        $("#staffDetailModal").modal("hide"); // Hide the modal

                        fetchStaffData()
                    },
                    error: function (xhr, status, error) {
                        // Handle errors
                        if (xhr.status === 404) {
                            showAlert("member not found.", "error");
                        } else if (xhr.status === 400) {
                            showAlert("Invalid member ID.", "error");
                        } else {
                            showAlert("Error deleting staff. Please try again.", "error");
                        }
                    }
                });
            }
        });
    }



});

