// Chart JS Code
var ctx1 = document.getElementById('growthChart').getContext('2d');
var growthChart = new Chart(ctx1, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [{
            label: 'Growth Rate',
            data: [3, 2, 5, 1, 6, 4, 7],
            borderColor: '#4caf50',
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
        }]
    }
});

var ctx2 = document.getElementById('yieldChart').getContext('2d');
var yieldChart = new Chart(ctx2, {
    type: 'bar',
    data: {
        labels: ['Crop A', 'Crop B', 'Crop C', 'Crop D'],
        datasets: [{
            label: 'Yield (kg)',
            data: [120, 150, 180, 100],
            backgroundColor: '#ffa726'
        }]
    }
});
// Toggle sidebar for mobile

$(document).ready(function() {
    $('.menu-toggle').on('click', function() {
        $('.sidebar').toggleClass('active');
        console.log("Toggle clicked"); // Debugging line
    });
});




/*////////////////////////////////////////////////////////*/
function updateDateTime() {
    // Create new date object
    const now = new Date();

    // Update date
    const date = now.toISOString().split('T')[0];
    document.getElementById('lbl-order-date').textContent = date;

    // Update time with seconds
    const time = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('lbl-order-time').textContent = time;
}

// Update initially
updateDateTime();

// Update every second
setInterval(updateDateTime, 1000);


