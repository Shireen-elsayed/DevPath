const links = document.querySelectorAll(".links-sidebar nav ul li");
const clock = document.querySelector(".clock");
const sidebar = document.querySelector(".sidebar");
const menuToggle = document.querySelector(".mobile-menu-toggle");
// icon toggle
if (menuToggle && sidebar) {
  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });
}

links.forEach((link) => {
  link.addEventListener("click", function () {
    links.forEach((item) => item.classList.remove("active"));
    this.classList.add("active");

    if (window.innerWidth <= 992 && sidebar) {
      sidebar.classList.remove("open");
    }
  });
});


  

  


function renderStreakDays(streakWeek = []) {
  const container = document.getElementById("streakDaysContainer");
  if (!container) return;

  container.innerHTML = "";

  const today = new Date().toLocaleDateString("en-US", { weekday: "short" });

  streakWeek.forEach((dayData) => {
    const dayLetter = dayData.day[0];
    const isToday = dayData.day.startsWith(today.slice(0, 3));

    const dayEl = document.createElement("div");
    dayEl.className = "streak-day";
    if (dayData.done) dayEl.classList.add("completed");
    if (isToday) dayEl.classList.add("today");

    dayEl.innerHTML = `
      <span class="day-letter">${dayLetter}</span>
      <div class="day-circle">${dayData.done ? "✓" : ""}</div>
    `;

    container.appendChild(dayEl);
  });
}

let progressChart = null;

function initChart() {
  const ctx = document.getElementById("progressChart");
  if (!ctx || typeof Chart === "undefined") return null;

  progressChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      datasets: [
        {
          data: [0, 100],
          backgroundColor: ["#8b5cf6", "#2a2a3d"],
          borderWidth: 0,
        },
      ],
    },
    options: {
      cutout: "75%",
      rotation: -90,
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
    },
  });

  return progressChart;
}

async function loadDashboardData() {
  const response = await fetch("http://localhost:3000/users");
  if (!response.ok) {
    throw new Error("Unable to load dashboard data");
  }
  return response.json();
}

localStorage.setItem("currentUserId",1)

// get user id

async function initDashboard() {
  try {
    const data = await loadDashboardData();
    console.log(data);
    const currentUserId =localStorage.getItem("currentUserId") ;
    const currentUser = data.find((u) => u.id === currentUserId);
    // if(currentUser){
    //   // console.log("fetch"); found user
    // }
// handleData(currentUser.username,currentUser.level)
    if (!currentUser) {
      return;
    }
    const percent = Number(currentUser.overallScore);
    // console.log(percent);
    const chart = progressChart  || initChart() ;

    if (chart) {
      chart.data.datasets[0].data = [percent, Math.max(0, 100 - percent)];
      chart.update();
    }

    const percentText = document.querySelector(".percent-text");
    if (percentText) {
      percentText.textContent = `${percent}%`;
    }





let level=document.querySelector(".level")
let userName=document.querySelector(".username")
let track=document.querySelector(".track")
let completedModule=document.querySelector(".completedmodule")
let completedModule=document.querySelector(".completedmodule")

level.innerHTML=currentUser.level
userName.innerHTML=currentUser.username
track.innerHTML=currentUser.track;
completedModule.innerHTML=`${currentUser.completedSkillIds.length} / ${currentUser.skills.length}`


if (!clock) return;

  const hour = new Date().getHours();
  let greeting;

  if (hour < 12) {
    greeting = "Good morning";
  } else if (hour < 18) {
    greeting = "Good afternoon";
  } else {
    greeting = "Good evening";
  }
  clock.innerHTML=`${greeting}, ${userName.innerHTML}`





    renderStreakDays(currentUser.streakWeek || []);
  } catch (error) {
    console.error("Dashboard loading error:", error);
    const percentText = document.querySelector(".percent-text");
    if (percentText) {
      percentText.textContent = "0%";
    }
    renderStreakDays([]);
  }
  
}

// setGreeting();
initChart();
initDashboard();
let level=document.querySelector(".level")
let userName=document.querySelector(".username")
function handleData(name,levelUser){
console.log(name);
console.log(levelUser);
level.innerHTML=levelUser
userName.innerHTML=name
// clock
if (!clock) return;

  const hour = new Date().getHours();
  let greeting;

  if (hour < 12) {
    greeting = "Good morning";
  } else if (hour < 18) {
    greeting = "Good afternoon";
  } else {
    greeting = "Good evening";
  }
  clock.innerHTML=`${greeting}, ${name}`
}

