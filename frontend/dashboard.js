
// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize calendar
    const calendarEl = document.querySelector('.calendar-container');
    if (calendarEl) {
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            // Add more options as needed
        });
        calendar.render();
    }

    // Initialize Google Maps
    function initMap() {
        const mapElement = document.getElementById('admin-map') || 
                          document.getElementById('patient-map') || 
                          document.getElementById('provider-map');
        
        if (mapElement) {
            const map = new google.maps.Map(mapElement, {
                center: { lat: -34.397, lng: 150.644 },
                zoom: 8,
            });
            // Add markers, etc. as needed
        }
    }

    // Sidebar Toggle Functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.dashboard-sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            document.querySelector('.dashboard-main').classList.toggle('expanded');
        });
    }

    // Notifications Toggle
    const notificationToggle = document.querySelector('.notification-toggle');
    const notificationPanel = document.querySelector('.notifications-panel');
    
    if (notificationToggle && notificationPanel) {
        notificationToggle.addEventListener('click', function() {
            notificationPanel.classList.toggle('show');
        });

        // Close notifications when clicking outside
        document.addEventListener('click', function(event) {
            if (!notificationToggle.contains(event.target) && !notificationPanel.contains(event.target)) {
                notificationPanel.classList.remove('show');
            }
        });
    }

    // Profile Dropdown Toggle
    const profileToggle = document.querySelector('.profile-toggle');
    const profileDropdown = document.querySelector('.profile-dropdown');
    
    if (profileToggle && profileDropdown) {
        profileToggle.addEventListener('click', function() {
            profileDropdown.classList.toggle('show');
        });

        // Close profile dropdown when clicking outside
        document.addEventListener('click', function(event) {
            if (!profileToggle.contains(event.target) && !profileDropdown.contains(event.target)) {
                profileDropdown.classList.remove('show');
            }
        });
    }

    // Tab Switching Functionality
    const tabButtons = document.querySelectorAll('.dashboard-tab');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked button and corresponding panel
            button.classList.add('active');
            document.getElementById(target).classList.add('active');
        });
    });

    // Search Functionality
    const searchInput = document.querySelector('.dashboard-search input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            // Implement search logic here
            console.log('Searching for:', searchTerm);
        });
    }

    // Video conferencing functionality
    const zoomButton = document.getElementById('start-zoom');
    const meetButton = document.getElementById('start-meet');

    if (zoomButton) {
        zoomButton.addEventListener('click', function() {
            // Implement Zoom meeting logic here
            console.log('Starting Zoom meeting...');
        });
    }

    if (meetButton) {
        meetButton.addEventListener('click', function() {
            // Implement Google Meet logic here
            console.log('Starting Google Meet...');
        });
    }

    // Chart.js Integration (if you're using charts)
    if (typeof Chart !== 'undefined') {
        // Patient Statistics Chart
        const patientStatsChart = document.getElementById('patientStatsChart');
        if (patientStatsChart) {
            new Chart(patientStatsChart, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Appointments',
                        data: [12, 19, 3, 5, 2, 3],
                        borderColor: '#4CAF50',
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }

        // Provider Statistics Chart
        const providerStatsChart = document.getElementById('providerStatsChart');
        if (providerStatsChart) {
            new Chart(providerStatsChart, {
                type: 'bar',
                data: {
                    labels: ['Patients', 'Appointments', 'Reviews', 'Revenue'],
                    datasets: [{
                        label: 'Monthly Statistics',
                        data: [65, 59, 80, 81],
                        backgroundColor: ['#2196F3', '#4CAF50', '#FFC107', '#F44336']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }

        // Admin Dashboard Charts
        const adminRevenueChart = document.getElementById('adminRevenueChart');
        if (adminRevenueChart) {
            new Chart(adminRevenueChart, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Revenue',
                        data: [1200, 1900, 3000, 5000, 2000, 3000],
                        borderColor: '#2196F3',
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
    }

    // Table Sorting Functionality
    const tables = document.querySelectorAll('.dashboard-table');
    tables.forEach(table => {
        const headers = table.querySelectorAll('th[data-sort]');
        headers.forEach(header => {
            header.addEventListener('click', () => {
                const column = header.dataset.sort;
                const rows = Array.from(table.querySelectorAll('tbody tr'));
                const isAsc = header.classList.contains('asc');
                
                // Sort rows
                rows.sort((a, b) => {
                    const aValue = a.querySelector(`td[data-${column}]`).textContent;
                    const bValue = b.querySelector(`td[data-${column}]`).textContent;
                    return isAsc 
                        ? bValue.localeCompare(aValue) 
                        : aValue.localeCompare(bValue);
                });

                // Update sort direction
                headers.forEach(h => h.classList.remove('asc', 'desc'));
                header.classList.toggle('asc', !isAsc);
                header.classList.toggle('desc', isAsc);

                // Reorder table rows
                const tbody = table.querySelector('tbody');
                rows.forEach(row => tbody.appendChild(row));
            });
        });
    });

       // Form Validation
       const forms = document.querySelectorAll('.dashboard-form');
       forms.forEach(form => {
           form.addEventListener('submit', function(event) {
               event.preventDefault();
               let isValid = true;
               
               // Get all required inputs
               const requiredInputs = form.querySelectorAll('[required]');
               
               requiredInputs.forEach(input => {
                   if (!input.value.trim()) {
                       isValid = false;
                       input.classList.add('error');
                       
                       // Create or update error message
                       let errorMsg = input.nextElementSibling;
                       if (!errorMsg || !errorMsg.classList.contains('error-message')) {
                           errorMsg = document.createElement('span');
                           errorMsg.classList.add('error-message');
                           input.parentNode.insertBefore(errorMsg, input.nextSibling);
                       }
                       errorMsg.textContent = 'This field is required';
                   } else {
                       input.classList.remove('error');
                       const errorMsg = input.nextElementSibling;
                       if (errorMsg && errorMsg.classList.contains('error-message')) {
                           errorMsg.remove();
                       }
                   }
               });
   
               if (isValid) {
                   // Proceed with form submission
                   console.log('Form is valid, submitting...');
                   // Add your form submission logic here
               }
           });
       });
   
       // Modal Functionality
       const modalTriggers = document.querySelectorAll('[data-modal-target]');
       const modalCloseButtons = document.querySelectorAll('[data-modal-close]');
       const modals = document.querySelectorAll('.dashboard-modal');
   
       modalTriggers.forEach(trigger => {
           trigger.addEventListener('click', () => {
               const modalId = trigger.getAttribute('data-modal-target');
               const modal = document.getElementById(modalId);
               if (modal) {
                   modal.classList.add('show');
               }
           });
       });
   
       modalCloseButtons.forEach(button => {
           button.addEventListener('click', () => {
               const modal = button.closest('.dashboard-modal');
               if (modal) {
                   modal.classList.remove('show');
               }
           });
       });
   
       // Close modal when clicking outside
       window.addEventListener('click', (event) => {
           modals.forEach(modal => {
               if (event.target === modal) {
                   modal.classList.remove('show');
               }
           });
       });
   
       // File Upload Preview
       const fileInputs = document.querySelectorAll('.file-upload-input');
       fileInputs.forEach(input => {
           input.addEventListener('change', function(event) {
               const file = event.target.files[0];
               const preview = input.closest('.file-upload').querySelector('.file-preview');
               
               if (preview && file) {
                   if (file.type.startsWith('image/')) {
                       const reader = new FileReader();
                       reader.onload = function(e) {
                           preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                       };
                       reader.readAsDataURL(file);
                   } else {
                       preview.innerHTML = `<p>${file.name}</p>`;
                   }
               }
           });
       });
   
       // Real-time Data Update (if using WebSocket)
       let ws;
       function initializeWebSocket() {
           ws = new WebSocket('your-websocket-url');
           
           ws.onopen = function() {
               console.log('WebSocket connection established');
           };
   
           ws.onmessage = function(event) {
               const data = JSON.parse(event.data);
               updateDashboardData(data);
           };
   
           ws.onclose = function() {
               console.log('WebSocket connection closed');
               // Attempt to reconnect after 5 seconds
               setTimeout(initializeWebSocket, 5000);
           };
       }
   
       function updateDashboardData(data) {
        // Update real-time statistics
        if (data.statistics) {
            Object.keys(data.statistics).forEach(key => {
                const element = document.querySelector(`[data-statistic="${key}"]`);
                if (element) {
                    element.textContent = data.statistics[key];
                }
            });
        }

        // Update notifications
        if (data.notifications) {
            const notificationsList = document.querySelector('.notifications-list');
            if (notificationsList) {
                data.notifications.forEach(notification => {
                    const notificationElement = document.createElement('div');
                    notificationElement.classList.add('notification-item');
                    notificationElement.innerHTML = `
                        <div class="notification-content">
                            <h4>${notification.title}</h4>
                            <p>${notification.message}</p>
                            <span class="notification-time">${notification.time}</span>
                        </div>
                    `;
                    notificationsList.prepend(notificationElement);
                });
            }
        }

        // Update appointment status
        if (data.appointments) {
            const appointmentsList = document.querySelector('.appointments-list');
            if (appointmentsList) {
                data.appointments.forEach(appointment => {
                    const appointmentElement = document.querySelector(`[data-appointment-id="${appointment.id}"]`);
                    if (appointmentElement) {
                        appointmentElement.querySelector('.status').textContent = appointment.status;
                        appointmentElement.querySelector('.status').className = `status ${appointment.status.toLowerCase()}`;
                    }
                });
            }
        }
    }

    // Export functionality
    const exportButtons = document.querySelectorAll('.export-button');
    exportButtons.forEach(button => {
        button.addEventListener('click', function() {
            const type = button.getAttribute('data-export-type');
            const targetId = button.getAttribute('data-target');
            const content = document.getElementById(targetId);

            if (content) {
                switch(type) {
                    case 'pdf':
                        exportToPDF(content);
                        break;
                    case 'excel':
                        exportToExcel(content);
                        break;
                    case 'csv':
                        exportToCSV(content);
                        break;
                }
            }
        });
    });

    function exportToPDF(content) {
        html2pdf()
            .from(content)
            .save('dashboard-report.pdf');
    }

    function exportToExcel(content) {
        const workbook = XLSX.utils.table_to_book(content);
        XLSX.writeFile(workbook, 'dashboard-report.xlsx');
    }

    function exportToCSV(content) {
        const rows = content.querySelectorAll('tr');
        let csv = [];
        
        rows.forEach(row => {
            const cells = row.querySelectorAll('td, th');
            const rowData = Array.from(cells).map(cell => cell.textContent);
            csv.push(rowData.join(','));
        });

        const csvContent = "data:text/csv;charset=utf-8," + csv.join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "dashboard-report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Theme Switcher
    const themeSwitcher = document.querySelector('.theme-switcher');
    if (themeSwitcher) {
        themeSwitcher.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            const isDarkTheme = document.body.classList.contains('dark-theme');
            localStorage.setItem('darkTheme', isDarkTheme);
        });

                // Check for saved theme preference
                const savedTheme = localStorage.getItem('darkTheme');
                if (savedTheme === 'true') {
                    document.body.classList.add('dark-theme');
                }
            }
        
            // Search Functionality
            const searchInputs = document.querySelectorAll('.dashboard-search');
            searchInputs.forEach(input => {
                input.addEventListener('input', function(e) {
                    const searchTerm = e.target.value.toLowerCase();
                    const searchTarget = input.getAttribute('data-search-target');
                    const items = document.querySelectorAll(`[data-search-item="${searchTarget}"]`);
        
                    items.forEach(item => {
                        const text = item.textContent.toLowerCase();
                        if (text.includes(searchTerm)) {
                            item.style.display = '';
                        } else {
                            item.style.display = 'none';
                        }
                    });
                });
            });
        
            // Pagination
            function setupPagination() {
                const paginationContainers = document.querySelectorAll('.pagination-container');
                paginationContainers.forEach(container => {
                    const itemsPerPage = parseInt(container.getAttribute('data-items-per-page')) || 10;
                    const items = container.querySelectorAll('.pagination-item');
                    const pageCount = Math.ceil(items.length / itemsPerPage);
                    let currentPage = 1;
        
                    function showPage(page) {
                        const start = (page - 1) * itemsPerPage;
                        const end = start + itemsPerPage;
        
                        items.forEach((item, index) => {
                            item.style.display = (index >= start && index < end) ? '' : 'none';
                        });
                    }
        
                    function createPaginationControls() {
                        const controls = document.createElement('div');
                        controls.className = 'pagination-controls';
        
                        // Previous button
                        const prevButton = document.createElement('button');
                        prevButton.textContent = 'Previous';
                        prevButton.addEventListener('click', () => {
                            if (currentPage > 1) {
                                currentPage--;
                                showPage(currentPage);
                                updateControls();
                            }
                        });
        
                        // Next button
                        const nextButton = document.createElement('button');
                        nextButton.textContent = 'Next';
                        nextButton.addEventListener('click', () => {
                            if (currentPage < pageCount) {
                                currentPage++;
                                showPage(currentPage);
                                updateControls();
                            }
                        });
        
                        // Page numbers
                        const pageNumbers = document.createElement('div');
                        pageNumbers.className = 'page-numbers';
        
                        controls.appendChild(prevButton);
                        controls.appendChild(pageNumbers);
                        controls.appendChild(nextButton);
                        container.appendChild(controls);
        
                        function updateControls() {
                            prevButton.disabled = currentPage === 1;
                            nextButton.disabled = currentPage === pageCount;
                            
                            pageNumbers.innerHTML = '';
                            for (let i = 1; i <= pageCount; i++) {
                                const pageButton = document.createElement('button');
                                pageButton.textContent = i;
                                pageButton.classList.toggle('active', i === currentPage);
                                pageButton.addEventListener('click', () => {
                                    currentPage = i;
                                    showPage(currentPage);
                                    updateControls();
                                });
                                pageNumbers.appendChild(pageButton);
                            }
                        }
        
                        updateControls();
                    }
        
                    showPage(1);
                    createPaginationControls();
                });
            }
        
            // Initialize pagination if needed
            setupPagination();
        
            // Error Handling
            window.addEventListener('error', function(event) {
                console.error('An error occurred:', event.error);
                // You can implement custom error handling/reporting here
            });
        
            // Cleanup function
            function cleanup() {
                // Close WebSocket connection
                if (ws) {
                    ws.close();
                }
        
                        // Remove event listeners
        window.removeEventListener('error', errorHandler);
        window.removeEventListener('click', modalClickHandler);
        
        forms.forEach(form => {
            form.removeEventListener('submit', formSubmitHandler);
        });

        modalTriggers.forEach(trigger => {
            trigger.removeEventListener('click', modalOpenHandler);
        });

        modalCloseButtons.forEach(button => {
            button.removeEventListener('click', modalCloseHandler);
        });

        fileInputs.forEach(input => {
            input.removeEventListener('change', fileChangeHandler);
        });

        searchInputs.forEach(input => {
            input.removeEventListener('input', searchHandler);
        });

        if (themeSwitcher) {
            themeSwitcher.removeEventListener('click', themeToggleHandler);
        }
    }

    // Initialize Dashboard
    function initializeDashboard() {
        // Initialize charts if any
        if (typeof initializeCharts === 'function') {
            initializeCharts();
        }

        // Initialize WebSocket connection
        initializeWebSocket();

        // Set up real-time updates
        setInterval(() => {
            fetchDashboardUpdates();
        }, 30000); // Update every 30 seconds

        // Initialize tooltips
        const tooltips = document.querySelectorAll('[data-tooltip]');
        tooltips.forEach(tooltip => {
            new Tooltip(tooltip);
        });

        // Initialize any third-party plugins
        initializePlugins();
    }

    function initializePlugins() {
        // Initialize any third-party plugins here
        try {
            // Example: Initialize DataTables
            if ($.fn.DataTable) {
                $('.data-table').DataTable({
                    responsive: true,
                    pageLength: 10,
                    language: {
                        search: "Search:",
                        lengthMenu: "Show _MENU_ entries per page",
                        info: "Showing _START_ to _END_ of _TOTAL_ entries"
                    }
                });
            }

            // Example: Initialize Select2
            if ($.fn.select2) {
                $('.enhanced-select').select2({
                    placeholder: "Select an option",
                    allowClear: true
                });
            }
        } catch (error) {
            console.error('Error initializing plugins:', error);
        }
    }

    function fetchDashboardUpdates() {
        fetch('/api/dashboard/updates')
            .then(response => response.json())
            .then(data => {
                updateDashboardData(data);
            })
            .catch(error => {
                console.error('Error fetching dashboard updates:', error);
            });
    }

    // Tooltip Class
    class Tooltip {
        constructor(element) {
            this.element = element;
            this.tooltip = null;
            this.text = element.getAttribute('data-tooltip');
            this.init();
        }

        init() {
            this.element.addEventListener('mouseenter', () => this.show());
            this.element.addEventListener('mouseleave', () => this.hide());
        }

        show() {
            this.tooltip = document.createElement('div');
            this.tooltip.className = 'tooltip';
            this.tooltip.textContent = this.text;
            document.body.appendChild(this.tooltip);

            const elementRect = this.element.getBoundingClientRect();
            const tooltipRect = this.tooltip.getBoundingClientRect();

            this.tooltip.style.top = `${elementRect.top - tooltipRect.height - 10}px`;
            this.tooltip.style.left = `${elementRect.left + (elementRect.width - tooltipRect.width) / 2}px`;
        }

        hide() {
            if (this.tooltip) {
                this.tooltip.remove();
                this.tooltip = null;
            }
        }
    }

    // Initialize dashboard when DOM is ready
    document.addEventListener('DOMContentLoaded', initializeDashboard);

        // Cleanup when unloading
        window.addEventListener('unload', () => {
            cleanup();
        });
    
        // Handle visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Pause real-time updates when tab is not visible
                if (updateInterval) {
                    clearInterval(updateInterval);
                }
            } else {
                // Resume real-time updates when tab becomes visible
                updateInterval = setInterval(() => {
                    fetchDashboardUpdates();
                }, 30000);
            }
        });
    
        // Handle network status
        window.addEventListener('online', () => {
            console.log('Network connection restored');
            initializeWebSocket();
            fetchDashboardUpdates();
        });
    
        window.addEventListener('offline', () => {
            console.log('Network connection lost');
            if (ws) {
                ws.close();
            }
        });
    
        // Handle system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addListener((e) => {
                if (!localStorage.getItem('darkTheme')) {
                    document.body.classList.toggle('dark-theme', e.matches);
                }
            });
        }
    
        // Mobile responsive menu toggle
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const sideNav = document.querySelector('.dashboard-sidenav');
    
        if (mobileMenuToggle && sideNav) {
            mobileMenuToggle.addEventListener('click', () => {
                sideNav.classList.toggle('active');
                mobileMenuToggle.classList.toggle('active');
            });
    
            // Close mobile menu when clicking outside
            document.addEventListener('click', (event) => {
                if (!sideNav.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
                    sideNav.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                }
            });
        }
    
        // Export dashboard functionality
        return {
            initialize: initializeDashboard,
            update: updateDashboardData,
            refresh: fetchDashboardUpdates,
            cleanup: cleanup,
            exportData: {
                toPDF: exportToPDF,
                toExcel: exportToExcel,
                toCSV: exportToCSV
            },
            toggleTheme: () => {
                if (themeSwitcher) {
                    themeSwitcher.click();
                }
            }
        };
    })();
    
    // Export for use in other modules
    export default Dashboard;
    
    // For CommonJS environments
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Dashboard;
    }
    
    // For AMD environments
    if (typeof define === 'function' && define.amd) {
        define([], function() {
            return Dashboard;
        });
    }
    
    // For global browser use
    if (typeof window !== 'undefined') {
        window.Dashboard = Dashboard;
    }