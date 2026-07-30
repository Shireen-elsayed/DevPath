const links = document.querySelectorAll(".links-sidebar nav ul li");
const clock = document.querySelector(".clock");
const sidebar = document.querySelector(".sidebar");
const menuToggle = document.querySelector(".mobile-menu-toggle");
// =========================================
// SIDEBAR TOGGLE
// Open and close the sidebar on mobile devices
// =========================================
if (menuToggle && sidebar) {
  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });
}
// =========================================
// SIDEBAR ACTIVE LINKS
// Highlight the selected navigation link
// =========================================
links.forEach((link) => {
  link.addEventListener("click", function () {
    links.forEach((item) => item.classList.remove("active"));
    this.classList.add("active");
    if (window.innerWidth <= 992 && sidebar) {
      sidebar.classList.remove("open");
    }
  });
});
// =========================================
// WEEK DATE HELPER
// Generate the current week's dates
// =========================================
function getCurrentWeekDates(startDay = 1) {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();
  const todayIndex = today.getDay();
  let diff = todayIndex - startDay;
  if (diff < 0) diff += 7;
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - diff);
  const week = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    week.push({
      day: dayNames[d.getDay()],
      date: d.getDate(),
      isToday: d.toDateString() === today.toDateString(),
      fullDate: d.toISOString().split("T")[0],
    });
  }
  return week;
}
// =========================================
// STREAK DAYS
// Display the user's learning streak
// =========================================
function renderStreakDays(streakWeek = []) {
  const container = document.getElementById("streakDaysContainer");
  if (!container) return;
  container.innerHTML = "";
  const realWeek = getCurrentWeekDates();
  realWeek.forEach((weekDay) => {
    const matched = streakWeek.find((d) => d.day === weekDay.day);
    const isDone = matched ? !!matched.done : false;
    const dayEl = document.createElement("div");
    dayEl.className = "streak-day";
    if (isDone) dayEl.classList.add("completed");
    if (weekDay.isToday) dayEl.classList.add("today");
    dayEl.innerHTML = `
      <span class="day-letter">${weekDay.day}</span>
      <span class="day-date">${weekDay.date}</span>
      <div class="day-circle">${isDone ? "✓" : (weekDay.isToday ? "●" : "")}</div>
    `;
    container.appendChild(dayEl);
  });
}
// =========================================
// WEEK CALENDAR
// Render the weekly learning calendar
// =========================================
function renderWeekCalendar(streakWeek = []) {
  const container = document.querySelector(".week-calendar");
  if (!container) return;
  container.innerHTML = "";
  const realWeek = getCurrentWeekDates();
  realWeek.forEach((weekDay) => {
    const matched = streakWeek.find((d) => d.day === weekDay.day);
    const isDone = matched ? !!matched.done : false;
    const dayEl = document.createElement("div");
    dayEl.className = "week-day";
    if (isDone) {
  dayEl.classList.add("completed");
} else if (weekDay.isToday) {
  dayEl.classList.add("today");
}
    let iconClass = "fa-regular fa-circle";
    if (isDone) iconClass = "fa-solid fa-check";
    else if (weekDay.isToday) iconClass = "fa-solid fa-circle-dot";
    dayEl.innerHTML = `
      <span class="day-name">${weekDay.day}</span>
      <span class="day-date">${weekDay.date}</span>
      <i class="${iconClass}"></i>
    `;
    container.appendChild(dayEl);
  });
}
// =========================================
// RECOMMENDED COURSES
// Display recommended courses based on the user's track
// =========================================
function renderRecommended(recommended = [], userTrack, currentSkill) {
  const container = document.querySelector(".rec-cards-container");
  if (!container) return;
  container.innerHTML = "";

  const filtered = recommended.filter(
  (r) =>
    r.track === userTrack &&
    r.skill === currentSkill
);

  if (filtered.length === 0) {
    container.innerHTML = `<p>لا توجد اقتراحات متاحة لهذا التراك حالياً</p>`;
    return;
  }

  const iconMap = {
    css:     { class: "css-icon",  fa: "fa-brands fa-css3-alt" },
    html:    { class: "html-icon", fa: "fa-brands fa-html5" },
    js:      { class: "js-icon",   fa: "fa-brands fa-js" },
    code:    { class: "js-icon",   fa: "fa-solid fa-code" },
    node:    { class: "node-icon", fa: "fa-brands fa-node-js" },
    sql:     { class: "sql-icon",  fa: "fa-solid fa-database" },
    figma:   { class: "figma-icon", fa: "fa-brands fa-figma" },
    flutter: { class: "flutter-icon", fa: "fa-solid fa-mobile-screen" },
    python:  { class: "python-icon", fa: "fa-brands fa-python" },
  };

  filtered.forEach((item) => {
    const icon = iconMap[item.icon] || iconMap.code;
    const card = document.createElement("div");
    card.className = "rec-card";
    card.innerHTML = `
      <div class="rec-card-icon ${icon.class}">
        <i class="${icon.fa}"></i>
      </div>
      <h5>${item.title}</h5>
      <p class="rec-meta">${item.type} • ${item.meta}</p>
      <div class="rec-tag">${item.title.split(" ")[0]}</div>
    `;
    container.appendChild(card);
  });
}
// =========================================
// UPCOMING PROJECTS
// Display projects related to the user's learning track
// =========================================
function renderUpcomingProjects(projects = [], userTrack, currentSkill) {
  const container = document.querySelector(".projects-showcase");
  if (!container) return;
  container.innerHTML = "";
 
  const filtered = projects.filter(
  (p) =>
    p.track === userTrack &&
    p.skill === currentSkill
);
// console.log("Filtered:", filtered);
  if (filtered.length === 0) {
    container.innerHTML = `<p>لا توجد مشاريع متاحة لهذا التراك حالياً</p>`;
    return;
  }
  const iconMap = {
    weather: { class: "weather", fa: "fa-solid fa-cloud-sun" },
    portfolio: { class: "portfolio", fa: "fa-solid fa-briefcase" },
    ecommerce: { class: "ecommerce", fa: "fa-solid fa-shopping-bag" },
    api: { class: "api", fa: "fa-solid fa-server" },
    todo: { class: "todo", fa: "fa-solid fa-list-check" },
    expense: { class: "expense", fa: "fa-solid fa-wallet" },
    wireframe: { class: "wireframe", fa: "fa-solid fa-pen-ruler" },
    prototype: { class: "prototype", fa: "fa-solid fa-object-group" },
    dashboard: { class: "dashboard", fa: "fa-solid fa-chart-line" },
    report: { class: "report", fa: "fa-solid fa-file-lines" },
  };
  const levelIconMap = {
    Beginner: "fa-solid fa-leaf",
    Intermediate: "fa-solid fa-circle-half-stroke",
    Advanced: "fa-solid fa-star",
  };
  filtered.forEach((project) => {
    const icon = iconMap[project.icon] || iconMap.portfolio;
    const levelIcon = levelIconMap[project.level] || "fa-solid fa-leaf";
    const card = document.createElement("div");
    card.className = "project-showcase-card";
    card.innerHTML = `
      <div class="project-badge ${icon.class}">
        <i class="${icon.fa}"></i>
      </div>
      <h5>${project.title}</h5>
      <p class="project-stack">${project.tags.join(" • ")}</p>
      <span class="difficulty-badge ${project.level.toLowerCase()}">
        <i class="${levelIcon}"></i>
        ${project.level}
      </span>
    `;
    container.appendChild(card);
  });
}
// =========================================
// CURRENT LEARNING MODULE
// Get the current module or calculate the next available one
// =========================================
function getEffectiveModule(currentUser, roadmaps) {
  const roadmap = roadmaps.find((r) => r.id === currentUser.track); // r.track -> r.id
  const roadmapSkillNames = roadmap ? roadmap.skills.map((s) => s.title) : []; // s.name -> s.title

  const existingModule = currentUser.currentModule;
  const isModuleValid =
    existingModule && roadmapSkillNames.includes(existingModule.skillName);

  if (isModuleValid) {
    return existingModule;
  }

  const completed = currentUser.completedSkillIds || [];
  const nextSkill = roadmap?.skills.find((s) => !completed.includes(s.title)); // s.name -> s.title

  if (!nextSkill) {
    return null;
  }

  return {
    skillId: nextSkill.title, // مفيش id للسكيل في الشكل الجديد، فهنستخدم العنوان كمعرّف
    skillName: nextSkill.title, // s.name -> s.title
    progressPercent:
currentUser.currentModule?.progressPercent ?? 0,
    nextLesson:
currentUser.currentModule?.nextLesson ??
{
title:"",
durationMinutes:30
},
    upNext:
currentUser.currentModule?.upNext ??
{
title:"",
durationMinutes:30
},
  };
}
// =========================================
// PROGRESS CHART
// Initialize the doughnut progress chart
// =========================================
let progressChart = null;

