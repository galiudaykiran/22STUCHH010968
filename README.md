🔗 URL Shortener Web App (Frontend Only)
A responsive React-based URL Shortener web application built using Material UI. This project demonstrates how users can shorten long URLs, use optional custom aliases, and view simulated click statistics — all handled entirely on the frontend without requiring a backend server.


🚀 Features
🔗 Shortens long URLs (simulated)

✏️ Custom short alias support

⏳ Set expiry time (simulated countdown)

📊 Simulated analytics:

Click timestamps

Referrer/source

Location (mocked or using browser API)

📋 Statistics page listing all shortened URLs and analytics

🎨 Clean, responsive UI built entirely with Material UI

🧑‍💻 Runs locally on localhost:3000 without any backend

🛠️ Tech Stack
React (with Hooks)

Material UI (MUI v5)

React Router (for page navigation)

LocalStorage (to simulate backend storage and tracking)

Optional: Browser Geolocation API (to mock user location)

🛠️ Tech Stack
React (with Hooks)

Material UI (MUI v5)

React Router (for page navigation)

LocalStorage (to simulate backend storage and tracking)

Optional: Browser Geolocation API (to mock user location)

 How It Works 
URLs are stored in the browser’s localStorage.

On form submission, a random or user-defined alias is created.

Expiry time is tracked using timestamps.

Each simulated "click" on a short URL logs:

A timestamp

Referrer (from document.referrer)

Randomized location or browser-derived geolocation

Data is displayed on the Stats page using React components.

⚙️ Setup Instructions
Clone this repository:
git clone https://github.com/galiudaykiran/22STUCHH010968.git

Install dependencies:
cd 22STUCHH010968
npm install

Start the app:
npm start

Visit:
http://localhost:3000


📸 Screenshots

Login page

<img width="931" height="603" alt="image" src="https://github.com/user-attachments/assets/ee76838b-ae74-42ba-939c-a02cd3e8bf71" />

URL shortener 
<img width="1286" height="615" alt="Screenshot 2025-07-24 164538" src="https://github.com/user-attachments/assets/febd1828-e546-4e71-b5f8-8689b637f2f1" />


Dashboard
<img width="1149" height="673" alt="Screenshot 2025-07-24 164612" src="https://github.com/user-attachments/assets/07e462fa-6392-4f40-8f3d-4f6b1f5e47f9" />


URL statistics(URLs)
<img width="1264" height="681" alt="Screenshot 2025-07-24 164647" src="https://github.com/user-attachments/assets/45459f09-e43c-4041-a94d-1ca408a902a5" />


URL statistics(Analytics)
<img width="1246" height="590" alt="Screenshot 2025-07-24 164708" src="https://github.com/user-attachments/assets/7f3df6fd-78ed-4f77-8ae5-1e5d17d6d9ee" />


