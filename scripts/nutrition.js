// scripts/nutrition.js

// DOM Elements
const mealsCount = document.getElementById('meals-count');
const logMealBtn = document.getElementById('log-meal-btn');

if (logMealBtn) {
    logMealBtn.addEventListener('click', () => {
        if (!currentUser) {
            alert("Please log in first.");
            return;
        }

        const meal = prompt("Enter meal details (Breakfast, Lunch, Dinner, Snack):");
        if (!meal) return;

        const today = new Date().toISOString().slice(0, 10);
        const docRef = firebase.firestore().collection('nutrition').doc(currentUser.uid);

        docRef.get()
            .then((doc) => {
                let mealLog = [];
                if (doc.exists && doc.data().date === today) {
                    mealLog = doc.data().meals || [];
                }
                mealLog.push(meal);

                docRef.set({
                    meals: mealLog,
                    date: today
                })
                .then(() => {
                    mealsCount.textContent = mealLog.length;
                });
            })
            .catch((error) => {
                console.error("Error logging meal:", error);
            });
    });
}

// Function to fetch today's meals count
function fetchMeals() {
    if (!currentUser || !mealsCount) return;

    const today = new Date().toISOString().slice(0, 10);
    const docRef = firebase.firestore().collection('nutrition').doc(currentUser.uid);

    docRef.get()
        .then((doc) => {
            if (doc.exists && doc.data().date === today) {
                mealsCount.textContent = doc.data().meals.length;
            } else {
                mealsCount.textContent = 0;
            }
        })
        .catch((error) => {
            console.error("Error fetching meals:", error);
        });
}

// Call fetchMeals on dashboard load
fetchMeals();
