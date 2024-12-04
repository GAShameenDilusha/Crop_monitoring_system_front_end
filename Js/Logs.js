

function updateLogData(logId) {
    $.ajax({
        url: `http://localhost:8080/greenShadow/api/v1/logs/${logId}`, // Adjust URL as necessary
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        success: function(response) {
            // Call function to populate the modal with the field data
            console.log(response)
            PopulateLogModal(response);
        },
        error: function() {
            console.log('Error retrieving Log data.');
        }
    });
}

function  PopulateLogModal(log){
    fetchFieldsForLog()
    fetchCropForLog()
    fetchStaffForLog()
    // Populate Log Description
    $("#logDescription").val(log.logDetails || "");
    // Populate Status
    $("#logStatus").val(log.status || "Info");

    // Set the image preview
    const imageSrc = log.image2
        ? `data:image/jpeg;base64,${log.image2}`
        : 'https://via.placeholder.com/600x200?text=No+Image';
    $('#logPreview').attr('src', imageSrc).show(); // Set and show the image preview
    // Populate assigned fields dynamically
    populateAssignedData(log.logId);

}

function setField(fields) {
    $.ajax({
        url: `http://localhost:8080/greenShadow/api/v1/fields`, // Fetch all fields
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (allFields) {
            const fieldsContainer = $("#fieldsContainer");
            fieldsContainer.empty();
            fields.forEach(assignedField => {
                const fieldElement = `
                                <div class="d-flex align-items-center mb-2">
                                    <select class="form-control glass-input mr-2 fieldForLog" name="assignedFields[]">
                                        ${allFields.map(field => `
                                            <option value="${field.fieldId}" ${field.fieldId === assignedField.fieldId ? "selected" : ""}>
                                                ${field.name}
                                            </option>
                                        `).join("")}
                                    </select>
                                    <button type="button" class="btn btn-sm custom-btn" onclick="removeFieldCrop(this)">
                                        <i class="fa-regular fa-trash-can" style="color:green"></i>
                                    </button>
                                </div>`;
                fieldsContainer.append(fieldElement);
            });

        },
        error: function () {
            alert("Failed to load all fields. Please try again.");
        }
    });
}


function setCrop(crops) {
    $.ajax({
        url: `http://localhost:8080/greenShadow/api/v1/crops`, // Fetch all fields
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (allCrops) {
            const cropsContainer = $("#cropsContainer");
            cropsContainer.empty();
            crops.forEach(assignedCrop => {
                const cropElement = `
                                <div class="d-flex align-items-center mb-2">
                                    <select class="form-control glass-input mr-2 cropForLog" name="assignedFields[]">
                                        ${allCrops.map(crop => `
                                            <option value="${crop.id}" ${crop.id === assignedCrop.id ? "selected" : ""}>
                                                ${crop.commonName}
                                            </option>
                                        `).join("")}
                                    </select>
                                    <button type="button" class="btn btn-sm custom-btn" onclick="removeFieldCrop(this)">
                                        <i class="fa-regular fa-trash-can" style="color:green"></i>
                                    </button>
                                </div>`;
                cropsContainer.append(cropElement);
            });

        },
        error: function () {
            alert("Failed to load all Crops. Please try again.");
        }
    });

}
function setStaff(staff) {
    console.log(staff)
    $.ajax({
        url: `http://localhost:8080/greenShadow/api/v1/staffs`, // Fetch all fields
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (allStaff) {
            const staffContainer = $("#staffContainer");
            staffContainer.empty();
            staff.forEach(assignedStaff => {
                const cropElement = `
                                <div class="d-flex align-items-center mb-2">
                                    <select class="form-control glass-input mr-2 staffForLog" name="assignedFields[]">
                                        ${allStaff.map(s => `
                                            <option value="${s.staffId}" ${s.staffId === assignedStaff.staffId ? "selected" : ""}>
                                                ${s.firstName}
                                            </option>
                                        `).join("")}
                                    </select>
                                    <button type="button" class="btn btn-sm custom-btn" onclick="removeStaff(this)">
                                        <i class="fa-regular fa-trash-can" style="color:green"></i>
                                    </button>
                                </div>`;
                staffContainer.append(cropElement);
            });

        },
        error: function () {
            alert("Failed to load all staff. Please try again.");
        }
    });
}

