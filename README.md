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

Home page

<img width="904" height="534" alt="image" src="https://github.com/user-attachments/assets/7796995b-993e-4036-aa1f-43261b040439" />
Short URL craetion

<img width="1357" height="653" alt="image" src="https://github.com/user-attachments/assets/b4bae421-9bff-439d-9b92-fee8bfdec2fc" />

Statistics page 
<img width="1356" height="685" alt="image" src="https://github.com/user-attachments/assets/792e8edf-98ca-4053-858f-f6d13c9dca41" />


