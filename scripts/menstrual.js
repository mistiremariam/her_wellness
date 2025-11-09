// scripts/menstrual.js

// DOM Elements
const nextPeriod = document.getElementById('next-period');
const updateCycleBtn = document.getElementById('update-cycle-btn');

if (updateCycleBtn) {
    updateCycleBtn.addEventListener('click', () => {
        if (!currentUser) {
            alert("Please log in first.");
            return;
        }

        const startDate = prompt("Enter your last period start date (YYYY-MM-DD):");
        if (!startDate || isNaN(new Date(startDate))) {
            alert("Please enter a valid date in YYYY-MM-DD format.");
            return;
        }

        let cycleLength = parseInt(prompt("Enter your cycle length in days (default 28):"), 10);
        if (isNaN(cycleLength) || cycleLength <= 0) {
            cycleLength = 28;
        }

        firebase.firestore().collection('menstrual').doc(currentUser.uid).set({
            startDate: startDate,
            cycleLength: cycleLength
        })
        .then(() => {
            nextPeriod.textContent = calculateNextPeriod(startDate, cycleLength);
        })
        .catch((error) => {
            console.error("Error updating menstrual cycle:", error);
        });
    });
}

// Function to fetch menstrual data and calculate next period
function fetchMenstrual() {
    if (!currentUser || !nextPeriod) return;

    const docRef = firebase.firestore().collection('menstrual').doc(currentUser.uid);

    docRef.get()
        .then((doc) => {
            if (doc.exists) {
                const { startDate, cycleLength } = doc.data();
                nextPeriod.textContent = calculateNextPeriod(startDate, cycleLength);
            } else {
                nextPeriod.textContent = "--/--/----";
            }
        })
        .catch((error) => {
            console.error("Error fetching menstrual data:", error);
        });
}

// Function to calculate next period date
function calculateNextPeriod(startDate, cycleLength = 28) {
    const start = new Date(startDate);
    start.setDate(start.getDate() + cycleLength);
    return start.toISOString().slice(0,10);
}

// Call fetchMenstrual on dashboard load
fetchMenstrual();