function populateAssignedData(logId){
    $.ajax({
        url: `http://localhost:8080/greenShadow/api/v1/logs/${logId}/related-entities`, // Fetch assigned fields
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (relatedEntities) {
            if (relatedEntities.fields && relatedEntities.fields.length > 0){ setField(relatedEntities.fields)}
            if (relatedEntities.crops && relatedEntities.crops.length > 0){ setCrop(relatedEntities.crops)}
            if (relatedEntities.staff && relatedEntities.staff.length > 0){ setStaff(relatedEntities.staff)}



        },
        error: function () {
            alert("Failed to load assigned fields for the staff. Please try again.");
        }
    });
}

function enableEditMode() {
    $('#logDetailModal').modal('hide');

    // Open the addStaffModal
    $('#addMonitoringLogModal').modal('show');

    // Change the modal header to "Update Member"
    document.getElementById('addMonitoringLogModalLabel').innerText = 'Update Log Details';


    // Hide the "Add Field" button
    document.getElementById("saveLogBtn").style.display = "none";
    // Show the "Save Changes" button
    document.getElementById("logSaveBtn").style.display = "inline-block";
    updateLogData(logId)

}
$("#logSaveBtn").click(function () {
    const logDescription = $("#logDescription").val();
    const fields = $(".fieldForLog").map(function () {
        return $(this).val();
    }).get()
        .filter(val => val && val.trim() !== ""); // Filter out empty values for fields;
    const crops = $(".cropForLog").map(function () {
        return $(this).val();
    }).get()
        .filter(val => val && val.trim() !== ""); // Filter out empty values for fields;
    const staff = $(".staffForLog").map(function () {
        return $(this).val();
    }).get()
        .filter(val => val && val.trim() !== ""); // Filter out empty values for fields;
    const logStatus = $("#logStatus").val();
    const imageFile = $("#logImage")[0].files[0]; // Get the selected image file

    // Create the log data object
    const logData = {
        logDetails: logDescription,
        date:new Date(),
        status: logStatus
    };
    // Conditionally add fields if not empty
    if (fields.length > 0) {
        logData.fieldIds = fields;
    }

    // Conditionally add crops if not empty
    if (crops.length > 0) {
        logData.cropIds = crops;
    }

    // Conditionally add monitoringStaff if not empty
    if (staff.length > 0) {
        logData.staffIds = staff;
    }
    console.log(logData)

    // Create FormData to send multipart data
    const formData = new FormData();
    formData.append("logData", JSON.stringify(logData)); // Convert logData to JSON string
    if (imageFile) {
        formData.append("imageFile", imageFile); // Append the image file
    }
    console.log(formData)

    // Perform AJAX request
    $.ajax({
        url: `http://localhost:8080/greenShadow/api/v1/logs/${logId}`, // Replace with your endpoint
        type: "PUT",
        data: formData,
        processData: false, // Prevent jQuery from processing the data
        contentType: false, // Set the content type to false for FormData
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token") // Add the token header
        },
        success: function (response) {
            showAlert("Log Update successfully!",'success');
            console.log(response); // Debug: Check the response from the server
            // Optionally, clear the form or refresh the UI
            clearForm();
            $("#addMonitoringLogModal").modal("hide")
            fetchLogs()
        },
        error: function (xhr, status, error) {
            showAlert("Failed to Update the log. Please try again.",'error');
            console.error(error); // Debug: Check for errors
        }
    });

})

