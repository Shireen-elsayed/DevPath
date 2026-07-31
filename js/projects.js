// sidebar
const links = document.querySelectorAll(".links-sidebar nav ul li");
// const clock = document.querySelector(".clock");
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
//////////////
const projectsContainer = document.querySelector('.projects-container');
let allProjects = [];
async function loadProjects() {
    try {
        const response = await fetch("http://localhost:3000/projects");
        if (!response.ok) return;
        allProjects = await response.json();
        const currentTrackId = localStorage.getItem("selectedTrack");
        if (!currentTrackId) {
            projectsContainer.innerHTML ='<p class="no-projects">Please select a track first.</p>';
            return;
        }
        const target = String(currentTrackId).trim().toLowerCase();
        const trackNameToId = {
            "frontend": "1",
            "backend": "2",
            "ui/ux": "3",
            "flutter": "4",
            "data analysis": "5"
        };
        const filteredProjects = allProjects.filter(function (project) {
            const projectTrackId = String(project.trackId).trim().toLowerCase();
            const matchById = projectTrackId === target;
            const matchByName = trackNameToId[target] && projectTrackId === trackNameToId[target];
            return matchById || matchByName;
        });
        projectsContainer.innerHTML = '';
        if (filteredProjects.length === 0) {
            projectsContainer.innerHTML = '<p class="no-projects">No projects found for this track.</p>';
            return;
        }
        filteredProjects.forEach(function (project) {
            projectsContainer.innerHTML += createProjectCard(project);
        });
    } catch (error) {
        projectsContainer.innerHTML = '<p class="error-msg">Error loading projects.</p>';
    }
}
loadProjects();
// ================= CREATE CARD =================
function createProjectCard(project) {
    let stars = '';
    if (project.level === 'Easy') {
        stars = `
            <i class="fa-solid fa-star"></i>
            <i class="fa-regular fa-star"></i>
            <i class="fa-regular fa-star"></i>
        `;
    } else if (project.level === 'Medium') {
        stars = `
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-regular fa-star"></i>
        `;
    } else {
        stars = `
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
        `;
    }
    return `
        <div class="project-card">
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}">
                <span class="difficulty ${project.level.toLowerCase()}">
                    ${project.level}
                </span>
            </div>
            <div class="project-content">
                <div class="content-top">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-footer">
                        <div class="time">
                            <i class="fa-regular fa-clock"></i>
                            ${project.estimatedTime}
                        </div>
                        <div class="project-level">
                            ${stars}
                        </div>
                    </div>
                    <div class="skills">
                    <p class="str">Needed Skills 👇🏻</p>
                    <br>
                        ${project.skills.map(function (skill) {
                            return `<span class="skill">${skill}</span>`;
                        }).join('')}
                    </div>
                </div>
                <button
                    class="details-btn"
                    onclick="showDetails(this)">
                    View Details
                </button>
            </div>
            <!-- DETAILS OVERLAY -->
            <div class="card-overlay">
                <button
                    class="close-overlay"
                    onclick="closeDetails(this)">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <h2>${project.title}</h2>
                <p>${project.details}</p>
            </div>
        </div>
    `;
}
// ================= SHOW DETAILS =================
function showDetails(button) {
    const card = button.closest('.project-card');
    const overlay = card.querySelector('.card-overlay');
    overlay.classList.add('show');
}
// ================= CLOSE DETAILS =================
function closeDetails(button) {
    const overlay = button.closest('.card-overlay');
    overlay.classList.remove('show');
}