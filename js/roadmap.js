let currRoadmap;
let currUser;
async function loadRoadmap() {
  const userId = localStorage.getItem("currentUserId");
  const user = await fetch(`http://localhost:3000/users/${userId}`).then(
    (res) => res.json(),
  );
  const selectedTrack = user.track;
  const roadmaps = await fetch(
    `http://localhost:3000/roadmaps?id=${selectedTrack}`,
  ).then((res) => res.json());
  currRoadmap = roadmaps[0];
  currUser = await fetch(`http://localhost:3000/users/${userId}`).then((res) =>
    res.json(),
  );

  renderHeader(currRoadmap);
  renderTimeline(currRoadmap.skills, currUser, currRoadmap);
  renderOvarallProgress(currRoadmap);
  renderModulesDone(currRoadmap);
  renderLessonsDone(currRoadmap.skills, currRoadmap);
  renderSkillProgress(currRoadmap.skills);
  renderCurrSkill();
  renderMotivationMessage();
  renderRoadmapResult();
}

loadRoadmap();

//Functions

// => find a lesson's completed state inside currUser
function getUserLesson(skillTitle, lessonTitle) {
  const skill = currUser.skills.find((s) => s.name === skillTitle);
  if (!skill || !skill.lessons) return null;
  return skill.lessons.find((l) => l.title === lessonTitle) || null;
}

function isLessonCompletedForUser(skillTitle, lessonTitle) {
  const userLesson = getUserLesson(skillTitle, lessonTitle);
  return userLesson ? !!userLesson.completed : false;
}

// => put header according to your track
function renderHeader(roadmap) {
  document.getElementById("roadmap-title").textContent =
    `${roadmap.title} Roadmap`;
}

function renderOvarallProgress(roadmap) {
  const completedBdg = document.querySelector(".p-badge-completed");
  const overallProgress = calcOverallProgress(roadmap);
  if (overallProgress === 100) {
    completedBdg.classList.remove("pending");
    completedBdg.classList.add("done");
    completedBdg.innerHTML = "Completed";
  } else {
    completedBdg.classList.add("pending");
    completedBdg.classList.remove("done");
    completedBdg.innerHTML = "Pending";
  }

  document.getElementById("overall-progress").textContent =
    calcOverallProgress(roadmap) + "%";
  document.getElementById("ovarall-progress-width").style.width =
    `${calcOverallProgress(roadmap)}%`;
}

function renderModulesDone(roadmap) {
  const modulesDone = calcNumCompletedSkills(roadmap);

  document.getElementById("modules-done").textContent =
    `${calcNumCompletedSkills(roadmap)} / ${roadmap.skills.length}`;
  document.getElementById("modules-remaining").textContent =
    `${roadmap.skills.length - modulesDone} remaining`;
}

function renderLessonsDone(skills, roadmap) {
  const { doneLessons, allLessons } = calcLessonsProgress(roadmap);
  console.log(doneLessons);
  console.log(allLessons);

  document.getElementById("lessons-done").textContent =
    `${doneLessons} / ${allLessons}`;
  document.getElementById("lessons-left").textContent =
    `${allLessons - doneLessons} lessons left`;
}

function renderSkillProgress(skills) {
  const percentages = document.querySelectorAll(".skill-percentage");
  const progressBars = document.querySelectorAll(".progress-bars");
  const completedBadge = document.querySelectorAll(".p-badge");
  skills.forEach((skill, skillIndex) => {
    const skillProgress = calcSkillProgress(skill);
    percentages[skillIndex].textContent = `${skillProgress}%`;
    progressBars[skillIndex].style.width = `${skillProgress}px`;
    if (skillProgress === 100) {
      completedBadge[skillIndex].classList.remove("pending");
      completedBadge[skillIndex].classList.add("done");
      completedBadge[skillIndex].innerHTML = "Completed";
    } else {
      completedBadge[skillIndex].classList.add("pending");
      completedBadge[skillIndex].classList.remove("done");
      completedBadge[skillIndex].innerHTML = "Pending";
    }
  });
  console.log(document.querySelectorAll(".p-badge").length);
  console.log(currRoadmap.skills.length);
}

// => draw UI for each skill & lesson
function renderTimeline(skills, user, roadmap) {
  const timeline = document.getElementById("timeline");
  timeline.innerHTML = "";
  skills.forEach((skill, skillIndex) => {
    timeline.innerHTML += createSkillCard(skill, skillIndex, user, roadmap);
  });

  addToggleEvents();
  addLessonEvents();
}