// Function to update the date and time in real-time
function updateDateTime() {
    const now = new Date();
    const formattedDateTime = now.toLocaleString();
    document.getElementById("currentDateTime").textContent = formattedDateTime;
}
setInterval(updateDateTime, 1000); // Update every second

// Function to add a new Field/Crop combo box
function addFieldToLog() {
    // Fetch existing options from the first dropdown
    const existingOptions = $('.fieldForLog:first').html();
    const container = document.getElementById("fieldsContainer");
    const newFieldCrop = document.createElement("div");
    newFieldCrop.className = "d-flex align-items-center mb-2";
    newFieldCrop.innerHTML = `
        <select class="form-control mr-2 fieldForLog" name="fields[]" >
          ${existingOptions || '<option value="">Select Field</option>'}
        </select>
        <button type="button" class="btn btn-sm custom-btn" onclick="removeFieldCrop(this)">
            <i class="fa-regular fa-trash-can"></i>
        </button>
    `;
    container.appendChild(newFieldCrop);
}
function addCropToLog() {
    const existingOptions = $('.cropForLog:first').html();
    const container = document.getElementById("cropsContainer");
    const newFieldCrop = document.createElement("div");
    newFieldCrop.className = "d-flex align-items-center mb-2";
    newFieldCrop.innerHTML = `
        <select class="form-control mr-2 cropForLog" name="Crops[]" >
           ${existingOptions || '<option value="">Select Crop</option>'}
        </select>
        <button type="button" class="btn btn-sm custom-btn" onclick="removeFieldCrop(this)">
            <i class="fa-regular fa-trash-can"></i>
        </button>
    `;
    container.appendChild(newFieldCrop);
}
// Function to preview the uploaded image
function previewLogImage(event, previewId) {
    const output = document.getElementById(previewId);
    output.src = URL.createObjectURL(event.target.files[0]);
    output.style.display = 'block';
}


// Function to remove Field/Crop combo box
function removeFieldCrop(element) {
    element.parentNode.remove();
}

// Function to add a new Staff combo box
function addStaffForLog() {

    const existingOptions = $('.staffForLog:first').html();
    const container = document.getElementById("staffContainer");
    const newStaff = document.createElement("div");
    newStaff.className = "d-flex align-items-center mb-2";
    newStaff.innerHTML = `
        <select class="form-control mr-2 staffForLog" name="monitoringStaff[]" required>
          ${existingOptions || '<option value="">Select Staff Member</option>'}
        </select>
        <button type="button" class="btn btn-sm  custom-btn" onclick="removeStaff(this)">
            <i class="fa-regular fa-trash-can"></i>
        </button>
    `;
    container.appendChild(newStaff);
}

// Function to remove Staff combo box
function removeStaff(element) {
    element.parentNode.remove();
}

function fetchFieldsForLog(assignedFields) {

    $.ajax({
        url: "http://localhost:8080/greenShadow/api/v1/fields", // Update with your actual endpoint
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (fields) {
            // Assuming response is an array of FieldDto objects
            const fieldSelect = $(".fieldForLog");
            fieldSelect.empty();
            fieldSelect.append('<option value="">Select Field</option>'); // Default option

            // Populate the select element with fetched fields and pre-select assigned ones
            fields.forEach(field => {
                const isSelected = assignedFields && assignedFields.some(f => f.fieldId === field.fieldId);
                const option = `<option value="${field.fieldId}" ${isSelected ? "selected" : ""}>${field.name}</option>`;
                fieldSelect.append(option);
            });
        },
        error: function (error) {
            console.error("Error fetching fields:", error);
            showAlert("Failed to load fields. Please try again later.",'error');
        }
    });
}

