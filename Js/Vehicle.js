
// Row click event to open modal and populate it with staff data
$(document).on("click", ".vehicle-row", function () {
    const vehicleData = $(this).data("vehicle");
    populateVehicleModal(vehicleData);
    console.log(vehicleData)
    $("#vehicleDetailModal").modal("show");
});


document.getElementById("statusFilter").addEventListener("change", function() {
    const selectedStatus = this.value;
    const tableRows = document.querySelectorAll("#vehicleTableBody tr");

    tableRows.forEach(row => {
        const rowStatus = row.getAttribute("data-status");

        if (selectedStatus === "all" || rowStatus === selectedStatus) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
});

document.getElementById("vehicleSearch").addEventListener("input", function() {
    const searchValue = this.value.toLowerCase();
    const tableRows = document.querySelectorAll("#vehicleTableBody tr");

    tableRows.forEach(row => {
        const licensePlate = row.cells[1].textContent.toLowerCase(); // Column 2: License Plate
        const fuelType = row.cells[2].textContent.toLowerCase(); // Column 3: Fuel Type

        if (licensePlate.includes(searchValue) || fuelType.includes(searchValue)) {
            row.style.display = ""; // Show row if there's a match
        } else {
            row.style.display = "none"; // Hide row if there's no match
        }
    });
});

document.querySelectorAll('.vehicle-table tbody tr').forEach(row => {
    row.addEventListener('click', function() {

        // Show the modal
        $('#vehicleDetailModal').modal('show');
    });
});
var vehicleID ;
function populateVehicleData(vehicleId) {
    vehicleID = vehicleId;
    $.ajax({
        url: `http://localhost:8080/greenShadow/api/v1/vehicles/${vehicleId}`, // Replace with your API endpoint
        method: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (data) {
            console.log(data)
           $("#licensePlateModal").val(data.plateNumber)
           $("#categoryModal").val(data.category)
            $("#fuelTypeModal").val(data.fuelType)
            $("#statusModal").val(data.status)
            $("#remarksModal").val(data.remarks)
            $(".staffForVehicle").val(data.staffId ? data.staffId : "N/A")

            // Change the modal header to "Update Member"
            document.getElementById('addVehicleModalLabel').innerText = 'Update Vehicle Details';

            // Change the button text from "Add Staff" to "Save Changes"
            // Hide the "Add Field" button
            document.getElementById("addVehicleBtn").style.display = "none";
            // Show the "Save Changes" button
            document.getElementById("vehicleSaveBtn").style.display = "inline-block";
        },
        error: function () {
            alert("Failed to load Vehicle details. Please try again.");
        }
    });

}
$("#vehicleSaveBtn").click(function (){
    const vehicleData = {
        plateNumber: $("#licensePlateModal").val(),
        category:$("#categoryModal").val(),
        fuelType: $("#fuelTypeModal").val(),
        status: $("#statusModal").val(),
        remarks: $("#remarksModal").val(),
        staffId:$(".staffForVehicle").val()
    };

    // Validate required fields
    if (!vehicleData.plateNumber || !vehicleData.fuelType || !vehicleData.status ) {
        alert("Please fill out all required fields.");
        return;
    }

    console.log(vehicleData)

    // AJAX POST request to save the vehicle
    $.ajax({
        url: `http://localhost:8080/greenShadow/api/v1/vehicles/${vehicleID}`, // Update with your actual endpoint URL
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(vehicleData),
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (response) {
            showAlert("Vehicle Update successfully!",'success');
            // Close the modal
            $("#addVehicleModal").modal("hide");
            // Optionally refresh the vehicle list or perform other UI updates
            fetchVehicleData(); // Define a function to refresh vehicle data
            changeVehicleModalData()
        },
        error: function (xhr, status, error) {
            console.error("Error Updating vehicle:", error);
            showAlert("Failed to Update vehicle. Please try again.",'error');
        }
    });

})
function changeVehicleModalData(){
    // Change the modal header to "Update Member"
    document.getElementById('addVehicleModalLabel').innerText = 'Add Vehicle';

    // Change the button text from "Add Staff" to "Save Changes"
    // Hide the "Add Field" button
    document.getElementById("addVehicleBtn").style.display = "inline-block";
    // Show the "Save Changes" button
    document.getElementById("vehicleSaveBtn").style.display = "none";

}

function toggleVehicleEditMode() {
    // Close the staffDetailModal
    $('#vehicleDetailModal').modal('hide');

    // Open the addStaffModal
    $('#addVehicleModal').modal('show');
    fetchStaffForVehicle()
    const vehicleCode = $("#vehicleCode").val();
    populateVehicleData(vehicleCode);

    // Change the modal header to "Update Member"
    document.getElementById('addVehicleModalLabel').innerText = 'Update Vehicle details';

    // Change the button text from "Add Staff" to "Save Changes"
    const addVehicle = document.getElementById('addVehicleBtn');
    addVehicle.innerText = 'Save Changes';


}




function clearVehicleForm() {
    document.getElementById("addVehicleForm").reset();
}


function fetchStaffForVehicle(){
    $.ajax({
        url: "http://localhost:8080/greenShadow/api/v1/staffs", // Update with your actual endpoint
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (staffList) {
            // Assuming response is an array of FieldDto objects
            const staffSelect = $("#assignedStaff");
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
$("#addVehicle").click(function () {
    fetchStaffForVehicle()
})
function saveVehicle() {

    const vehicleData = {
        plateNumber: $("#licensePlateModal").val(),
        category:$("#categoryModal").val(),
        fuelType: $("#fuelTypeModal").val(),
        status: $("#statusModal").val(),
        remarks: $("#remarksModal").val(),
        staffId:$(".staffForVehicle").val()
    };

    // Validate required fields
    if (!vehicleData.plateNumber || !vehicleData.fuelType || !vehicleData.status ) {
        alert("Please fill out all required fields.");
        return;
    }

    console.log(vehicleData)

    // AJAX POST request to save the vehicle
    $.ajax({
        url: "http://localhost:8080/greenShadow/api/v1/vehicles", // Update with your actual endpoint URL
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(vehicleData),
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (response) {
            showAlert("Vehicle added successfully!",'success');
            // Close the modal
            $("#addVehicleModal").modal("hide");
            // Optionally refresh the vehicle list or perform other UI updates
           fetchVehicleData(); // Define a function to refresh vehicle data
        },
        error: function (xhr, status, error) {
            console.error("Error saving vehicle:", error);
            showAlert("Failed to add vehicle. Please try again.",'error');
        }
    });
}

// Attach the function to the Add Vehicle button
$("#addVehicleBtn").on("click", saveVehicle);
function fetchVehicleData() {
    $.ajax({
        url: "http://localhost:8080/greenShadow/api/v1/vehicles",
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (response) {
            const tableBody = $("#vehicleTableBody");
            tableBody.empty(); // Clear existing rows

            if (response && response.length > 0) {
                $(".no-data").hide(); // Hide the no-data placeholder
                $(".vehicle-container").show(); // Show the table container

                // Populate the table with vehicle data
                response.forEach(vehicle => {
                    const row = `
                        <tr class="vehicle-row" data-status="${vehicle.status.toLowerCase()}">
                            <td>${vehicle.category}</td>
                            <td>${vehicle.plateNumber}</td>
                            <td>${vehicle.fuelType}</td>
                            <td>${vehicle.status}</td>
                            <td>${vehicle.remarks || "N/A"}</td>
                        </tr>
                    `;
                    const $row = $(row);
                    $row.data("vehicle", vehicle); // Attach the staff object to the row
                    tableBody.append($row);

                });

                // Apply the status filter
                //applyStatusFilter();
            } else {
                $(".vehicle-container").hide(); // Hide the table container
                $(".no-data").show(); // Show the no-data placeholder
            }
        },
        error: function (xhr) {
            console.error("Error fetching vehicle data:", xhr.responseText);
            alert("Failed to load vehicle data. Please try again.");
        }
    });
}
function populateVehicleModal(vehicleData){
    // Set the form fields with the corresponding vehicle data
    $("#vehicleCode").val(vehicleData.vehicleId || "N/A");
    $("#licensePlate").val(vehicleData.plateNumber || "N/A");
    $("#fuelType").val(vehicleData.fuelType || "N/A");
    $("#status").val(vehicleData.status || "N/A");

    $("#remarks").val(vehicleData.remarks || "N/A");
    if (vehicleData.staffId) {
        $.ajax({
            url: `http://localhost:8080/greenShadow/api/v1/staffs/${vehicleData.staffId}`, // Adjust this endpoint to match your backend
            type: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token"),
            },
            success: function (staff) {
                const staffName = staff.firstName+" "+staff.lastName || "N/A"; // Assuming the response contains the 'name' field
                $("#allocatedStaff").val(staffName);
            },
            error: function (xhr) {
                console.error("Error fetching staff data:", xhr.responseText);
                $("#allocatedStaff").val("Unknown Staff"); // Fallback value in case of error
            }
        });
    } else {
        $("#allocatedStaff").val("N/A"); // No staff assigned
    }



}
$("#deleteVehicleBtn").click(function () {
    const vehicleId = $("#vehicleCode").val(); // Assuming a hidden input or other source for field ID.

    if (!vehicleId) {
        Swal.fire({
            icon: 'error',
            title: 'Vehicle ID is missing!',
            text: 'Cannot delete the Vehicle.',
            confirmButtonText: 'OK'
        });
        return;
    }
    if (vehicleId){
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
                    url: `http://localhost:8080/greenShadow/api/v1/vehicles/${vehicleId}`, // Your delete endpoint
                    type: "DELETE",
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token") // Include JWT in Authorization header
                    },
                    success: function (response) {
                        // Perform actions on successful deletion
                        showAlert("Vehicle deleted successfully.", "success");
                        $("#vehicleDetailModal").modal("hide"); // Hide the modal

                        fetchVehicleData()
                    },
                    error: function (xhr, status, error) {
                        // Handle errors
                        if (xhr.status === 404) {
                            showAlert("member not found.", "error");
                        } else if (xhr.status === 400) {
                            showAlert("Invalid member ID.", "error");
                        } else {
                            showAlert("Error deleting Vehicle. Please try again.", "error");
                        }
                    }
                });
            }
        });
    }




});




