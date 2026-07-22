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

/* =====================================================
   ✅ إضافة جديدة: حساب أيام الأسبوع الحالي بالتاريخ الحقيقي
   بدل ما تكون التواريخ ثابتة، هنحسبها من تاريخ اليوم فعليًا
   ===================================================== */
function getCurrentWeekDates(startDay = 1) {
  // startDay: 0=Sunday, 6=Saturday (غيّريها حسب أول يوم في أسبوعكم)
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();
  const todayIndex = today.getDay();

  // نحسب فرق الأيام عشان نوصل لأول يوم في الأسبوع
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

/* =====================================================
   ✅ تعديل: renderStreakDays بقى بيدمج تاريخ اليوم الحقيقي
   مع بيانات "done" الجاية من الداتا (currentUser.streakWeek)
   ===================================================== */
function renderStreakDays(streakWeek = []) {
  const container = document.getElementById("streakDaysContainer");
  if (!container) return;

  container.innerHTML = "";

  const realWeek = getCurrentWeekDates(); // الأسبوع الحالي بتواريخ حقيقية

  realWeek.forEach((weekDay) => {
    // نلاقي هل اليوم ده متسجل "done" في بيانات اليوزر ولا لأ
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

/* =====================================================
   ✅ تصحيح: كانت بتعمل setItem كل مرة تفتح فيها الصفحة
   وده بيبوّظ أي user id اتسجل قبل كده. دلوقتي بس أول مرة
   ===================================================== */
if (!localStorage.getItem("currentUserId")) {
  localStorage.setItem("currentUserId", "1");
}

async function initDashboard() {
  try {
    const data = await loadDashboardData();
    console.log(data);

    // ✅ تصحيح: نتأكد إن المقارنة بتتم بنفس النوع (String مع String)
    const currentUserId = String(localStorage.getItem("currentUserId"));
    const currentUser = data.find((u) => String(u.id) === currentUserId);

    if (!currentUser) {
      console.warn("لم يتم العثور على المستخدم");
      renderStreakDays([]);
      return;
    }

    const percent = Number(currentUser.overallScore) || 0;
    const chart = progressChart || initChart();

    if (chart) {
      chart.data.datasets[0].data = [percent, Math.max(0, 100 - percent)];
      chart.update();
    }

    const percentText = document.querySelector(".percent-text");
    if (percentText) {
      percentText.textContent = `${percent}%`;
    }

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

    /* =====================================================
       ✅ إضافة: دالة صغيرة تتأكد إن العنصر موجود قبل ما تكتب فيه
       عشان الكود ميوقفش بالغلط لو عنصر ناقص من الـ HTML
       ===================================================== */
    const setText = (el, value) => {
      if (el) el.innerHTML = value;
    };

    setText(level, currentUser.level);
    setText(userName, currentUser.username);
    setText(track, currentUser.track);
    setText(
      completedModule,
      `${currentUser.completedSkillIds?.length ?? 0} / ${currentUser.skills?.length ?? 0}`
    );
    setText(valuexp, currentUser.xpEarned);
    setText(numberstreak, `${currentUser.streakDays} Days`);
    setText(
      numberweakgoals,
      `${currentUser.weeklyGoalDone} / ${currentUser.weeklyGoalTotal}`
    );

    if (currentUser.currentModule) {
      setText(namecourse, `${currentUser.currentModule.skillName} Basics`);
      setText(course_track, `${currentUser.track} track`);
      setText(progress_percent, `${currentUser.currentModule.progressPercent} %`);

      if (progress_fill) {
        progress_fill.style.width = `${currentUser.currentModule.progressPercent}%`;
      }

      if (currentUser.currentModule.nextLesson) {
        setText(lesson_name, currentUser.currentModule.nextLesson.title);
        setText(lesson_duration, `${currentUser.currentModule.nextLesson.durationMinutes} min`);
      }

      if (currentUser.currentModule.upNext) {
        setText(secondlesson, currentUser.currentModule.upNext.title);
        setText(second_duration, `${currentUser.currentModule.upNext.durationMinutes} min`);
      }
    }

    // clock / greeting
    if (clock) {
      const hour = new Date().getHours();
      let greeting;

      if (hour < 12) {
        greeting = "Good morning";
      } else if (hour < 18) {
        greeting = "Good afternoon";
      } else {
        greeting = "Good evening";
      }
      clock.innerHTML = `${greeting}, ${currentUser.username}`;
    }

    renderStreakDays(currentUser.streakWeek || []);
    renderWeekCalendar(currentUser.streakWeek || []); // ✅ القسم الجديد "This Week"
  } catch (error) {
    console.error("Dashboard loading error:", error);
    const percentText = document.querySelector(".percent-text");
    if (percentText) {
      percentText.textContent = "0%";
    }
    renderStreakDays([]);
    renderWeekCalendar([]);
  }
}

/* =====================================================
   ✅ إضافة جديدة: قسم "This Week" (calendar-widget)
   نفس فكرة renderStreakDays بس بشكل الـ HTML بتاعه هو
   بالـ i class بتاعة font-awesome بدل الدوائر
   ===================================================== */
function renderWeekCalendar(streakWeek = []) {
  const container = document.querySelector(".week-calendar"); // ✅ بيستخدم نفس الـ class القديم
  if (!container) return;

  container.innerHTML = "";

  const realWeek = getCurrentWeekDates(); // نفس دالة حساب الأسبوع الحقيقي

  realWeek.forEach((weekDay) => {
    const matched = streakWeek.find((d) => d.day === weekDay.day);
    const isDone = matched ? !!matched.done : false;

    const dayEl = document.createElement("div");
    dayEl.className = "week-day";
    if (isDone) dayEl.classList.add("completed");
    if (weekDay.isToday) dayEl.classList.add("today");

    let iconClass = "fa-regular fa-circle"; // يوم لسه ماجاش
    if (isDone) {
      iconClass = "fa-solid fa-check";
    } else if (weekDay.isToday) {
      iconClass = "fa-solid fa-circle-dot";
    }

    dayEl.innerHTML = `
      <span class="day-name">${weekDay.day}</span>
      <span class="day-date">${weekDay.date}</span>
      <i class="${iconClass}"></i>
    `;

    container.appendChild(dayEl);
  });
}

initChart();
initDashboard();