function fetchCropForLog(assignedCrops) {

    $.ajax({
        url: "http://localhost:8080/greenShadow/api/v1/crops", // Update with your actual endpoint
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (crops) {
            // Assuming response is an array of FieldDto objects
            const cropSelect = $(".cropForLog");
            cropSelect.empty();
            cropSelect.append('<option value="">Select Crop</option>'); // Default option

            // Populate the select element with fetched crops and pre-select assigned ones
            crops.forEach(crop => {
                const isSelected = assignedCrops && assignedCrops.some(c => c.id === crop.id);
                const option = `<option value="${crop.id}" ${isSelected ? "selected" : ""}>${crop.commonName}</option>`;
                cropSelect.append(option);
            });
        },
        error: function (error) {
            console.error("Error fetching crops:", error);
            showAlert("Failed to load crops. Please try again later.",'error');
        }
    });

}

function fetchStaffForLog(assignedStaff) {

    $.ajax({
        url: "http://localhost:8080/greenShadow/api/v1/staffs", // Update with your actual endpoint
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (staffList) {
            // Assuming response is an array of FieldDto objects
            const staffSelect = $("#monitoringStaff");
            staffSelect.empty();
            staffSelect.append('<option value="">Select Staff</option>'); // Default option

            // Populate the select element with fetched staff and pre-select assigned ones
            staffList.forEach(staff => {
                const isSelected = assignedStaff && assignedStaff.some(s => s.staffId === staff.staffId);
                const option = `<option value="${staff.staffId}" ${isSelected ? "selected" : ""}>${staff.firstName}</option>`;
                staffSelect.append(option);
            });
        },
        error: function (error) {
            console.error("Error fetching Staff:", error);
            showAlert("Failed to load staff. Please try again later.",'error');
        }
    });
}

$("#openAddLogModal").click(function () {
    $("#addMonitoringLogModal").modal('show')
    fetchFieldsForLog();
    fetchCropForLog();
    fetchStaffForLog();
})

function clearForm() {
    $("#addMonitoringLogForm")[0].reset();
    $("#logPreview").hide().attr("src", "");
   /* $("#fieldsContainer").empty();
    $("#cropsContainer").empty();
    $("#staffContainer").empty();*/
}

function saveLog() {
    // Collect form data
    const logDescription = $("#logDescription").val();
    const fields = $(".fieldForLog").map(function () {
        return $(this).val();
    }).get()
        .filter(val => val && val.trim() !== ""); // Filter out empty values for fields;
    const crops = $(".cropForLog").map(function () {
        return $(this).val();
    }).get()
        .filter(val => val && val.trim() !== ""); // Filter out empty values for fields;
    const staff = $(".staffForLog").map(function () {
        return $(this).val();
    }).get()
        .filter(val => val && val.trim() !== ""); // Filter out empty values for fields;
    const logStatus = $("#logStatus").val();
    const imageFile = $("#logImage")[0].files[0]; // Get the selected image file

    // Create the log data object
    const logData = {
        logDetails: logDescription,
        date:new Date(),
        status: logStatus
    };
    console.log(crops)
    // Conditionally add fields if not empty
    if (fields.length > 0) {
        logData.fieldIds = fields;
    }

    // Conditionally add crops if not empty
    if (crops.length > 0) {
        logData.cropIds = crops;
    }

    // Conditionally add monitoringStaff if not empty
    if (staff.length > 0) {
        logData.staffIds = staff;
    }
   console.log(logData)
    // Create FormData to send multipart data
    const formData = new FormData();
    formData.append("logData", JSON.stringify(logData)); // Convert logData to JSON string
    if (imageFile) {
        formData.append("imageFile", imageFile); // Append the image file
    }
    // Perform AJAX request
    $.ajax({
        url: "http://localhost:8080/greenShadow/api/v1/logs", // Replace with your endpoint
        type: "POST",
        data: formData,
        processData: false, // Prevent jQuery from processing the data
        contentType: false, // Set the content type to false for FormData
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token") // Add the token header
        },
        success: function (response) {
            showAlert("Log saved successfully!",'success');
            console.log(response); // Debug: Check the response from the server
            // Optionally, clear the form or refresh the UI
            clearForm();
            $("#addMonitoringLogModal").modal("hide")
            fetchLogs()
        },
        error: function (xhr, status, error) {
            showAlert("Failed to save the log. Please try again.",'error');
            console.error(error); // Debug: Check for errors
        }
    });
}
// Call this function on the Save button click
$("#saveLogBtn").on("click", saveLog);

