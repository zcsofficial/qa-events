$(document).ready(async function() {
    // Initial fetch of camp data
    await fetchCamps();

    // Fetch camp data and populate table
    async function fetchCamps() {
        $('#loading-message').removeClass('d-none');
        $('#error-message').addClass('d-none');
        $('#camp-list').empty();

        try {
            const response = await fetch('http://127.0.0.1:5000/api/camps');
            if (!response.ok) throw new Error('Failed to fetch data');
            
            const camps = await response.json();
            populateTable(camps);
        } catch (error) {
            $('#error-message').removeClass('d-none');
            console.error('Error fetching camps:', error);
        } finally {
            $('#loading-message').addClass('d-none');
        }
    }

    // Populate DataTable with data and apply advanced options
    function populateTable(camps) {
        const tableBody = $('#camp-list');
        
        camps.forEach(camp => {
            const row = `
                <tr>
                    <td>${camp.name}</td>
                    <td>${camp.location}</td>
                    <td>${new Date(camp.date).toLocaleDateString()}</td>
                    <td>
                        <span class="badge ${getStatusBadgeClass(camp.status)}">${camp.status}</span>
                    </td>
                </tr>
            `;
            tableBody.append(row);
        });

        // Initialize DataTable with enhanced styling and interactivity
        $('#camp-table').DataTable({
            order: [[2, 'desc']],
            paging: true,
            searching: true,
            responsive: true,
            destroy: true  // Allows re-initialization on refresh
        });
    }

    // Utility to determine badge class based on status
    function getStatusBadgeClass(status) {
        switch (status) {
            case 'Scheduled':
                return 'bg-primary';
            case 'Ongoing':
                return 'bg-success';
            case 'Completed':
                return 'bg-secondary';
            default:
                return 'bg-dark';
        }
    }

    // Refresh data when "Refresh" button is clicked
    window.refreshData = async function() {
        $('#camp-table').DataTable().clear().destroy();
        await fetchCamps();
    };
});
