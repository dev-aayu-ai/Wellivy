//-------------------Calculate days since first visit--------------------------------//
function getDayDifference(startDate) {
  const today = new Date();
  const start = new Date(startDate);
  const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  return diff + 1;
}

//----------------------Show Welcome Popup---------------------------//
function showWelcomePopup() {
  let startDate = localStorage.getItem("firstVisitDate");
  if (!startDate) {
    startDate = new Date().toISOString();
    localStorage.setItem("firstVisitDate", startDate);
  }
  const dayCount = getDayDifference(startDate);
  const message = `It's Day ${dayCount} of your journey. Let’s stay fit together!`;
  document.getElementById("welcome-message").textContent = message;
  document.getElementById("welcome-popup").style.display = "flex";
}

function closePopup() {
  document.getElementById("welcome-popup").style.display = "none";
}

window.addEventListener("load", () => {
  showWelcomePopup();
  loadMeals();
});

//----------------------Mood Tracker----------------//
const moodButtons = document.querySelectorAll("section:nth-child(1) button");
moodButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    alert(`Mood selected: ${btn.textContent}`);
  });
});

//----------------Water Intake Tracker--------------------------//
const waterButtons = document.querySelectorAll("section:nth-child(2) button");
let waterCount = 0;
waterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.textContent === "+") {
      waterCount++;
      alert(`Added a cup! Total water intake: ${waterCount} cups`);
    } else {
      alert("Water emoji clicked!");
    }
  });
});

//------------------------------Meal Log----------------------------//
const mealInput = document.getElementById('mealInput');
const mealList = document.getElementById('mealList');
const mealLogButton = document.querySelector("section:nth-child(4) button");

mealLogButton.addEventListener("click", logMeal);

function loadMeals() {
  const savedDate = localStorage.getItem('mealDate');
  const today = new Date().toDateString();

  if (savedDate !== today) {
    // New day: clear old meals
    localStorage.setItem('meals', JSON.stringify([]));
    localStorage.setItem('mealDate', today);
  }

  const meals = JSON.parse(localStorage.getItem('meals') || '[]');
  mealList.innerHTML = ''; // Clear existing list
  meals.forEach(meal => {
    const li = document.createElement('li');
    li.textContent = meal;
    mealList.appendChild(li);
  });
}

function logMeal() {
  const meal = mealInput.value.trim();
  if (!meal) {
    alert("Please enter a meal description.");
    return;
  }

  let meals = JSON.parse(localStorage.getItem("meals") || "[]");
  meals.push(meal);
  localStorage.setItem("meals", JSON.stringify(meals));

  mealInput.value = '';
  loadMeals();
}

//----------------------------Sleep Tracker-------------------------//
const sleepData = {
  Monday: null,
  Tuesday: null,
  Wednesday: null,
  Thursday: null,
  Friday: null,
  Saturday: null,
  Sunday: null,
};
let currentDayIndex = 0;
const days = Object.keys(sleepData);

const sleepInput = document.querySelector("section:nth-child(5) input");
const sleepBtn = document.querySelector("section:nth-child(5) button:first-of-type");
const sleepMessage = document.createElement("p");
sleepInput.insertAdjacentElement("afterend", sleepMessage);

sleepBtn.addEventListener("click", () => {
  const hours = parseFloat(sleepInput.value);
  if (isNaN(hours) || hours < 0 || hours > 24) {
    sleepMessage.textContent = "Please enter a valid number (0-24)";
    return;
  }

  const day = days[currentDayIndex];
  sleepData[day] = hours;
  sleepMessage.textContent = `Sleep for ${day} recorded: ${hours} hrs`;
  currentDayIndex = (currentDayIndex + 1) % days.length;
  sleepInput.value = "";
});

//---------------------Sleep Details Modal Chart-----------------------//
const sleepDetailsBtn = document.querySelector("section:nth-child(5) button:nth-of-type(2)");
const modal = document.getElementById("sleepModal");
const closeModalBtn = document.getElementById("closeModal");
let sleepChart;

sleepDetailsBtn.addEventListener("click", () => {
  modal.style.display = "flex";
  const ctx = document.getElementById("sleepChart").getContext("2d");

  if (sleepChart) sleepChart.destroy();

  sleepChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: days,
      datasets: [{
        label: "Hours of Sleep",
        data: days.map((day) => sleepData[day] || 0),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      }],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 12,
        },
      },
    },
  });
});

closeModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

//-------------------------Mental Health Journal-----------------//
const journalText = document.querySelector(".journal-btn").previousElementSibling;
const journalSaveBtn = document.querySelector(".journal-btn");

journalSaveBtn.addEventListener("click", () => {
  const entry = journalText.value.trim();
  if (!entry) {
    alert("Write something before saving.");
    return;
  }

  localStorage.setItem("journalEntry", entry);
  alert("Journal entry saved!");
  journalText.value = "";
});

//----------------Weight Tracker------------//
const weightInput = document.querySelector("section:nth-child(9) input");
const weightBtn = document.querySelector("section:nth-child(9) button");

weightBtn.addEventListener("click", () => {
  const weight = parseFloat(weightInput.value);
  if (isNaN(weight) || weight <= 0) {
    alert("Please enter a valid weight in kg.");
    return;
  }

  alert(`Weight of ${weight} kg tracked.`);
  weightInput.value = "";
});

//----------------Page Navigation & Modal----------------//
function nextPage(page) {
  if (page === 'breath') {
    document.getElementById("success-screen").style.display = "flex";
  }
}

function closeSuccessModal() {
  document.getElementById("success-screen").style.display = "none";
}

document.getElementById("start-btn").addEventListener("click", () => {
  window.location.href = "tiral.html";
});
