// State management
let events = getEvents();
let currentEventId = null;
let selectedResponse = null;
let currentEventFilter = 'my-events'; // 'my-events' or 'invited-events'

// DOM Elements
const loginPage = document.getElementById('login-page');
const signupPage = document.getElementById('signup-page');
const homePage = document.getElementById('home-page');
const createPage = document.getElementById('create-page');
const eventPage = document.getElementById('event-page');

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    checkAuthAndRedirect();
    setupEventListeners();
    updateNavigation();
});

// Check authentication and redirect
function checkAuthAndRedirect() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('event');
    
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        // Not logged in - show login page
        showPage('login');
    } else {
        // Logged in - show appropriate page
        if (eventId) {
            showEvent(eventId);
        } else {
            showPage('home');
            renderEventList();
        }
    }
}

// Setup all event listeners
function setupEventListeners() {
    // Navigation
    document.getElementById('nav-home').addEventListener('click', (e) => {
        e.preventDefault();
        if (isLoggedIn()) showPage('home');
    });
    document.getElementById('nav-create').addEventListener('click', (e) => {
        e.preventDefault();
        if (isLoggedIn()) showPage('create');
    });
    document.getElementById('nav-login').addEventListener('click', (e) => {
        e.preventDefault();
        showPage('login');
    });
    document.getElementById('nav-logout').addEventListener('click', (e) => {
        e.preventDefault();
        handleLogout();
    });
    document.getElementById('nav-home-brand').addEventListener('click', (e) => {
        e.preventDefault();
        if (isLoggedIn()) showPage('home');
    });
    
    // Login/Signup navigation
    document.getElementById('switch-to-signup').addEventListener('click', (e) => {
        e.preventDefault();
        showPage('signup');
    });
    document.getElementById('switch-to-login').addEventListener('click', (e) => {
        e.preventDefault();
        showPage('login');
    });
    
    // Login form
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    
    // Signup form
    document.getElementById('signup-form').addEventListener('submit', handleSignup);
    
    // Event creation
    document.getElementById('save-event').addEventListener('click', createEvent);
    document.getElementById('create-event-btn').addEventListener('click', () => {
        if (isLoggedIn()) showPage('create');
    });
    document.getElementById('cancel-create').addEventListener('click', () => {
        clearCreateForm();
        showPage('home');
    });
    document.getElementById('back-to-home').addEventListener('click', () => showPage('home'));
    
    // RSVP
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
    
    // Event filter tabs
    const myEventsTab = document.getElementById('my-events-tab');
    const invitedEventsTab = document.getElementById('invited-events-tab');
    
    if (myEventsTab) {
        myEventsTab.addEventListener('click', () => {
            currentEventFilter = 'my-events';
            renderEventList();
        });
    }
    
    if (invitedEventsTab) {
        invitedEventsTab.addEventListener('click', () => {
            currentEventFilter = 'invited-events';
            renderEventList();
        });
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
}

// Page navigation
function showPage(page) {
    // Hide all pages
    loginPage.classList.remove('active');
    signupPage.classList.remove('active');
    homePage.classList.remove('active');
    createPage.classList.remove('active');
    eventPage.classList.remove('active');

    // Show selected page
    if (page === 'login') {
        loginPage.classList.add('active');
    } else if (page === 'signup') {
        signupPage.classList.add('active');
    } else if (page === 'home') {
        homePage.classList.add('active');
        renderEventList();
    } else if (page === 'create') {
        createPage.classList.add('active');
    } else if (page === 'event') {
        eventPage.classList.add('active');
    }
}

// Update navigation based on login status
function updateNavigation() {
    const currentUser = getCurrentUser();
    const loginItem = document.getElementById('nav-login-item');
    const logoutItem = document.getElementById('nav-logout-item');
    const userItem = document.getElementById('nav-user-item');
    const userName = document.getElementById('nav-user-name');
    const createItem = document.getElementById('nav-create-item');
    const filterTabs = document.getElementById('event-filter-tabs');
    
    if (currentUser) {
        // Logged in
        if (loginItem) loginItem.classList.add('d-none');
        if (logoutItem) logoutItem.classList.remove('d-none');
        if (userItem) userItem.classList.remove('d-none');
        if (userName) userName.textContent = currentUser.name;
        if (filterTabs) filterTabs.classList.remove('d-none');
    } else {
        // Not logged in
        if (loginItem) loginItem.classList.remove('d-none');
        if (logoutItem) logoutItem.classList.add('d-none');
        if (userItem) userItem.classList.add('d-none');
        if (filterTabs) filterTabs.classList.add('d-none');
    }
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    
    const result = login(email, password);
    
    if (result.success) {
        updateNavigation();
        showPage('home');
        renderEventList();
    } else {
        alert(result.message || 'Login failed');
    }
}

// Handle signup
function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
    }
    
    const result = signUp(name, email, password);
    
    if (result.success) {
        updateNavigation();
        showPage('home');
        renderEventList();
    } else {
        alert(result.message || 'Signup failed');
    }
}

// Handle logout
function handleLogout() {
    logout();
    updateNavigation();
    showPage('login');
}

// Event creation
function createEvent() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        alert('Please login to create events');
        showPage('login');
        return;
    }
    
    const title = document.getElementById('event-title').value || 'Untitled Event';
    const date = document.getElementById('event-date').value;
    const location = document.getElementById('event-location').value;
    const host = document.getElementById('event-host').value;
    const description = document.getElementById('event-description').value;
    const guestEmails = document.getElementById('guest-emails').value;
    const theme = document.querySelector('.theme-btn.active')?.dataset.theme || 'base';

    if (!date) {
        alert('Please select a date and time for your event');
        return;
    }

    const event = {
        id: Date.now().toString(),
        title,
        date,
        location,
        host: host || currentUser.name,
        description,
        guestEmails: guestEmails.split(',').map(email => email.trim()).filter(Boolean),
        invitedUsers: guestEmails.split(',').map(email => email.trim().toLowerCase()).filter(Boolean),
        theme,
        ownerId: currentUser.id,
        ownerEmail: currentUser.email,
        rsvps: [],
        createdAt: new Date().toISOString()
    };

    events = getEvents();
    events.push(event);
    saveEvents(events);
    
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
    const baseBtn = document.querySelector('.theme-btn[data-theme="base"]');
    if (baseBtn) {
        baseBtn.classList.add('active');
        baseBtn.classList.remove('btn-outline-primary');
        baseBtn.classList.add('btn-primary');
    }
}

// Render event list
function renderEventList() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const eventList = document.getElementById('event-list');
    events = getEvents();
    
    let filteredEvents = [];
    
    if (currentEventFilter === 'my-events') {
        filteredEvents = getMyEvents(currentUser.id);
    } else {
        filteredEvents = getInvitedEvents(currentUser.email);
    }
    
    if (filteredEvents.length === 0) {
        const emptyMessage = currentEventFilter === 'my-events' 
            ? 'No events created yet. Create your first event!'
            : 'No invited events yet.';
        eventList.innerHTML = `
            <div class="col-12">
                <div class="alert alert-light text-center py-5">
                    <i class="bi bi-calendar-x display-4 text-muted mb-3 d-block"></i>
                    <p class="mb-0 text-muted">${emptyMessage}</p>
                </div>
            </div>
        `;
        return;
    }

    eventList.innerHTML = filteredEvents.map(event => {
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
    events = getEvents();
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

// Submit RSVP
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

    events = getEvents();
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

    saveEvents(events);
    
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
