const modal = document.getElementById('add-animal-modal');
const addAnimalBtn = document.getElementById('add-animal-btn');
const closeModalBtn = document.getElementById('close-modal');
const cancelModalBtn = document.getElementById('cancel-modal');
const animalForm = document.getElementById('animal-form');
const logoutBtn = document.getElementById('logout-btn');

let animals = [];
let alerts = [];

async function loadDashboardData() {
    try {
        const [animalsData, alertsData, statsData] = await Promise.all([
            apiRequest('/api/animals'),
            apiRequest('/api/health-alerts'),
            apiRequest('/api/stats')
        ]);

        if (animalsData.success) {
            animals = animalsData.data;
            renderAnimals();
        }

        if (alertsData.success) {
            alerts = alertsData.data;
            renderAlerts();
        }

        if (statsData.success) {
            updateStats(statsData.data);
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

function updateStats(stats) {
    document.getElementById('total-animals').textContent = stats.totalAnimals;
    document.getElementById('healthy-animals').textContent = stats.healthyAnimals;
    document.getElementById('active-alerts').textContent = stats.activeAlerts;
    document.getElementById('average-age').textContent = stats.averageAge.toFixed(1);
}

function renderAnimals() {
    const container = document.getElementById('animals-grid');

    if (animals.length === 0) {
        container.innerHTML = '<p class="empty-state">No animals added yet</p>';
        return;
    }

    container.innerHTML = animals.map(animal => `
        <div class="animal-card">
            <div class="animal-header">
                <h3>${animal.name}</h3>
                <span class="health-badge ${animal.health_status}">${animal.health_status}</span>
            </div>
            <div class="animal-details">
                <div class="detail-row">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 2a10 10 0 1 0 10 10H12V2Z"></path>
                        <path d="M12 12 20.5 3.5"></path>
                    </svg>
                    <span><strong>Species:</strong> ${animal.species}</span>
                </div>
                <div class="detail-row">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span><strong>Age:</strong> ${animal.age} years</span>
                </div>
                <div class="detail-row">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span><strong>Location:</strong> ${animal.location}</span>
                </div>
                <div class="detail-row">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span><strong>Last Checkup:</strong> ${formatDate(animal.last_checkup)}</span>
                </div>
            </div>
            <div class="animal-actions">
                <button class="btn btn-danger btn-sm" onclick="deleteAnimal('${animal.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

function renderAlerts() {
    const container = document.getElementById('alerts-container');

    const activeAlerts = alerts.filter(alert => alert.status === 'active');

    if (activeAlerts.length === 0) {
        container.innerHTML = '<p class="empty-state">No active alerts</p>';
        return;
    }

    container.innerHTML = activeAlerts.map(alert => `
        <div class="alert-card ${alert.severity}">
            <div class="alert-info">
                <h3>${alert.alert_type}</h3>
                <p>${alert.description}</p>
                <div class="alert-meta">
                    <span>Animal: ${alert.animals?.name || 'Unknown'}</span>
                    <span>Severity: ${alert.severity}</span>
                    <span>${formatDate(alert.created_at)}</span>
                </div>
            </div>
            <button class="btn btn-primary btn-sm" onclick="resolveAlert('${alert.id}')">Resolve</button>
        </div>
    `).join('');
}

addAnimalBtn.addEventListener('click', () => {
    modal.classList.add('show');
});

closeModalBtn.addEventListener('click', () => {
    modal.classList.remove('show');
    animalForm.reset();
});

cancelModalBtn.addEventListener('click', () => {
    modal.classList.remove('show');
    animalForm.reset();
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('show');
        animalForm.reset();
    }
});

animalForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById('animal-name').value,
        species: document.getElementById('animal-species').value,
        age: parseFloat(document.getElementById('animal-age').value),
        location: document.getElementById('animal-location').value,
        health_status: document.getElementById('animal-health-status').value,
        last_checkup: document.getElementById('animal-checkup').value
    };

    try {
        const data = await apiRequest('/api/animals', {
            method: 'POST',
            body: JSON.stringify(formData)
        });

        if (data.success) {
            modal.classList.remove('show');
            animalForm.reset();
            await loadDashboardData();
        }
    } catch (error) {
        alert('Error adding animal: ' + error.message);
    }
});

async function deleteAnimal(animalId) {
    if (!confirm('Are you sure you want to delete this animal?')) {
        return;
    }

    try {
        const data = await apiRequest(`/api/animals/${animalId}`, {
            method: 'DELETE'
        });

        if (data.success) {
            await loadDashboardData();
        }
    } catch (error) {
        alert('Error deleting animal: ' + error.message);
    }
}

async function resolveAlert(alertId) {
    try {
        const data = await apiRequest(`/api/health-alerts/${alertId}/resolve`, {
            method: 'POST'
        });

        if (data.success) {
            await loadDashboardData();
        }
    } catch (error) {
        alert('Error resolving alert: ' + error.message);
    }
}

logoutBtn.addEventListener('click', async () => {
    try {
        const data = await apiRequest('/api/auth/logout', {
            method: 'POST'
        });

        if (data.success) {
            window.location.href = '/auth';
        }
    } catch (error) {
        alert('Error logging out: ' + error.message);
    }
});

loadDashboardData();
