// State management
let events = JSON.parse(localStorage.getItem('events')) || [];
let currentEventId = null;
let selectedResponse = null;

// DOM Elements
const homePage = document.getElementById('home-page');
const createPage = document.getElementById('create-page');
const eventPage = document.getElementById('event-page');

// Navigation
document.getElementById('nav-home').addEventListener('click', (e) => {
    e.preventDefault();
    showPage('home');
});
document.getElementById('nav-create').addEventListener('click', (e) => {
    e.preventDefault();
    showPage('create');
});
document.getElementById('nav-home-brand').addEventListener('click', (e) => {
    e.preventDefault();
    showPage('home');
});
document.getElementById('create-event-btn').addEventListener('click', () => showPage('create'));
document.getElementById('cancel-create').addEventListener('click', () => {
    clearCreateForm();
    showPage('home');
});
document.getElementById('back-to-home').addEventListener('click', () => showPage('home'));

// Page navigation
function showPage(page) {
    homePage.classList.remove('active');
    createPage.classList.remove('active');
    eventPage.classList.remove('active');

    if (page === 'home') {
        homePage.classList.add('active');
        renderEventList();
    } else if (page === 'create') {
        createPage.classList.add('active');
    } else if (page === 'event') {
        eventPage.classList.add('active');
    }
}

// Event creation
document.getElementById('save-event').addEventListener('click', createEvent);

function createEvent() {
    const title = document.getElementById('event-title').value || 'Untitled Event';
    const date = document.getElementById('event-date').value;
    const location = document.getElementById('event-location').value;
    const host = document.getElementById('event-host').value;
    const description = document.getElementById('event-description').value;
    const guestEmails = document.getElementById('guest-emails').value;
    const theme = document.querySelector('.theme-btn.active')?.dataset.theme || 'classic';

    if (!date) {
        alert('Please select a date and time for your event');
        return;
    }

    const event = {
        id: Date.now().toString(),
        title,
        date,
        location,
        host,
        description,
        guestEmails: guestEmails.split(',').map(email => email.trim()).filter(Boolean),
        theme,
        rsvps: [],
        createdAt: new Date().toISOString()
    };

    events.push(event);
    localStorage.setItem('events', JSON.stringify(events));
    
    clearCreateForm();
    showEvent(event.id);
}

function clearCreateForm() {
    document.getElementById('event-title').value = '';
    document.getElementById('event-date').value = '';
    document.getElementById('event-location').value = '';
    document.getElementById('event-host').value = '';
    document.getElementById('event-description').value = '';
    document.getElementById('guest-emails').value = '';
    
    // Reset theme
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-outline-primary');
    });
    const classicBtn = document.querySelector('.theme-btn[data-theme="classic"]');
    if (classicBtn) {
        classicBtn.classList.add('active');
        classicBtn.classList.remove('btn-outline-primary');
        classicBtn.classList.add('btn-primary');
    }
}

// Theme selection
document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.theme-btn').forEach(b => {
            b.classList.remove('active');
            b.classList.remove('btn-primary');
            b.classList.add('btn-outline-primary');
        });
        this.classList.add('active');
        this.classList.remove('btn-outline-primary');
        this.classList.add('btn-primary');
    });
});

