# EventRSVP

A modern web application for creating events and managing RSVPs, inspired by Partiful.

## Features

- 🎉 **Create Events**: Build beautiful events with customizable details
- 📅 **Event Management**: Set date, time, location, and host information
- 👥 **RSVP System**: Guests can RSVP with "Going", "Maybe", or "Can't Go"
- 📊 **Guest Tracking**: View real-time RSVP statistics and guest lists
- 🎨 **Multiple Themes**: Choose from Base, Mono, Cosmic Night, Soft Pop, Neo Brutalism, Vintage Paper, Modern Minimal, Bubblegum, or Violet Bloom themes
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🔗 **Share Events**: Share event links with invited guests
- 💾 **Local Storage**: All data is saved locally in your browser

## Getting Started

1. Open `index.html` in a web browser
2. Click "Create New Event" to start
3. Fill in event details and add guest emails
4. Share the event link with your guests
5. Track RSVPs in real-time

## Usage

### Creating an Event

1. Click "Create New Event" from the home page
2. Enter event title (required)
3. Select date and time (required)
4. Add location, host name, and description (optional)
5. Add guest email addresses (comma-separated)
6. Choose a theme
7. Click "Create Event"

### RSVPing to an Event

1. Click on an event from the home page or use a shared link
2. Enter your name and email
3. Select your response (Going, Maybe, or Can't Go)
4. Click "Submit RSVP"

### Viewing Guest Lists

- View all RSVPs on the event page
- See real-time counts for each response type
- Guest list shows name, email, and response status

## Technical Details

- **Pure JavaScript**: No frameworks required
- **Local Storage**: Data persists in browser localStorage
- **Responsive CSS**: Modern, clean design with CSS Grid and Flexbox
- **No Backend**: All functionality works client-side

## Browser Support

Works in all modern browsers that support:
- LocalStorage API
- ES6 JavaScript
- CSS Grid and Flexbox

## Deployment

This is a static website and can be easily deployed to various free hosting platforms.

### Quick Deploy Options

1. **GitHub Pages** (Recommended)
   - Push code to GitHub repository
   - Go to Settings > Pages
   - Select branch and deploy

2. **Netlify** (Easiest)
   - Drag and drop the project folder to [Netlify](https://www.netlify.com)
   - Get instant live URL

3. **Vercel**
   - Connect GitHub repository to [Vercel](https://vercel.com)
   - Automatic deployments

📖 **Detailed deployment guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step instructions.