function createSkillCard(skill, skillIndex, user, roadmap) {
  const classLevel = skill.level.toLowerCase();
  const numOfLessons = skill.lessons.length;
  const status = getSkillStatus(skill.title, user, roadmap);
  return `
        <div class="timeline-card ${status === "Locked" ? "locked" : ""}">
            <div class="level-card-header">
                <div class="timeline-card-dtls">
                    <div class="timeline-card-icon"
                        style="background-color:#1D293D; border:1px solid #523335"><span>${skill.icon}</span>
                    </div>
                    <div class="lvl">
                        <div style="display: flex; gap:20px;">
                            <h3>${skill.title}</h3>
                        </div>
                        <div class="lvl-dtls">
                            <strong class="${classLevel}">${skill.level}</strong>
                            <span class="statics"><i class="fa-regular fa-clock"></i> ${skill.duration}</span>
                            <span class="statics"><i class="fa-brands fa-leanpub"></i>
                                ${numOfLessons}
                                lessons</span>
                        </div>
                    </div>
                </div>
                <div class="drop-down-arrow">
                    <div class="progress-status">
                        <p class="p-badge ${status.toLowerCase()}" style="width:fit-content; margin:0 auto;">${status}</p>
                        <div style="display: flex; align-items:center; gap:10px;">
                            <div style="position: relative; width:100px; height:5px; background-color: var(--text-muted); border-radius: 5px;">
                                <div class="progress-bars" style="position: absolute; height:5px; background: linear-gradient(150deg,#00D492,#a7fbe0,#13ac7b); border-radius: 5px;">
                                </div>
                            </div>
                            <span class="skill-percentage" style="color:var(--text-muted)"></span>
                        </div>
                    </div>
                    <div class="arrow-icon" style="cursor: pointer;">
                        <i class="fa-solid fa-angle-down" style="color:var(--text-muted);"></i>
                    </div>
                </div>
            </div>
            ${createLessonList(skill, skillIndex, status)}
        </div>
  `;
}

function createLessonList(skill, skillIndex, status) {
  return `
  <div class="skill-level">
    <div class="line"></div>
    ${skill.lessons.map((lesson, lessonIndex) => createOneLesson(lesson, skillIndex, lessonIndex, status, skill.title)).join("")}
    </div>`;
}

function createOneLesson(lesson, skillIndex, lessonIndex, status, skillTitle) {
  let checked = "";
  let disabled = "";
  if (status === "Completed") {
    checked = "checked";
    disabled = "disabled";
  } else if (status === "Current") {
    checked = isLessonCompletedForUser(skillTitle, lesson.title)
      ? "checked"
      : "";
    disabled = "";
  } else {
    checked = "";
    disabled = "disabled";
  }

  return `
    <div class="lesson-card ${status.toLowerCase() === "current" ? "" : `${status.toLowerCase()}`}">
        <label style="cursor : pointer">
            <input type="checkbox" class="checkbox" data-skill="${skillIndex}" data-lesson="${lessonIndex}" ${checked} ${disabled}>
            ${lesson.title}</label>
        <div class="lesson-resources">
            <a href="${lesson.resources.docs}" target="_blank" rel="noopener noreferrer">
                📄DOCS <strong>|</strong>
            </a>
            <a href="${lesson.resources.youtube}" target="_blank" rel="noopener noreferrer">▶️Youtube</a>
        </div>
    </div>`;
}

// => drop-down by arrow-icon
function addToggleEvents() {
  const arrowIcons = document.querySelectorAll(".arrow-icon i");

  // close and open card of each level
  arrowIcons.forEach((arrow) => {
    arrow.addEventListener("click", () => {
      console.log("Arrow Event Fired");
      arrow.classList.toggle("fa-chevron-up");
      arrow.classList.toggle("fa-angle-down");

      const timelineCard = arrow.closest(".timeline-card");
      const cardDetails = timelineCard.querySelector(".skill-level");
      cardDetails.classList.toggle("show");
    });
  });
}

// => update data if any lesson completed
function addLessonEvents() {
  const checkboxes = document.querySelectorAll(".checkbox");

  checkboxes.forEach((checkbox) => {
    const lessonCard = checkbox.closest(".lesson-card");

    checkbox.addEventListener("change", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const skillIndex = checkbox.dataset.skill;
      const lessonIndex = checkbox.dataset.lesson;
      if (checkbox.checked) {
      }
      lessonCard.classList.toggle("completed", checkbox.checked);
      updateLesson(skillIndex, lessonIndex, checkbox.checked);
    });
  });
}

