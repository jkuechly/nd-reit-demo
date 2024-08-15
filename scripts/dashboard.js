document.addEventListener('DOMContentLoaded', () => {
    const leaseData = JSON.parse(localStorage.getItem('parsedLeaseData'));

    if (leaseData) {
        // Property Information
        document.getElementById('propertyAddress').textContent = leaseData.propertyAddress;
        document.getElementById('squareFootage').textContent = leaseData.squareFootage;

        // Lessee Information
        document.getElementById('lesseeName').textContent = leaseData.lesseeName;
        document.getElementById('lesseeMailingAddress').textContent = leaseData.lesseeMailingAddress;

        // Lease Terms
        document.getElementById('commencementDate').textContent = leaseData.commencementDate;
        document.getElementById('expirationDate').textContent = leaseData.expirationDate;
        document.getElementById('rentPaymentSchedule').textContent = leaseData.rentPaymentSchedule;
        document.getElementById('rentDueDate').textContent = leaseData.rentDueDate;
        document.getElementById('deposit').textContent = leaseData.deposit;

        // Next Payment Due
        document.getElementById('nextMonthlyRentAmount').textContent = leaseData.nextMonthlyRentAmount;
        document.getElementById('nextRentDueDate').textContent = leaseData.nextRentDueDate;

        // Other Terms
        document.getElementById('parking').textContent = leaseData.parking;
        document.getElementById('maintenanceHVACCAM').textContent = leaseData.maintenanceHVACCAM;
        document.getElementById('insuranceRequirements').textContent = leaseData.insuranceRequirements;
        document.getElementById('renewal').textContent = leaseData.renewal;
    } else {
        document.body.innerHTML = '<h1>No lease data found. Please upload a lease document first.</h1>';
    }
});