// JavaScript for Image Slider


function toggleFieldEditMode() {

    updateFieldData(fieldId);
}
function updateFieldData(fieldId){
    $.ajax({
        url: `http://localhost:8080/greenShadow/api/v1/fields/${fieldId}`, // Adjust URL as necessary
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        success: function(response) {
            // Call function to populate the modal with the field data
            console.log(response)
             populateUpdateFieldModal(response);
        },
        error: function() {
            alert('Error retrieving field data.');
        }
    });
}
//field update modal data
function populateUpdateFieldModal(fieldData) {
    // Set the field data into the modal inputs
    $('#Code').val(fieldData.fieldId);
    $('#Name').val(fieldData.name);
    $('#Size').val(fieldData.size);

    setFieldLocation(fieldData.location);

    // Set the images if they are available
    if (fieldData.image1) {
        $('#preview1').attr('src', `data:image/jpeg;base64,${fieldData.image1}`).show(); // Add data:image/jpeg;base64, prefix if it's an image/jpeg
    } else {
        $('#preview1').hide();
    }
    if (fieldData.image2) {
        $('#preview2').attr('src', `data:image/jpeg;base64,${fieldData.image2}`).show(); // Same for image2
    } else {
        $('#preview2').hide();
    }

    // Show the modal
    $('#fieldDetailModal').modal('hide');

    // Open the addStaffModal
    $('#addFieldModal').modal('show');

    // Change the modal header to "Update Member"
    document.getElementById('addFieldModalLabel').innerText = 'Update Field';

    // Change the button text from "Add Staff" to "Save Changes"
    // Hide the "Add Field" button
    document.getElementById("addField").style.display = "none";
    // Show the "Save Changes" button
    document.getElementById("FieldSaveBtn").style.display = "inline-block";

}
// Function to parse the location string and set the map
function setFieldLocation(locationString) {
    // Example: "6.7241° N, 79.9164° E"
    const locationParts = locationString.split(',');

    // Extract the latitude and longitude values
    const latPart = locationParts[0].trim(); // "6.7241° N"
    const lngPart = locationParts[1].trim(); // "79.9164° E"

    // Remove the degree symbol and directions (N, S, E, W) and convert to float
    const latitude = parseFloat(latPart.split('°')[0]);
    const longitude = parseFloat(lngPart.split('°')[0]);

    // Set the location input field (to show the location in the input)
    $('#location').val(`${latitude}° N, ${longitude}° E`);

    // Initialize the map with parsed latitude and longitude
    updateMap(latitude, longitude);
}

$("#addField").click(function () {

    const fieldName = $("#Name").val();
    const fieldLocation = $("#location").val();
    const fieldSize = $("#Size").val();
    const fieldImage1 = $("#fieldImage1")[0].files[0];
    const fieldImage2 = $("#fieldImage2")[0].files[0];

    // Create a JavaScript object representing field data
    const fieldData = {
        name: fieldName,
        location: fieldLocation,
        size: fieldSize,
    };

    // Create FormData and append data and images
    const formData = new FormData();
    formData.append("fieldData", JSON.stringify(fieldData));
    if (fieldImage1) formData.append("image1", fieldImage1);
    if (fieldImage2) formData.append("image2", fieldImage2);

    // Get JWT token from localStorage
    const token = localStorage.getItem("token");
    console.log(token)

    // Perform the AJAX request
    $.ajax({
        url: "http://localhost:8080/greenShadow/api/v1/fields",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        headers: {
            Authorization: "Bearer " + token // Include JWT in Authorization header
        },
        success: function (response) {
            console.log(response)
            // Clear the input fields in the modal
            clearFieldForm();
            // Hide the modal
            $("#addFieldModal").modal('hide');
            fetchFields()
            showAlert("Field created successfully", 'success');

        },
        error: function (xhr, status, error) {
            console.log(status,error)
            showAlert("Failed to create field:", 'error');

        }
    });
});
// JavaScript to handle image preview
function previewImage(event, previewId) {
    const reader = new FileReader();
    reader.onload = function () {
        const output = document.getElementById(previewId);
        output.src = reader.result;
        output.style.display = 'block';
    };
    reader.readAsDataURL(event.target.files[0]);
}
let map =null

//initialize the map

