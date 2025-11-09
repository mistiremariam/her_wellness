// scripts/hydration.js

// DOM Elements
const hydrationCount = document.getElementById('hydration-count');
const addGlassBtn = document.getElementById('add-glass-btn');

if (addGlassBtn) {
    addGlassBtn.addEventListener('click', () => {
        if (!currentUser) {
            alert("Please log in first.");
            return;
        }

        const today = new Date().toISOString().slice(0, 10);
        const docRef = firebase.firestore().collection('hydration').doc(currentUser.uid);

        docRef.get().then((doc) => {
            let newCount = 1;
            if (doc.exists && doc.data().date === today) {
                newCount = doc.data().glasses + 1;
            }
            docRef.set({
                glasses: newCount,
                date: today
            });
            hydrationCount.textContent = newCount;
        }).catch((error) => {
            console.error("Error updating hydration:", error);
        });
    });
}

// Function to fetch today's hydration count (called on dashboard load)
function fetchHydration() {
    if (!currentUser || !hydrationCount) return;

    const today = new Date().toISOString().slice(0, 10);
    firebase.firestore().collection('hydration').doc(currentUser.uid).get()
        .then((doc) => {
            if (doc.exists && doc.data().date === today) {
                hydrationCount.textContent = doc.data().glasses;
            } else {
                hydrationCount.textContent = 0;
            }
        })
        .catch((error) => {
            console.error("Error fetching hydration:", error);
        });
}

// Call fetchHydration when dashboard loads
fetchHydration();
