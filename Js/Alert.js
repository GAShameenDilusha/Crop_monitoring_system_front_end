function showAlert(message, type) {
    const alertBox = document.getElementById('alertBox');
    const alertMessage = document.getElementById('alertMessage');

    // Set the message
    alertMessage.textContent = message;

    // Add the appropriate class for the alert type
    alertBox.classList.remove('success', 'error', 'hidden');
    alertBox.classList.add(type, 'visible');

    // Hide the alert after 3 seconds
    setTimeout(() => {
        closeAlert();
    }, 3000);
}

function closeAlert() {
    const alertBox = document.getElementById('alertBox');
    alertBox.classList.remove('visible');
    setTimeout(() => {
        alertBox.classList.add('hidden');
    }, 420);  // Time for the transition effect
}
