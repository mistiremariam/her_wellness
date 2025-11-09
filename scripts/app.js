// scripts/app.js

// ====== Firebase Authentication Setup ======
// Make sure firebase.js is loaded before this script

// DOM Elements
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const usernameSpan = document.getElementById('username');

// Tracker Elements
const hydrationCount = document.getElementById('hydration-count');
const addGlassBtn = document.getElementById('add-glass-btn');

const todayMood = document.getElementById('today-mood');
const logMoodBtn = document.getElementById('log-mood-btn');

const exerciseMinutes = document.getElementById('exercise-minutes');
const logExerciseBtn = document.getElementById('log-exercise-btn');

const mealsCount = document.getElementById('meals-count');
const logMealBtn = document.getElementById('log-meal-btn');

const nextPeriod = document.getElementById('next-period');
const updateCycleBtn = document.getElementById('update-cycle-btn');

let currentUser = null;

// ====== Authentication Logic ======
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                currentUser = userCredential.user;
                alert('Login successful!');
                // Redirect to dashboard
                window.location.href = 'index.html';
            })
            .catch((error) => {
                alert(error.message);
            });
    });
}

if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                currentUser = userCredential.user;
                // Save user name in Firebase Database
                firebase.firestore().collection('users').doc(currentUser.uid).set({
                    name: name,
                    email: email,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                alert('Signup successful!');
                window.location.href = 'index.html';
            })
            .catch((error) => {
                alert(error.message);
            });
    });
}

// ====== Dashboard Initialization ======
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
        if (usernameSpan) {
            // Fetch user name from Firestore
            firebase.firestore().collection('users').doc(user.uid).get()
                .then((doc) => {
                    if (doc.exists) {
                        usernameSpan.textContent = doc.data().name;
                    }
                });
        }

        // Fetch tracker data (example for hydration)
        if (hydrationCount) {
            const today = new Date().toISOString().slice(0,10);
            firebase.firestore().collection('hydration')
                .doc(user.uid)
                .get()
                .then((doc) => {
                    if (doc.exists) {
                        hydrationCount.textContent = doc.data().glasses || 0;
                    } else {
                        hydrationCount.textContent = 0;
                    }
                });
        }
    } else {
        // No user logged in
        if (window.location.pathname.includes('index.html')) {
            window.location.href = 'login.html';
        }
    }
});

// ====== Button Event Listeners ======

// Hydration
if (addGlassBtn) {
    addGlassBtn.addEventListener('click', () => {
        const today = new Date().toISOString().slice(0,10);
        const docRef = firebase.firestore().collection('hydration').doc(currentUser.uid);

        docRef.get().then((doc) => {
            let newCount = 1;
            if (doc.exists) {
                newCount = doc.data().glasses + 1;
            }
            docRef.set({
                glasses: newCount,
                date: today
            });
            hydrationCount.textContent = newCount;
        });
    });
}

// Mood Logging (starter)
if (logMoodBtn) {
    logMoodBtn.addEventListener('click', () => {
        const mood = prompt("How are you feeling today? (e.g., 😊, 😐, 😢)");
        if (mood) {
            firebase.firestore().collection('mood').doc(currentUser.uid).set({
                mood: mood,
                date: new Date().toISOString().slice(0,10)
            });
            todayMood.textContent = mood;
        }
    });
}

// Exercise Logging (starter)
if (logExerciseBtn) {
    logExerciseBtn.addEventListener('click', () => {
        const minutes = parseInt(prompt("Enter minutes exercised today:"), 10);
        if (!isNaN(minutes)) {
            firebase.firestore().collection('exercise').doc(currentUser.uid).set({
                minutes: minutes,
                date: new Date().toISOString().slice(0,10)
            });
            exerciseMinutes.textContent = minutes;
        }
    });
}

// Nutrition Logging (starter)
if (logMealBtn) {
    logMealBtn.addEventListener('click', () => {
        const meal = prompt("Enter meal details (Breakfast/Lunch/Dinner/Snack):");
        if (meal) {
            firebase.firestore().collection('nutrition').doc(currentUser.uid).set({
                meal: meal,
                date: new Date().toISOString().slice(0,10)
            });
            mealsCount.textContent = parseInt(mealsCount.textContent) + 1;
        }
    });
}

// Menstrual Cycle Update (starter)
if (updateCycleBtn) {
    updateCycleBtn.addEventListener('click', () => {
        const startDate = prompt("Enter your last period start date (YYYY-MM-DD):");
        if (startDate) {
            firebase.firestore().collection('menstrual').doc(currentUser.uid).set({
                startDate: startDate,
                cycleLength: 28 // default cycle length, can add input later
            });
            nextPeriod.textContent = calculateNextPeriod(startDate);
        }
    });
}

// Function to calculate next period (simple +28 days)
function calculateNextPeriod(startDate) {
    const start = new Date(startDate);
    start.setDate(start.getDate() + 28);
    return start.toISOString().slice(0,10);
}
