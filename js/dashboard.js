
async function getData(){
    let response=await fetch("../data/db.json")
    let data=await response.json()
    console.log(data);
}

getData()


let links=document.querySelectorAll(".links-sidebar nav ul li")
let clock=document.querySelector(".clock")
console.log(clock);
console.log(links);

links.forEach((link)=>{
    link.addEventListener("click",function(){
        links.forEach((e)=>{
            e.classList.remove("active")
        })
        this.classList.add("active")
    })
    
})
const now = new Date();
const hour = now.getHours(); 
console.log(hour); 

let greeting;

if (hour < 12) {
  greeting = "Good morning";
} else if (hour < 18) {
  greeting = "Good afternoon";
} else {
  greeting = "Good evening";
}
clock.innerHTML=`${greeting}, <span class="log">naema <span class="emo">👋</span></span> `

// streak 
function renderStreakDays(streakWeek) {
  const container = document.getElementById("streakDaysContainer");
  container.innerHTML = "";

  const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });

  streakWeek.forEach(dayData => {
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


const ctx = document.getElementById('progressChart');
const progressChart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    datasets: [{
      data: [0, 100],
      backgroundColor: ['#8b5cf6', '#2a2a3d'],
      borderWidth: 0
    }]
  },
  options: {
    cutout: '75%',
    rotation: -90,
    plugins: { legend: { display: false }, tooltip: { enabled: false } }
  }
});


async function loadDashboardData() {
  const response = await fetch("../data/db.json");
  const data = await response.json();
  return data;
}

async function initDashboard() {
  const data = await loadDashboardData();


  const currentUser = data.users[0];
  const percent = currentUser.overallScore;

  progressChart.data.datasets[0].data = [percent, 100 - percent];
  progressChart.update();

  document.querySelector(".percent-text").textContent = percent + "%";

   renderStreakDays(currentUser.streakWeek);
}

initDashboard();









