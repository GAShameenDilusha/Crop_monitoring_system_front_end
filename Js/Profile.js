function toggleProfileEditMode() {
    const inputs = document.querySelectorAll('.profile-field input, .profile-field select');
    inputs.forEach(input => {
        if (input.id !== 'role') { // Skip the role field
            input.readOnly = !input.readOnly;
        }
    });

    document.getElementById('saveChangesBtn').style.display = 'inline';
    document.getElementById('editProfileBtn').style.display = 'none';
}




function deleteAccount() {
    // Get the email from the profile field or local storage
    const email = $("#userEmail").val();

    if (!email) {
        alert("Email not found. Cannot delete the account.");
        return;
    }

    // Confirmation dialog
    if (!confirm("Are you sure you want to delete this field? This action cannot be undone.")) {
        return;
    }


    // Confirm before deletion
    if (!confirm("Are you sure you want to delete this account? This action cannot be undone.")) {
        return;
    }

    // AJAX DELETE request
    $.ajax({
        url: `http://localhost:8080/greenShadows/api/v1/users/${email}`,
        type: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}` // Include JWT for authorization
        },
        success: function () {
            // Notify success
            showAlert("Account deleted successfully.",'success');
            console.log("Account deleted for email:", email);

            localStorage.clear();
            $("#homeSection").css(css1);
            $("#signUp-section").css(css1);
        },
        error: function (xhr, status, error) {
            // Handle errors and notify the user
            if (xhr.status === 400) {
                alert("Invalid email format. Please check and try again.");
            } else if (xhr.status === 404) {
                alert("User not found. Unable to delete the account.");
            } else {
                alert("An error occurred while deleting the account. Please try again.");
            }
            console.error("Error deleting account:", status, error);
        }
    });

}

var role ;
function fetchProfileData() {

    const email = localStorage.getItem("email");
    if (!email) {
        alert("Email not found in local storage!");
        return;
    }

    // Fetch staff data using the email
    $.ajax({
        url: `http://localhost:8080/greenShadow/api/v1/staffs/email/${email}`, // Adjust the endpoint URL based on your API
        method: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (data) {
            role = data.role;
            manageButtonVisibility()
            // Populate the profile fields
            $("#UserId").val(data.staffId);
            $("#userFirstName").val(data.firstName);
            $("#userLastName").val(data.lastName);
            $("#userDesignation").val(data.designation);
            $("#UserDob").val(data.dob);
            $("#joinedDate").val(data.joinDate);
            $("#contactNo").val(data.contact);
            $("#profileGender").val(data.gender);
            $("#userEmail").val(data.email);
            $("#UserRole").val(data.role);
            // Split the address into lines and populate fields
            const addressParts = data.address.split(",");
            $("#addressLine1").val(addressParts[0] || "N/A");
            $("#addressLine2").val(addressParts[1] || "N/A");
            $("#addressLine3").val(addressParts[2] || "N/A");
            $("#addressLine4").val(addressParts[3] || "N/A");
        },
        error: function (xhr, status, error) {
            console.error("Failed to fetch staff data:", error);
            alert("Could not fetch Profile data. Please try again.");
        },
    });
}

function updateProfile() {
    // Collect the profile data from the form
    const staffId = $("#UserId").val(); // Read-only field
    const updatedData = {
        firstName: $("#userFirstName").val(),
        lastName: $("#userLastName").val(),
        designation: $("#userDesignation").val(),
        dob: $("#UserDob").val(),
        joinDate: $("#joinedDate").val(),
        contact: $("#contactNo").val(),
        gender: $("#profileGender").val(),
        email: $("#userEmail").val(),
        address: [
            $("#addressLine1").val(),
            $("#addressLine2").val(),
            $("#addressLine3").val(),
            $("#addressLine4").val()
        ].filter(line => line.trim() !== "").join(",") // Combine non-empty lines with commas
    };

    // AJAX PUT request to update staff
    $.ajax({
        url: `http://localhost:8080/greenShadow/api/v1/staffs/${staffId}`,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(updatedData),
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}` // Include JWT for authorization
        },
        success: function (response) {
            // Handle success - Notify the user and update UI
            showAlert("Profile updated successfully!",'success');
            console.log("Updated Staff:", response);


            // Optionally, reload the profile data or refresh the page
            fetchProfileData(); // Assume a function exists to reload profile data
            fetchStaffData()
        },
        error: function (xhr, status, error) {
            // Handle error - Notify the user and log error details
            alert("Error updating profile: " + xhr.responseText);
            console.error("Error:", status, error);
        }
    });
}

function manageButtonVisibility() {

    // Ensure role exists
    if (!role) {
        console.error("User role not found.");
        return;
    }

    // Hide all buttons initially
    hideAll()

    // Apply role-based logic
    if (role === "MANAGER") {
        $(".add-filed").css(css2)
        $("#FieldUpdateBtn").css(css2)
        $("#FieldDeleteBtn").css(css2)
        $("#CropUpdateBtn").css(css2)
        $("#CropDeleteBtn").css(css2)
        $("#staffDeleteBtn").css(css2)
        $("#staffUpdateBtn").css(css2)
        $("#deleteVehicleBtn").css(css2)
        $("#updateVehicleBtn").css(css2)
        $("#deleteEquipmentBtn").css(css2)
        $("#updateEquipmentBtn").css(css2)
        $("#logDeleteBtn").css(css2)
        $("#logUpdateBtn").css(css2)

    } else if (role === "ADMINISTRATIVE") {
        // Limited access: No crop, field, or monitor log edits
        $("#staffDeleteBtn").css(css2)
        $("#staffUpdateBtn").css(css2)
        $("#staffSave").css(css2)
        $("#deleteVehicleBtn").css(css2)
        $("#updateVehicleBtn").css(css2)
        $("#deleteEquipmentBtn").css(css2)
        $("#updateEquipmentBtn").css(css2)
        $("#addVehicle").css(css2)
        $("#addNewEquipment").css(css2)



    } else if (role === "SCIENTIST") {
        // Limited access: No staff, vehicle, or equipment edits
        $("#FieldUpdateBtn").css(css2)
        $("#FieldDeleteBtn").css(css2)
        $("#CropUpdateBtn").css(css2)
        $("#CropDeleteBtn").css(css2)
        $("#logDeleteBtn").css(css2)
        $("#logUpdateBtn").css(css2)
        $("#openAddLogModal").css(css2)
        $("#openAddModal").css(css2)
        $("#add-field").css(css2)

    } else {
        console.warn("Role not recognized: ", role);
    }
}
function hideAll(){
    $(".add-filed").css(css1);
    $("#FieldUpdateBtn").css(css1)
    $("#FieldDeleteBtn").css(css1)
    $("#CropUpdateBtn").css(css1)
    $("#CropDeleteBtn").css(css1)
    $("#staffDeleteBtn").css(css1)
    $("#staffUpdateBtn").css(css1)
    $("#deleteVehicleBtn").css(css1)
    $("#updateVehicleBtn").css(css1)
    $("#deleteEquipmentBtn").css(css1)
    $("#updateEquipmentBtn").css(css1)
    $("#logDeleteBtn").css(css1)
    $("#logUpdateBtn").css(css1)

}






