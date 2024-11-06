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