function fetchLogs() {
    $.ajax({
        url: 'http://localhost:8080/greenShadow/api/v1/logs',
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        success: function (logs) {
            addLogsToUI(logs);
        },
        error: function (error) {
            console.error("Error fetching fields:", error);
            $(".no-data").show();
        }
    });
}

function addLogsToUI(logs){
    const container = $(".log-card-container");
    const noDataMessage = $(".no-data");

    // Clear any existing content
    container.empty();
    if (logs && logs.length > 0) {
        noDataMessage.hide(); // Hide no-data message if logs exist

        logs.forEach(log => {

            const logCard = `
                        <div class="log-card" data-log-Id =${log.logId}>
                            <!-- Date and Time -->
                            <div class="log-date-time">
                                <span>${new Date(log.date).toLocaleDateString()}</span>
                             
                            </div>

                            <!-- Field/Crop and Status Section -->
                            <div class="log-header">
                                <div class="log-category">.....</div>
                                <div class="log-status ${log.status.toLowerCase()}">${log.status}</div>
                            </div>

                            <!-- Description and Image Section -->
                            <div class="log-middle">
                                <!-- Description on the left -->
                                <div class="log-description">
                                    ${log.logDetails || "No description available"}
                                </div>
                                <!-- Image on the right -->
                                <div class="log-image">
                                    ${log.image2
                    ? `<img src="data:image/png;base64,${log.image2}" alt="Log Image" />`
                    : `<img src="https://via.placeholder.com/80" alt="No Image Available" />`
            }
                          </div>
                            </div>

                            <!-- View Details Button -->
                            <button class="view-details-btn" data-toggle="modal" data-target="#logDetailModal"   data-log='${JSON.stringify(log)}' 
                        onclick="viewLogDetails(this)">
                                <i class="fas fa-info-circle"></i> View Details
                            </button>
                        </div>
                    `;
            container.append(logCard);
            fetchFieldsAndCropsToUI(log.logId)
        });
    } else {
        noDataMessage.show(); // Show no-data message if no logs exist
    }
}

var logId;

function viewLogDetails(button) {

    // Parse crop data from the button's data attribute
    const logDetail = JSON.parse($(button).attr('data-log'));
    console.log(logDetail)
    logId = logDetail.logId;
    const imageSrc = logDetail.image2
        ? `data:image/jpeg;base64,${logDetail.image2}`
        : 'https://via.placeholder.com/600x200?text=Log+Image';
    $("#logDetailModal .modal-header img").attr("src", imageSrc)
    // Set the log code
    $("#logCode").val(logDetail.logId || "N/A");

    // Set the log date
    $("#logDate").val(logDetail.date || "N/A");

    // Set the log details
    $("#details").val(logDetail.logDetails || "No details available");

    //fetch related entities
    $.ajax({
        url: `http://localhost:8080/greenShadow/api/v1/logs/${logDetail.logId}/related-entities`,
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token") // Add the token header
        },
        success: function (data) {
            // Set the fields and crops
            const fieldNames = (data.fields && data.fields.length > 0)
                ? data.fields.map(field => field.name).join(", ")
                : "No Fields";
            const cropNames = (data.crops && data.crops.length > 0)
                ? data.crops.map(crop => crop.commonName).join(", ")
                : "No Crops";
            const fieldsAndCrops = [fieldNames, cropNames].filter(name => name !== "No Fields" && name !== "No Crops").join(", ");
            $("#fields").val(fieldsAndCrops || "No data available");
            // Set the staff members
            const staffNames = (data.staff && data.staff.length > 0)
                ? data.staff.map(staff => staff.firstName).join(", ")
                : "No Staff";
            $("#staffMembers").val(staffNames || "No data available");
        },
        error: function (xhr, status, error) {
            console.error(`Failed to fetch related entities for log ${logId}:`, error);

        }
    });




}


