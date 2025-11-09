// scripts/exercise.js

// DOM Elements
const exerciseMinutes = document.getElementById('exercise-minutes');
const logExerciseBtn = document.getElementById('log-exercise-btn');

if (logExerciseBtn) {
    logExerciseBtn.addEventListener('click', () => {
        if (!currentUser) {
            alert("Please log in first.");
            return;
        }

        const minutes = parseInt(prompt("Enter minutes exercised today:"), 10);
        if (isNaN(minutes) || minutes <= 0) {
            alert("Please enter a valid number of minutes.");
            return;
        }

        const today = new Date().toISOString().slice(0, 10);
        const docRef = firebase.firestore().collection('exercise').doc(currentUser.uid);

        docRef.get()
            .then((doc) => {
                let totalMinutes = minutes;
                if (doc.exists && doc.data().date === today) {
                    totalMinutes += doc.data().minutes;
                }

                docRef.set({
                    minutes: totalMinutes,
                    date: today
                })
                .then(() => {
                    exerciseMinutes.textContent = totalMinutes;
                });
            })
            .catch((error) => {
                console.error("Error logging exercise:", error);
            });
    });
}

// Function to fetch today's exercise minutes
function fetchExercise() {
    if (!currentUser || !exerciseMinutes) return;

    const today = new Date().toISOString().slice(0, 10);
    const docRef = firebase.firestore().collection('exercise').doc(currentUser.uid);

    docRef.get()
        .then((doc) => {
            if (doc.exists && doc.data().date === today) {
                exerciseMinutes.textContent = doc.data().minutes;
            } else {
                exerciseMinutes.textContent = 0;
            }
        })
        .catch((error) => {
            console.error("Error fetching exercise:", error);
        });
}

// Call fetchExercise on dashboard load
fetchExercise();