async function updateLesson(skillIndex, lessonIndex, completed) {
  checkWeeklyReset();
  const roadmapSkill = currRoadmap.skills[skillIndex];
  const roadmapLesson = roadmapSkill.lessons[lessonIndex];

  // find (or create) the matching skill/lesson inside currUser
  const userSkill = currUser.skills.find((s) => s.name === roadmapSkill.title);
  if (!userSkill) {
    console.error("Skill not found in user data:", roadmapSkill.title);
    return;
  }
  if (!userSkill.lessons) userSkill.lessons = [];

  let userLesson = userSkill.lessons.find(
    (l) => l.title === roadmapLesson.title,
  );
  if (!userLesson) {
    userLesson = { title: roadmapLesson.title, completed: false };
    userSkill.lessons.push(userLesson);
  }

  if (userLesson.completed === completed) return;
  userLesson.completed = completed;
  const completedLessons = currUser.skills.reduce((total, skill) => {
    return total + skill.lessons.filter((lesson) => lesson.completed).length;
  }, 0);

  currUser.weeklyGoalTotal ??= 7;

  currUser.weeklyGoalDone = Math.min(
    completedLessons,
    currUser.weeklyGoalTotal,
  );

  if (calcSkillProgress(roadmapSkill) === 100) {
    if (!currUser.completedSkillIds.includes(roadmapSkill.title)) {
      currUser.completedSkillIds.push(roadmapSkill.title);
      renderTimeline(currRoadmap.skills, currUser, currRoadmap);
    }
  }

  if (completed) {
    currUser.xpEarned += 100;
  } else {
    currUser.xpEarned = Math.max(0, currUser.xpEarned - 100);
  }
  // Update overall score
  currUser.overallScore = calcOverallProgress(currRoadmap);

  // Update current module
  const currentSkill = currRoadmap.skills.find(
    (skill) => !currUser.completedSkillIds.includes(skill.title),
  );

  if (currentSkill) {
    currUser.currentModule = {
      skillId: currentSkill.title,
      skillName: currentSkill.title,
      progressPercent: calcSkillProgress(currentSkill),
      nextLesson: {
        title:
          currentSkill.lessons.find(
            (l) => !isLessonCompletedForUser(currentSkill.title, l.title),
          )?.title || "",
        durationMinutes: 30,
      },
      upNext: {
        title:
          currentSkill.lessons.filter(
            (l) => !isLessonCompletedForUser(currentSkill.title, l.title),
          )[1]?.title || "",
        durationMinutes: 30,
      },
    };
  }
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
  });

  if (!currUser.streakWeek) currUser.streakWeek = [];

  const todayObj = currUser.streakWeek.find((d) => d.day === today);

  if (todayObj) {
    todayObj.done = true;
  } else {
    currUser.streakWeek.push({
      day: today,
      done: true,
    });
  }

  currUser.streakDays = currUser.streakWeek.filter((d) => d.done).length;

  renderOvarallProgress(currRoadmap);
  renderModulesDone(currRoadmap);
  renderLessonsDone(currRoadmap.skills, currRoadmap);
  renderSkillProgress(currRoadmap.skills);
  renderCurrSkill();
  renderRoadmapResult();

  const response = await fetch(`http://localhost:3000/users/${currUser.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      skills: currUser.skills,
      completedSkillIds: currUser.completedSkillIds,
      xpEarned: currUser.xpEarned,
      overallScore: currUser.overallScore,
      currentModule: currUser.currentModule,
      streakDays: currUser.streakDays,
      streakWeek: currUser.streakWeek,
      weeklyGoalDone: currUser.weeklyGoalDone,
      weeklyGoalTotal: currUser.weeklyGoalTotal,
      lastWeeklyReset: currUser.lastWeeklyReset,
    }),
  });
  console.log(response.status);
  const data = await response.json();
  console.log(data);
}

function calcSkillProgress(skill) {
  let allLessons = skill.lessons.length;
  if (allLessons === 0) return 0;
  let doneLessons = 0;
  skill.lessons.forEach((lesson) => {
    if (isLessonCompletedForUser(skill.title, lesson.title)) doneLessons++;
  });
  let skillProgress = Math.round((doneLessons / allLessons) * 100);
  return skillProgress;
}

function calcLessonsProgress(roadmap) {
  let doneLessons = 0;
  let allLessons = 0;

  roadmap.skills.forEach((skill) => {
    skill.lessons.forEach((lesson) => {
      allLessons++;

      if (isLessonCompletedForUser(skill.title, lesson.title)) {
        doneLessons++;
      }
    });
  });

  return { doneLessons, allLessons };
}

function calcNumCompletedSkills(roadmap) {
  let doneSkills = 0;
  roadmap.skills.forEach((skill) => {
    let doneLessons = 0;
    skill.lessons.forEach((lesson) => {
      if (isLessonCompletedForUser(skill.title, lesson.title)) doneLessons++;
    });
    if (doneLessons === skill.lessons.length) doneSkills++;
  });
  return doneSkills;
}

function calcOverallProgress(roadmap) {
  let doneLessons = 0;
  let allLessons = 0;
  roadmap.skills.forEach((skill) => {
    skill.lessons.forEach((lesson) => {
      if (isLessonCompletedForUser(skill.title, lesson.title)) doneLessons++;
      allLessons++;
    });
  });
  let overallProgress = Math.round((doneLessons / allLessons) * 100);
  return overallProgress;
}

function getSkillStatus(skillTitle, user, roadmap) {
  const completedSkill = user.completedSkillIds;
  if (completedSkill.includes(skillTitle)) return "Completed";

  const currSkill = roadmap.skills[completedSkill.length];
  if (currSkill.title === skillTitle) {
    return "Current";
  }
  return "Locked";
}
function renderCurrSkill() {
  const currentSkill = currRoadmap.skills[currUser.completedSkillIds.length];

  document.getElementById("curr-skill").textContent = currentSkill
    ? currentSkill.title
    : "Completed";
}

async function renderMotivationMessage() {
  const messages = await fetch("http://localhost:3000/motivationMessages").then(
    (res) => res.json(),
  );

  const randomIndex = Math.floor(Math.random() * messages.length);

  document.getElementById("motivation-message").textContent =
    `✨${messages[randomIndex].message}✨`;
}

function renderRoadmapResult() {
  const section = document.getElementById("roadmap-result");

  if (calcOverallProgress(currRoadmap) === 100) {
    section.innerHTML = `
      <div class="roadmap-result">

        <div class="result-header">
          <div class="result-icon">🏆</div>

          <div>
            <h3>Roadmap Completed</h3>
            <p>
              Congratulations! You have successfully completed the
              <strong>${currRoadmap.title}</strong> roadmap.
              You are now ready to build real-world projects and explore career opportunities.
            </p>
          </div>
        </div>

        <div class="result-buttons">
          <button class="result-btn primary" id="projects-btn">
            Explore Projects
          </button>

          <button class="result-btn secondary" id="jobs-btn">
            Browse Jobs
          </button>
        </div>

      </div>
    `;

    document.getElementById("projects-btn").addEventListener("click", () => {
      window.location.href = "projects.html";
    });

    document.getElementById("jobs-btn").addEventListener("click", () => {
      window.location.href = "career-match.html";
    });
  } else {
    section.innerHTML = `
      <div class="roadmap-result result-locked">

        <div class="result-header">
          <div class="result-icon">🔒</div>

          <div>
            <h3>Roadmap Completion</h3>
            <p>
              Complete all modules to unlock your next learning journey,
              including recommended projects and career opportunities.
            </p>
          </div>
        </div>

      </div>
    `;
  }
}

// sidebar
const links = document.querySelectorAll(".links-sidebar nav ul li");
const sidebar = document.querySelector(".sidebar");
const menuToggle = document.querySelector(".mobile-menu-toggle");

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

function checkWeeklyReset() {
  const today = new Date();

  // the week starts from Monday.
  const monday = new Date(today);
  const day = monday.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  monday.setDate(today.getDate() + diff);

  const weekKey = monday.toISOString().split("T")[0];

  if (currUser.lastWeeklyReset !== weekKey) {
    currUser.weeklyGoalDone = 0;
    currUser.lastWeeklyReset = weekKey;
  }
}

const logoutBtn = document.querySelector(".log-out a");

logoutBtn.addEventListener("click", function (e) {
  e.preventDefault();

  Swal.fire({
    title: "Are you sure?",
    text: "Do you want to log out?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, Log out",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      const currentUserId = localStorage.getItem("currentUserId");

      fetch(`http://localhost:3000/users/${currentUserId}`, {
        method: "DELETE",
      })
        .then(() => {
          localStorage.removeItem("currentUserId");

          Swal.fire({
            icon: "success",
            title: "Logged Out!",
            text: "You have been logged out successfully.",
            timer: 1500,
            showConfirmButton: false,
          }).then(() => {
            window.location.href = "../index.html";
          });
        })
        .catch(() => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Logout failed.",
          });
        });
    }
  });
});
