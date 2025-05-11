# Movie Explorer – Discover Your Favorite Films

# User Name- admin | Password- 1234

Movie Explorer is a web application that allows users to explore trending movies, search for titles, view detailed information, and manage a list of their favorite films. It uses **The Movie Database (TMDb)** API to fetch real-time data and provides a responsive, user-friendly interface built with **React** and **Material-UI**.

## Live Demo

🔗 [Click here to view the live app](movie-explorer-93rg8vp9p-minindu-gimshans-projects.vercel.app)

## Project Setup

### 1. Clone the Repository

```bash
git clone git@github.com:minindugimshan/movie-explorer.git
cd movie-explorer
```
### 2. Install Dependencies
```bash
npm install
```
### 3. Create tmbd.js File
You can obtain an API key by signing up at https://www.themoviedb.org and visiting https://www.themoviedb.org/settings/api.

4. Run the App Locally
```bash
npm start
```
Open [http://localhost:3000](http://localhost:3000) to view it in browser.

## Features Implemented

### Authentication

Simple login form with username and password input (non-persistent for demo).

### Search & Discovery

Search bar to look up movies by name.
Infinite scroll or “Load More” for movie results.
Trending movies section powered by TMDb’s /trending endpoint.
Allow users to filter movies by genre, year, or rating.

### Movie Display
Grid of movie cards showing:
Poster image
Title
Release year
Rating
Detailed view for each movie:
Overview, genres, cast
Trailer
Official Website
Light/Dark Mode
Toggle switch to change the theme dynamically.

### Favorites & Persistence

Users can save favorite movies locally.
Last searched movie stored in localStorage.

### State Management

Uses React Context API for global movie data.

### API Usage
All data is powered by TMDb API:

Endpoints Used:
GET /trending/movie/week
GET /search/movie?query={query}
GET /movie/{movie_id} (for details, genres, videos, etc.)
GET /movie/{movie_id}/credits (for cast info)

### Technologies Used

React (JavaScript)
React Router
Axios
Material-UI (MUI)
TMDb API

### Responsive Design
Built using mobile-first principles. Looks great on phones, tablets, and desktops.

### Deployment

The app is deployed using Vercel.
Push code to GitLab.
Link repository to Vercel.
Deploy!

### Acknowledgements

TMDb for providing the API and movie data.
Material UI for UI components.
React community for the ecosystem.