function initMap(){
    // Center coordinates for Panadura, Sri Lanka
    var panaduraCoordinates = [6.7114, 79.9072];

// Define broader bounds to cover a larger area
    var bounds = [
        [6.45, 79.75], // Southwest corner
        [7.10, 80.05]  // Northeast corner
    ];

    // Initialize map centered on Panadura with zoom level suitable for the area
    map = L.map('map', {
        center: panaduraCoordinates,
        zoom: 13,
        maxBounds: bounds,
        maxBoundsViscosity: 1.0 // Prevents panning outside bounds
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 20,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // Marker to display chosen location
    var marker;

    // Map click event to place marker and get coordinates
    map.on('click', function(e) {
        const lat = e.latlng.lat.toFixed(6);  // Latitude
        const lng = e.latlng.lng.toFixed(6);  // Longitude



        var formattedLocation = formatCoordinates(lat, lng);
        // Update input fields
        document.getElementById('location').value = formattedLocation;
        console.log(formattedLocation)

        // Update marker position
        if (marker) {
            marker.setLatLng(e.latlng);
        } else {
            marker = L.marker(e.latlng).addTo(map);
        }
    });
    // Add this to refresh the map when the modal is opened
    $('#addFieldModal').on('shown.bs.modal', function () {
        map.invalidateSize(); // Refresh map to fit the container
    });
}

// Function to format latitude and longitude
function formatCoordinates(lat, lng) {
    var latDirection = lat >= 0 ? 'N' : 'S';
    var lngDirection = lng >= 0 ? 'E' : 'W';

    var formattedLat = Math.abs(lat).toFixed(4) + '° ' + latDirection;
    var formattedLng = Math.abs(lng).toFixed(4) + '° ' + lngDirection;

    return formattedLat + ', ' + formattedLng;
}

// update the map
function updateMap(lat, lng) {
    if (!map) {  // If the map is not yet initialized, create it
        map = L.map('map').setView([lat, lng], 12);

        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    } else {
        // If the map is already initialized, just update the center and zoom
        map.setView([lat, lng], 12);
    }

    // Remove any existing markers to avoid stacking them
    if (map._layers) {
        Object.keys(map._layers).forEach(function(layerId) {
            const layer = map._layers[layerId];
            if (layer instanceof L.Marker) {
                map.removeLayer(layer); // Remove the existing marker
            }
        });
    }

    // Add a new marker to the map for the given coordinates
    L.marker([lat, lng]).addTo(map)
        .bindPopup('Field Location') // Optional: Add a popup for the marker
        .openPopup(); // Optional: Automatically open the popup
}

//added field
$("#FieldSaveBtn").click(function () {

    const id =  $("#fieldCode").val();
    const fieldUpdateName = $("#Name").val();
    const fieldUpdateLocation = $("#location").val();
    const fieldUpdateSize = $("#Size").val();
    const fieldUpdateImage1 = $("#fieldImage1")[0].files[0];
    const fieldUpdateImage2 = $("#fieldImage2")[0].files[0];

    // Create a JavaScript object representing field data
    const fieldData = {
        name: fieldUpdateName,
        location: fieldUpdateLocation,
        size: fieldUpdateSize,
    };

    // Create FormData and append data and images
    const formData = new FormData();
    formData.append("fieldData", JSON.stringify(fieldData));
    if (fieldUpdateImage1) formData.append("image1", fieldUpdateImage1);
    if (fieldUpdateImage2) formData.append("image2", fieldUpdateImage2);


    // Perform the AJAX request
    $.ajax({
        url: `http://localhost:8080/greenShadow/api/v1/fields/${id}`,
        type: "PUT",
        data: formData,
        processData: false,
        contentType: false,
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token") // Include JWT in Authorization header
        },
        success: function (response) {
            console.log(response)
            // Clear the input fields in the modal
            clearFieldForm();
            // Hide the modal
            $("#addFieldModal").modal('hide');
            fetchFields();
            changeModalData();
            showAlert("Field Updated successfully", 'success');

        },
        error: function (xhr, status, error) {
            console.log(status,error)
           showAlert("Failed to Update field:", 'error');

        }
    });
});
function changeModalData(){
    // Change the modal header to "Update Member"
    document.getElementById('addFieldModalLabel').innerText = 'Add Field';

    // Change the button text from "Add Staff" to "Save Changes"
    // Hide the "Add Field" button
    document.getElementById("addField").style.display = "inline-block";
    // Show the "Save Changes" button
    document.getElementById("FieldSaveBtn").style.display = "none";
    initMap()
}
//fetch all fields
function fetchFields() {
    $.ajax({
        url: 'http://localhost:8080/greenShadow/api/v1/fields',
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        success: function (fields) {
            populateFields(fields);
        },
        error: function (error) {
            console.error("Error fetching fields:", error);
            $(".no-data").show();
        }
    });
}
//Display that field in ui
function populateFields(fields) {
    const container = $('#field-container');
    container.empty(); // Clear existing content

    if (fields.length === 0) {
        $(".no-data").show();
        return;
    }

    $(".no-data").hide();

    fields.forEach(field => {
        // Use the Base64 string as the source for each image
        const image1Src = field.image1 ? `data:image/jpeg;base64,${field.image1}` : 'https://via.placeholder.com/600x200?text=Field+Image+1';
        const image2Src = field.image2 ? `data:image/jpeg;base64,${field.image2}` : 'https://via.placeholder.com/600x200?text=Field+Image+2';
        const card = `
                <div class="card-custom "
                data-code="${field.fieldId}"
                data-name="${field.name}"
                data-size="${field.size}"
                data-location="${field.location}"
                data-image1="${image1Src}"
                data-image2="${image2Src}"
               
                >
                    <div class="slider" data-slider-index="0">
                      <img src="${image1Src}" class="active" alt="Field Image 1">
                       <img src="${image2Src}" alt="Field Image 2">
                        <div class="slider-buttons">
                            <button class="slider-button prev-button">&#10094;</button>
                            <button class="slider-button next-button">&#10095;</button>
                        </div>
                    </div>
                    <div class="card-content">
                        <div class="field-info">
                            <h4>${field.name}</h4>
                            <p>A beautiful field for growing crops.</p>
                        </div>
                        <div class="field-info">
                            <h4>Size</h4>
                            <p>${field.size} Sq. meters</p>
                        </div>
                        <div class="field-info">
                            <h4>Location</h4>
                            <p>GPS Coordinates: ${field.location}</p>
                        </div>
                        <div class="view-more-container">
                            <button type="button" class="btn view-btn" onclick="openFieldModal(this)">View more</button>
                        </div>
                    </div>
                </div>
            `;
        container.append(card);
        console.log(field.fieldId)
    });

    // initializeSliders();
    document.querySelectorAll('.slider').forEach((slider, sliderIndex) => {
        const images = slider.querySelectorAll('img');
        let currentImageIndex = 0;

        function showImage(index) {
            images.forEach((img, i) => {
                img.classList.remove('active');
                if (i === index) {
                    img.classList.add('active');
                }
            });
        }

        // Event listener for next button
        slider.querySelector('.next-button').addEventListener('click', () => {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            showImage(currentImageIndex);
        });

        // Event listener for previous button
        slider.querySelector('.prev-button').addEventListener('click', () => {
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            showImage(currentImageIndex);
        });
    });
}

//clear form
function clearFieldForm(){
    // Clear the form fields
    $("#addFieldModal").find("input, textarea, select").val("");

    // If you're previewing images in <img> tags, clear the preview as well
    $("#preview1").attr("src", ""); // Clear first image preview
    $("#preview2").attr("src", ""); // Clear second image preview
}
$(document).ready(function () {

    initMap()

});
var fieldId =null;

//view field data modal
function openFieldModal( button) {
    // Get the closest .card-custom container
    const card = $(button).closest('.card-custom');

    const fieldCode = card.data('code');
    fieldId=fieldCode;
    const fieldName = card.data('name');
    const fieldLocation = card.data('location'); // In "lat, long" format
    const fieldSize = card.data('size');
    const image1Src = card.data('image1');
    const image2Src = card.data('image2')
    console.log(fieldCode)
    // Populate modal fields
    $('#fieldCode').val(fieldCode);
    $('#fieldName').val(fieldName);
    $('#fieldLocation').val(fieldLocation);
    $('#fieldSize').val(fieldSize);
    // getFieldStaff(fieldCode)
    $.ajax({
        url: `http://localhost:8080/greenShadow/api/v1/fields/${fieldCode}/staff`, // Adjust the endpoint as needed
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        success: function(response) {
            // Assuming the response is an array of staff objects with "name" and "id"
            populateStaffDropdown(response);
        },
        error: function() {
            // If there is no staff, display a "No staff assigned" message
            populateStaffDropdown([]);
        }
    });
    // Set field images
    $('.image-gallery').html(`
        <img src="${image1Src}" alt="Field Image 1" class="field-image">
        <img src="${image2Src}" alt="Field Image 2" class="field-image">
    `);

   $("#fieldDetailModal").modal('show')



}

  $("#FieldUpdateBtn").click(function() {
        toggleFieldEditMode();
    })

//get staff related to field
function populateStaffDropdown(staff) {
    // Find the staff dropdown
    const staffDropdown = $('#field-staff');

    // Clear the current options
    staffDropdown.empty();

    // If there is no staff, display "No staff assigned"
    if (staff.length === 0) {
        staffDropdown.append('<option>No staff assigned</option>');
    } else {
        // Join the staff names with a comma and display as a single option
        const staffNames = staff.map(staffMember => staffMember.firstName).join(', ');
        staffDropdown.append(`<option>${staffNames}</option>`);
    }
}

//delete action
$("#FieldDeleteBtn").click(function () {
    const fieldId = $("#fieldCode").val(); // Assuming a hidden input or other source for field ID.

    if (!fieldId) {
        Swal.fire({
            icon: 'error',
            title: 'Field ID is missing!',
            text: 'Cannot delete the field.',
            confirmButtonText: 'OK'
        });
        return;
    }
    if (fieldId){
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
                    url: `http://localhost:8080/greenShadow/api/v1/fields/${fieldId}`, // Your delete endpoint
                    type: "DELETE",
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token") // Include JWT in Authorization header
                    },
                    success: function (response) {
                        // Perform actions on successful deletion
                        showAlert("Field deleted successfully.", "success");
                        $("#fieldDetailModal").modal("hide"); // Hide the modal

                        fetchFields()
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