// Render event list
function renderEventList() {
    const eventList = document.getElementById('event-list');
    
    if (events.length === 0) {
        eventList.innerHTML = `
            <div class="col-12">
                <div class="alert alert-light text-center py-5">
                    <i class="bi bi-calendar-x display-4 text-muted mb-3 d-block"></i>
                    <p class="mb-0 text-muted">No events yet. Create your first event!</p>
                </div>
            </div>
        `;
        return;
    }

    eventList.innerHTML = events.map(event => {
        const rsvpCounts = getRSVPCounts(event.rsvps);
        const formattedDate = formatDate(event.date);
        
        return `
            <div class="col-md-6 col-lg-4">
                <div class="card event-card shadow-sm h-100" onclick="showEvent('${event.id}')">
                    <div class="card-body">
                        <h5 class="card-title event-card-title">${event.title}</h5>
                        <div class="event-card-meta">
                            <div><i class="bi bi-calendar-event me-2"></i>${formattedDate}</div>
                            ${event.location ? `<div><i class="bi bi-geo-alt me-2"></i>${event.location}</div>` : ''}
                            ${event.host ? `<div><i class="bi bi-person me-2"></i>${event.host}</div>` : ''}
                        </div>
                        <div class="event-card-stats">
                            <span><i class="bi bi-check-circle me-1 text-success"></i>${rsvpCounts.going}</span>
                            <span><i class="bi bi-question-circle me-1 text-warning"></i>${rsvpCounts.maybe}</span>
                            <span><i class="bi bi-x-circle me-1 text-danger"></i>${rsvpCounts.cantGo}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Show event
window.showEvent = function(eventId) {
    currentEventId = eventId;
    const event = events.find(e => e.id === eventId);
    
    if (!event) {
        alert('Event not found');
        showPage('home');
        return;
    }

    // Populate event view
    document.getElementById('view-event-title').textContent = event.title;
    document.getElementById('view-event-date').innerHTML = `<i class="bi bi-calendar-event me-2"></i>${formatDate(event.date)}`;
    document.getElementById('view-event-location').innerHTML = event.location ? `<i class="bi bi-geo-alt me-2"></i>${event.location}` : '';
    document.getElementById('view-event-host').innerHTML = event.host ? `<i class="bi bi-person me-2"></i>Hosted by ${event.host}` : '';
    document.getElementById('view-event-description').textContent = event.description || 'No description provided.';

    // Clear RSVP form
    document.getElementById('guest-name').value = '';
    document.getElementById('guest-email').value = '';
    selectedResponse = null;
    document.querySelectorAll('.rsvp-btn').forEach(btn => {
        btn.classList.remove('selected');
        btn.classList.remove('active');
    });

    // Render guest list
    renderGuestList(event);
    
    showPage('event');
};

// RSVP handling
    document.querySelectorAll('.rsvp-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.rsvp-btn').forEach(b => {
                b.classList.remove('selected');
                b.classList.remove('active');
            });
            this.classList.add('selected');
            this.classList.add('active');
            selectedResponse = this.dataset.response;
        });
    });

document.getElementById('submit-rsvp').addEventListener('click', submitRSVP);

function submitRSVP() {
    const name = document.getElementById('guest-name').value.trim();
    const email = document.getElementById('guest-email').value.trim();

    if (!name || !email) {
        alert('Please enter your name and email');
        return;
    }

    if (!selectedResponse) {
        alert('Please select an RSVP option');
        return;
    }

    if (!isValidEmail(email)) {
        alert('Please enter a valid email address');
        return;
    }

    const event = events.find(e => e.id === currentEventId);
    if (!event) return;

    // Remove existing RSVP from same email
    event.rsvps = event.rsvps.filter(r => r.email !== email);

    // Add new RSVP
    event.rsvps.push({
        name,
        email,
        response: selectedResponse,
        submittedAt: new Date().toISOString()
    });

    localStorage.setItem('events', JSON.stringify(events));
    
    // Clear form
    document.getElementById('guest-name').value = '';
    document.getElementById('guest-email').value = '';
    selectedResponse = null;
    document.querySelectorAll('.rsvp-btn').forEach(btn => {
        btn.classList.remove('selected');
        btn.classList.remove('active');
    });

    // Update guest list
    renderGuestList(event);
    showEvent(currentEventId);
}

// Render guest list
function renderGuestList(event) {
    const guestList = document.getElementById('guest-list');
    const rsvpCounts = getRSVPCounts(event.rsvps);

    // Update counts
    document.getElementById('going-count').textContent = rsvpCounts.going;
    document.getElementById('maybe-count').textContent = rsvpCounts.maybe;
    document.getElementById('cant-go-count').textContent = rsvpCounts.cantGo;

    if (event.rsvps.length === 0) {
        guestList.innerHTML = `
            <div class="alert alert-light text-center py-4">
                <i class="bi bi-inbox display-6 text-muted d-block mb-2"></i>
                <p class="mb-0 text-muted">No RSVPs yet</p>
            </div>
        `;
        return;
    }

    guestList.innerHTML = event.rsvps.map(rsvp => {
        const responseLabels = {
            'going': 'Going',
            'maybe': 'Maybe',
            'cant-go': "Can't Go"
        };

        const responseIcons = {
            'going': 'bi-check-circle',
            'maybe': 'bi-question-circle',
            'cant-go': 'bi-x-circle'
        };

        return `
            <div class="d-flex justify-content-between align-items-center guest-item ${rsvp.response}">
                <div class="guest-info">
                    <div class="guest-name">${rsvp.name}</div>
                    <div class="guest-email">${rsvp.email}</div>
                </div>
                <span class="guest-response ${rsvp.response}">
                    <i class="bi ${responseIcons[rsvp.response]} me-1"></i>${responseLabels[rsvp.response]}
                </span>
            </div>
        `;
    }).join('');
}

// Helper functions
function getRSVPCounts(rsvps) {
    return {
        going: rsvps.filter(r => r.response === 'going').length,
        maybe: rsvps.filter(r => r.response === 'maybe').length,
        cantGo: rsvps.filter(r => r.response === 'cant-go').length
    };
}

function formatDate(dateString) {
    if (!dateString) return 'Date not set';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Share event
document.getElementById('share-event').addEventListener('click', () => {
    const event = events.find(e => e.id === currentEventId);
    if (!event) return;

    const url = `${window.location.origin}${window.location.pathname}?event=${currentEventId}`;
    
    if (navigator.share) {
        navigator.share({
            title: event.title,
            text: `You're invited to ${event.title}!`,
            url: url
        });
    } else {
        navigator.clipboard.writeText(url).then(() => {
            alert('Event link copied to clipboard!');
        });
    }
});

// Check for event ID in URL
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('event');
    
    if (eventId) {
        showEvent(eventId);
    } else {
        showPage('home');
        renderEventList();
    }
});

// Initialize
if (events.length > 0) {
    renderEventList();
}


