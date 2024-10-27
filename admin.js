$(document).ready(function() {
    fetchCamps();

    // Add new camp
    $('#camp-form').on('submit', async function(e) {
        e.preventDefault();  // Prevent the default form submission

        const campData = {
            name: $('#name').val(),
            location: $('#location').val(),
            date: $('#date').val(),
            status: $('#status').val()
        };

        try {
            const response = await fetch('https://qa-events.onrender.com/api/camps', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(campData)
            });

            if (response.ok) {
                $('#success-message').removeClass('d-none');
                $('#error-message').addClass('d-none');
                $('#camp-form')[0].reset();  // Reset form fields
                fetchCamps();  // Refresh the camp list
            } else {
                throw new Error('Failed to add camp');
            }
        } catch (error) {
            $('#error-message').removeClass('d-none');
            console.error('Error adding camp:', error);
        }
    });

    // Fetch camps
    async function fetchCamps() {
        $('#camp-tbody').empty();  // Clear existing camp list
        try {
            const response = await fetch('https://qa-events.onrender.com/api/camps');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const camps = await response.json();

            camps.forEach(camp => {
                const row = `
                    <tr>
                        <td>${camp.name}</td>
                        <td>${camp.location}</td>
                        <td>${new Date(camp.date).toLocaleDateString()}</td>
                        <td><span class="badge bg-primary">${camp.status}</span></td>
                        <td>
                            <button class="btn btn-warning btn-sm edit-status" data-name="${camp.name}" data-status="${camp.status}">Edit Status</button>
                            <button class="btn btn-danger btn-sm delete-camp" data-name="${camp.name}">Delete</button>
                        </td>
                    </tr>
                `;
                $('#camp-tbody').append(row);
            });

            // Add event listeners for edit and delete buttons
            $('.edit-status').on('click', function() {
                const campName = $(this).data('name');
                const currentStatus = $(this).data('status');
                updateCampStatus(campName, currentStatus);
            });

            $('.delete-camp').on('click', function() {
                const campName = $(this).data('name');
                deleteCamp(campName);
            });

        } catch (error) {
            console.error('Error fetching camps:', error);
            $('#error-message').removeClass('d-none');
        }
    }

    // Function to update the status of a camp
    function updateCampStatus(campName, currentStatus) {
        // Create a dropdown for status selection
        const statusOptions = `
            <select id="status-dropdown" class="form-select" aria-label="Status select">
                <option value="Scheduled" ${currentStatus === 'Scheduled' ? 'selected' : ''}>Scheduled</option>
                <option value="Ongoing" ${currentStatus === 'Ongoing' ? 'selected' : ''}>Ongoing</option>
                <option value="Completed" ${currentStatus === 'Completed' ? 'selected' : ''}>Completed</option>
            </select>
        `;

        // Show the dropdown and update button
        const updateButton = `
            <button id="update-status-btn" class="btn btn-success btn-sm">Update</button>
        `;

        const campRow = $(`button.edit-status[data-name='${campName}']`).closest('tr');
        const actionsCell = campRow.find('td:last');

        // Replace the Edit Status button with the dropdown and Update button
        actionsCell.html(statusOptions + updateButton);

        // Update status when button is clicked
        $('#update-status-btn').on('click', async function() {
            const newStatus = $('#status-dropdown').val();
            const updatedData = { status: newStatus };

            try {
                const response = await fetch(`https://qa-events.onrender.com/api/camps/${campName}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedData)
                });

                if (response.ok) {
                    $('#success-message').removeClass('d-none');
                    $('#error-message').addClass('d-none');
                    fetchCamps();  // Refresh the camp list
                } else {
                    throw new Error('Failed to update camp status');
                }
            } catch (error) {
                $('#error-message').removeClass('d-none');
                $('#success-message').addClass('d-none');
                console.error('Error updating camp status:', error);
            }
        });
    }

    // Delete camp
    async function deleteCamp(campName) {
        if (confirm(`Are you sure you want to delete the camp "${campName}"?`)) {
            try {
                const response = await fetch(`https://qa-events.onrender.com/api/camps/${campName}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    $('#success-message').removeClass('d-none');
                    $('#error-message').addClass('d-none');
                    fetchCamps();  // Refresh the camp list
                } else {
                    throw new Error('Failed to delete camp');
                }
            } catch (error) {
                $('#error-message').removeClass('d-none');
                $('#success-message').addClass('d-none');
                console.error('Error deleting camp:', error);
            }
        }
    }
});
