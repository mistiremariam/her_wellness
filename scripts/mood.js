// scripts/mood.js

// DOM Elements
const todayMood = document.getElementById('today-mood');
const logMoodBtn = document.getElementById('log-mood-btn');

if (logMoodBtn) {
    logMoodBtn.addEventListener('click', () => {
        if (!currentUser) {
            alert("Please log in first.");
            return;
        }

        const mood = prompt("How are you feeling today? (e.g., 😊, 😐, 😢)");
        if (!mood) return;

        const today = new Date().toISOString().slice(0,10);
        const docRef = firebase.firestore().collection('mood').doc(currentUser.uid);

        docRef.set({
            mood: mood,
            date: today
        })
        .then(() => {
            todayMood.textContent = mood;
        })
        .catch((error) => {
            console.error("Error saving mood:", error);
        });
    });
}

// Function to fetch today's mood on dashboard load
function fetchMood() {
    if (!currentUser || !todayMood) return;

    const today = new Date().toISOString().slice(0,10);
    const docRef = firebase.firestore().collection('mood').doc(currentUser.uid);

    docRef.get()
        .then((doc) => {
            if (doc.exists && doc.data().date === today) {
                todayMood.textContent = doc.data().mood;
            } else {
                todayMood.textContent = "😐"; // default neutral emoji
            }
        })
        .catch((error) => {
            console.error("Error fetching mood:", error);
        });
}

// Call fetchMood on dashboard load
fetchMood();
        const exercise = prompt("What exercise did you do today?");
        if (exercise) {
            firebase.firestore().collection('exercise').doc(currentUser.uid).set({
                exercise: exercise,
                date: new Date().toISOString().slice(0,10)
            });
        }