function initChart() {
  const ctx = document.getElementById("progressChart");
  if (!ctx || typeof Chart === "undefined") return null;
  progressChart = new Chart(ctx, {
    type: "doughnut",
    data: { datasets: [{ data: [0, 100], backgroundColor: ["#8b5cf6", "#2a2a3d"], borderWidth: 0 }] },
    options: { cutout: "75%", rotation: -90, plugins: { legend: { display: false }, tooltip: { enabled: false } } },
  });
  return progressChart;
}
// =========================================
// FETCH JSON DATA
// Generic helper to load JSON from the server
// =========================================
async function fetchJSON(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Unable to load: ${url}`);
  return response.json();
}
// =========================================
// LOCAL STORAGE
// Store the current user id if it doesn't exist
// =========================================
if (!localStorage.getItem("currentUserId")) {
  localStorage.setItem("currentUserId", "1");
}
console.log(localStorage.getItem("currentUserId"));


// =========================================
// DASHBOARD INITIALIZATION
// Load all dashboard data and update the UI
// =========================================
async function initDashboard() {
  try {
    // Fetch all required data from JSON Server
    const [users, recommended, upcomingProjects, roadmaps] = await Promise.all([
      fetchJSON("http://localhost:3000/users"),
      fetchJSON("http://localhost:3000/recommended"),
      fetchJSON("http://localhost:3000/upcomingProjects"),
      fetchJSON("http://localhost:3000/roadmaps"),
    ]);
// =========================================
// LOCAL STORAGE
// Store the current user id if it doesn't exist
// =========================================
// Get the current logged-in user from Local Storage
    const currentUserId = String(localStorage.getItem("currentUserId"));
    const currentUser = users.find((u) => String(u.id) === currentUserId);
    console.log(currentUser);
console.log(currentUser.weeklyGoalDone);
console.log(currentUser.weeklyGoalTotal);
// Stop execution if the user doesn't exist
    if (!currentUser) {
      console.warn("لم يتم العثور على المستخدم");
      renderStreakDays([]);
      renderWeekCalendar([]);
      return;
    }
// Update the progress chart
    const percent = Number(currentUser.overallScore) || 0;
    const chart = progressChart || initChart();
    if (chart) {
      chart.data.datasets[0].data = [percent, Math.max(0, 100 - percent)];
      chart.update();
    }
// Display the progress percentage
    const percentText = document.querySelector(".percent-text");
    if (percentText) percentText.textContent = `${percent}%`;
// Select dashboard elements
    let level = document.querySelector(".level");
    let userName = document.querySelector(".username");
    let track = document.querySelector(".track");
    let completedModule = document.querySelector(".completedmodule");
    let valuexp = document.querySelector(".valuexp");
    let numberstreak = document.querySelector(".numberstreak");
    let numberweakgoals = document.querySelector(".numberweakgoals");
    let namecourse = document.querySelector(".namecourse");
    let course_track = document.querySelector(".course-track");
    let progress_percent = document.querySelector(".progress-percent");
    let progress_fill = document.querySelector(".progress-fill");
    let lesson_name = document.querySelector(".lesson-name");
    let secondlesson = document.querySelector(".secondlesson");
    let lesson_duration = document.querySelector(".lesson-duration");
    let second_duration = document.querySelector(".second-duration");
// Helper function to safely update text content
    const setText = (el, value) => { if (el) el.innerHTML = value; };
// Helper function to safely update text content
    setText(level, currentUser.level);
    setText(userName, currentUser.username);
    setText(track, currentUser.track);
    setText(completedModule, `${currentUser.completedSkillIds?.length ?? 0} / ${currentUser.skills?.length ?? 0}`);
    setText(valuexp, currentUser.xpEarned ?? 0);
setText(numberstreak, `${currentUser.streakDays ?? 0} Days`);
   setText(numberweakgoals, `${currentUser.weeklyGoalDone ?? 0} / ${currentUser.weeklyGoalTotal ?? 0}`);
// Determine which module the user should continue
    const effectiveModule = getEffectiveModule(currentUser, roadmaps);
const currentSkill = effectiveModule?.skillName || "";
// Determine which module the user should continue
    if (effectiveModule) {
      setText(namecourse, `${effectiveModule.skillName} Basics`);
      setText(course_track, `${currentUser.track} track`);
      setText(progress_percent, `${effectiveModule.progressPercent} %`);

      if (progress_fill) {
        progress_fill.style.width = `${effectiveModule.progressPercent}%`;
      }

      if (effectiveModule.nextLesson) {
        setText(lesson_name, effectiveModule.nextLesson.title);
        setText(lesson_duration, `${effectiveModule.nextLesson.durationMinutes} min`);
      }
      if (effectiveModule.upNext) {
        setText(secondlesson, effectiveModule.upNext.title);
        setText(second_duration, `${effectiveModule.upNext.durationMinutes} min`);
      }
    } else {
      setText(namecourse, "All skills completed 🎉");
      setText(course_track, `${currentUser.track} track`);
    }

    if (clock) {
      const hour = new Date().getHours();
      let greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
      clock.innerHTML = `${greeting}, ${currentUser.username}`;
    }

    renderStreakDays(currentUser.streakWeek || []);
    renderWeekCalendar(currentUser.streakWeek || []);
    renderRecommended(
  recommended,
  currentUser.track,
  currentSkill
);

renderUpcomingProjects(
  upcomingProjects,
  currentUser.track,
  currentSkill
);







    const continueBtn = document.querySelector(".continue-btn");

if (continueBtn) {
  continueBtn.addEventListener("click", () => {
    localStorage.setItem("selectedSkillId", effectiveModule.skillId);
    window.location.href = "../pages/roadmap.html";
  });
}
const nextLessonCard = document.getElementsByClassName("lesson-item")[0];

if (nextLessonCard) {
  nextLessonCard.addEventListener("click", () => {
    localStorage.setItem("selectedSkillId", effectiveModule.skillId);
    localStorage.setItem("selectedLessonTitle", effectiveModule.nextLesson.title);
    window.location.href = "../pages/roadmap.html";
  });
}
const nextLessonCardTwo = document.getElementsByClassName("lesson-item")[1];
if (nextLessonCardTwo) {
  nextLessonCardTwo.addEventListener("click", () => {
    localStorage.setItem("selectedSkillId", effectiveModule.skillId);
    localStorage.setItem("selectedLessonTitle", effectiveModule.upNext.title);
    window.location.href = "../pages/roadmap.html"; 
  });
}


  } catch (error) {
    console.error("Dashboard loading error:", error);
    const percentText = document.querySelector(".percent-text");
    if (percentText) percentText.textContent = "0%";
    renderStreakDays([]);
    renderWeekCalendar([]);
  }

















  







}



















initChart();
initDashboard();