function fetchFieldsAndCropsToUI(logId) {
    $.ajax({
        url: `http://localhost:8080/greenShadow/api/v1/logs/${logId}/related-entities`,
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token") // Add the token header
        },
        success: function (data) {
            // Select the log card using the unique logId
            const logCard = $(`.log-card[data-log-id="${logId}"]`);
            // Extract field and crop names
            const fieldNames = (data.fields && data.fields.length > 0)
                ? data.fields.map(field => field.name).join(", ")
                : null; // No Fields

            const cropNames = (data.crops && data.crops.length > 0)
                ? data.crops.map(crop => crop.commonName).join(", ")
                : null; // No Crops

            // Construct the display text
            let displayText = "";

            if (fieldNames && cropNames) {
                // Both fields and crops exist
                displayText = `${fieldNames}, ${cropNames} Crop`;
            } else if (fieldNames) {
                // Only fields exist
                displayText = fieldNames;
            } else if (cropNames) {
                // Only crops exist
                displayText = cropNames;
            } else {
                // Neither fields nor crops exist
                displayText = "No Data Available";
            }

            // Update the log card's category text
            logCard.find('.log-category').text(displayText);
        },
        error: function (xhr, status, error) {
            console.error(`Failed to fetch related entities for log ${logId}:`, error);
            logCard.find('.log-category').text("Error fetching data");
        }
    });
}

$("#logDeleteBtn").click(function () {
    const logId = $("#logCode").val(); // Assuming a hidden input or other source for field ID.

    if (!logId) {
        if (!fieldId) {
            Swal.fire({
                icon: 'error',
                title: 'Log ID is missing!',
                text: 'Cannot delete the Log.',
                confirmButtonText: 'OK'
            });
            return;
        }
    }
    if (logId){
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
                    url: `http://localhost:8080/greenShadow/api/v1/logs/${logId}`, // Your delete endpoint
                    type: "DELETE",
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token") // Include JWT in Authorization header
                    },
                    success: function (response) {
                        // Perform actions on successful deletion
                        showAlert("Crop deleted successfully.", "success");
                        $("#logDetailModal").modal("hide"); // Hide the modal

                        fetchLogs()
                    },
                    error: function (xhr, status, error) {
                        // Handle errors
                        if (xhr.status === 404) {
                            showAlert("Field not found.", "error");
                        } else if (xhr.status === 400) {
                            showAlert("Invalid field ID.", "error");
                        } else {
                            showAlert("Error deleting field. Please try again.", "error");
                        }
                    }
                });

            }
        });
    }



});
 $("#lDate").on("keypress", function (e) {
    if (e.which === 13) {
        fetchFilteredLogs();
    }
});
function fetchFilteredLogs() {

    const selectedDate = $("#lDate").val(); // Date in YYYY-MM-DD format

    $.ajax({
        url: "http://localhost:8080/greenShadow/api/v1/logs",
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (logs) {
            // Filter logs based on the selected date
            const filteredLogs = logs.filter(log => log.date === selectedDate);

            if (filteredLogs.length > 0) {

                // Call fetchLogToUi for the filtered logs
                addLogsToUI(filteredLogs);
                document.getElementById("showAllButton").style.display = "inline-block";
            } else {
               addLogsToUI(logs)

                showAlert("No logs found for the selected date",'error')
            }
        },
        error: function () {
            alert("Failed to load logs. Please try again.");
        }
    });
}
$("#showAllButton").click(function (){
   fetchLogs()
    document.getElementById("showAllButton").style.display = "none";
})










