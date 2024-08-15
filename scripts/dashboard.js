document.addEventListener('DOMContentLoaded', () => {
    const leaseData = JSON.parse(localStorage.getItem('parsedLeaseData'));

    if (leaseData) {
        // Property Information
        document.getElementById('propertyAddress').textContent = leaseData.propertyAddress || 'Not specified';
        document.getElementById('squareFootage').textContent = leaseData.squareFootage || 'Not specified';

        // Lessee Information
        document.getElementById('lesseeName').textContent = leaseData.lesseeName || 'Not specified';
        document.getElementById('lesseeMailingAddress').textContent = leaseData.lesseeMailingAddress || 'Not specified';

        // Lease Terms
        document.getElementById('commencementDate').textContent = leaseData.commencementDate || 'Not specified';
        document.getElementById('expirationDate').textContent = leaseData.expirationDate || 'Not specified';
        
        // Rent Payment Schedule
        const rentScheduleElement = document.getElementById('rentPaymentSchedule');
        if (Array.isArray(leaseData.rentPaymentSchedule)) {
            rentScheduleElement.innerHTML = leaseData.rentPaymentSchedule.map(schedule => 
                `<p>${schedule.start} to ${schedule.end}: <strong>${schedule.payment}</strong></p>`
            ).join('');
        } else {
            rentScheduleElement.textContent = leaseData.rentPaymentSchedule || 'Not specified';
        }
        
        document.getElementById('rentDueDate').textContent = leaseData.rentDueDate || 'Not specified';
        document.getElementById('deposit').textContent = leaseData.deposit || 'Not specified';

        // Next Payment Due
        document.getElementById('nextMonthlyRentAmount').textContent = leaseData.nextMonthlyRentAmount || 'Not specified';
        document.getElementById('nextRentDueDate').textContent = leaseData.nextRentDueDate || 'Not specified';

        // Other Terms
        // Parking
        const parkingElement = document.getElementById('parking');
        if (typeof leaseData.parking === 'object' && leaseData.parking !== null) {
            parkingElement.innerHTML = `
                <p><strong>Spaces:</strong> ${leaseData.parking.spaces || 'Not specified'}</p>
            `;
        } else {
            parkingElement.textContent = leaseData.parking || 'Not specified';
        }


        // Maintenance/HVAC/CAM
        const maintenanceElement = document.getElementById('maintenanceHVACCAM');
        if (typeof leaseData.maintenanceHVACCAM === 'object' && leaseData.maintenanceHVACCAM !== null) {
            maintenanceElement.innerHTML = `
                <p><strong>Common Area Maintenance:</strong> ${leaseData.maintenanceHVACCAM.commonAreaMaintenance || 'Not specified'}</p>
                <p><strong>Real Estate Taxes:</strong> ${leaseData.maintenanceHVACCAM.realEstateTaxes || 'Not specified'}</p>
                <p><strong>Insurance:</strong> ${leaseData.maintenanceHVACCAM.insurance ? 
                    (leaseData.maintenanceHVACCAM.insurance.requirement || 'Required') : 
                    'Not specified'}</p>
            `;
        } else {
            maintenanceElement.textContent = leaseData.maintenanceHVACCAM || 'Not specified';
        }

        document.getElementById('insuranceRequirements').textContent = leaseData.insuranceRequirements || 'Not specified';
        document.getElementById('renewal').textContent = leaseData.renewal || 'Not specified';

    } else {
        document.body.innerHTML = '<h1>No lease data found. Please upload a lease document first.</h1>';
    }
});