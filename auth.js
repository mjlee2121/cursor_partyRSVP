// Authentication and User Management

// User data structure in localStorage: 'users' = [{id, name, email, password, createdAt}]
// Current user in localStorage: 'currentUser' = {id, name, email}
// Events in localStorage: 'events' = [{id, title, date, ..., ownerId, invitedUsers: [email], rsvps: []}]

// Get all users
function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

// Save users
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Get current user
function getCurrentUser() {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
}

// Set current user
function setCurrentUser(user) {
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify({ id: user.id, name: user.name, email: user.email }));
    } else {
        localStorage.removeItem('currentUser');
    }
}

// Sign up
function signUp(name, email, password) {
    const users = getUsers();
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
        return { success: false, message: 'Email already exists' };
    }
    
    // Create new user
    const newUser = {
        id: Date.now().toString(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password, // In production, hash the password!
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers(users);
    
    // Auto login
    setCurrentUser(newUser);
    
    return { success: true, user: newUser };
}

// Login
function login(email, password) {
    const users = getUsers();
    const user = users.find(u => u.email === email.toLowerCase() && u.password === password);
    
    if (!user) {
        return { success: false, message: 'Invalid email or password' };
    }
    
    setCurrentUser(user);
    return { success: true, user };
}

// Logout
function logout() {
    setCurrentUser(null);
}

// Check if user is logged in
function isLoggedIn() {
    return getCurrentUser() !== null;
}

// Get events
function getEvents() {
    return JSON.parse(localStorage.getItem('events')) || [];
}

// Save events
function saveEvents(events) {
    localStorage.setItem('events', JSON.stringify(events));
}

// Get user's events (created by user)
function getMyEvents(userId) {
    const events = getEvents();
    return events.filter(e => e.ownerId === userId);
}

// Get invited events (user is in invitedUsers)
function getInvitedEvents(userEmail) {
    const events = getEvents();
    return events.filter(e => e.invitedUsers && e.invitedUsers.includes(userEmail.toLowerCase()));
}

