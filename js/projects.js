//side_bar
function initSidebar() {
    const barsIcon = document.querySelector(".bars-icon");
    const sideBar = document.querySelector(".sidebar");
    const overlay = document.querySelector(".overlay");

    if (!barsIcon || !sideBar || !overlay) return;

    barsIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        sideBar.classList.toggle("open");
        const icon = barsIcon.querySelector("i");
        if (icon) {
            icon.classList.toggle("fa-bars");
            icon.classList.toggle("fa-xmark");
        }
        overlay.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
        if (!sideBar.contains(e.target) && !barsIcon.contains(e.target)) {
            sideBar.classList.remove("open");
            const icon = barsIcon.querySelector("i");
            if (icon) {
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            }
            overlay.classList.remove("show");
        }
    });
}
initSidebar();
//////////////
const projectsContainer = document.querySelector('.projects-container');
let allProjects = [];
// ================= LOAD PROJECTS =================
async function loadProjects() {
    const response = await fetch("http://localhost:3000/projects");
    allProjects = await response.json();
    // للتجربة فقط
    const currentTrackId = 5;
    // const currentTrackId = parseInt(localStorage.getItem("trackId")); // الجزء الاصلى عشان تبقى دينامك 
    const filteredProjects = allProjects.filter(function (project) {
        return project.trackId === currentTrackId;
    });
    projectsContainer.innerHTML = '';
    filteredProjects.forEach(function (project) {
        projectsContainer.innerHTML += createProjectCard(project);
    });
}
loadProjects();
// ================= CREATE CARD =================
function createProjectCard(project) {
    let stars = '';
    if (project.difficulty === 'Easy') {
        stars = `
            <i class="fa-solid fa-star"></i>
            <i class="fa-regular fa-star"></i>
            <i class="fa-regular fa-star"></i>
        `;
    } else if (project.difficulty === 'Medium') {
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
                <span class="difficulty ${project.difficulty.toLowerCase()}">
                    ${project.difficulty}
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