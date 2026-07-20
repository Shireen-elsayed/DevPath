fetchProjectData();
initSidebar();

async function fetchProjectData() {
    try {

        const [usersRes, jobsRes, roadmapsRes] = await Promise.all([
            fetch("http://localhost:3000/users"),
            fetch("http://localhost:3000/jobs"),
            fetch("http://localhost:3000/roadmaps")
        ]);

        const users = await usersRes.json();
        const jobs = await jobsRes.json();
        const roadmaps = await roadmapsRes.json();

        const appData = {
            users,
            jobs,
            roadmaps
        };


        const currentUserId = Number(localStorage.getItem("currentUserId"));
        const currentUser = appData.users.find(
    user => Number(user.id) === Number(currentUserId)
);


        if (!currentUser) {
        Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login first to continue.",
        confirmButtonText: "Go to Login"
    }).then(() => {
        window.location.href = "../pages/login.html";
    });

    return;
}

        const userTrack = currentUser.track || "Frontend";
        const userSkills = currentUser.completedSkillIds || [];

        displayUserSkills(userTrack, userSkills, appData);
        displayMatchedJobs(userTrack, userSkills, appData);

    } catch (error) {
        console.error("Error loading data:", error);
    }
}



function displayUserSkills(trackName, userSkills, appData) {
    const container = document.getElementById("current-skills-container");
    if (!container) return;

    const roadmap = appData.roadmaps.find(r => r.track.toLowerCase() === trackName.toLowerCase());
    const trackSkills = roadmap ? (roadmap.skills || []).map(s => s.name) : [];

    const totalTrackSkillsCount = trackSkills.length;
    const earnedSkillsCount = trackSkills.filter(s => userSkills.includes(s)).length;
    const remainingCount = totalTrackSkillsCount - earnedSkillsCount;

    let skillsHTML = `
        <div class="skills-card">
            <h3><i class="fa-solid fa-bullseye"></i> Your Current Skills</h3>
            <div class="skills-badges">
    `;

    trackSkills.forEach(skill => {
        const hasSkill = userSkills.includes(skill);
        if (hasSkill) {
            skillsHTML += `<span class="skill-badge">${skill}</span>`;
        }
    });

    if (remainingCount > 0) {
        skillsHTML += `<span class="skill-badge locked">+${remainingCount} unlocking soon</span>`;
    }

    skillsHTML += `
            </div>
        </div>
    `;
    container.innerHTML = skillsHTML;
}

function displayMatchedJobs(trackName, userSkills, appData) {
    const jobsContainer = document.getElementById("jobs-container");
    if (!jobsContainer) return;

    const filteredJobs = appData.jobs.filter(job => job.track.toLowerCase() === trackName.toLowerCase());

    if (filteredJobs.length === 0) {
        jobsContainer.innerHTML = `<p class="subtitle">No jobs available for your track at the moment.</p>`;
        return;
    }

    let jobsHTML = '';

    filteredJobs.forEach(job => {
        const matched = job.requiredSkills.filter(skill => userSkills.includes(skill));
        
        const matchPercentage = job.requiredSkills.length > 0
    ? Math.round((matched.length / job.requiredSkills.length) * 100)
    : 0;


       let colorClass = 'orange';
        if (matchPercentage >= 85) {
             colorClass = 'green'; } 
        else if (matchPercentage >= 50) { 
            colorClass = 'purple'; }

        const salaryRange = job.salary || "$75k–$115k";
        const jobType = job.type || "Remote";

        jobsHTML += `
            <div class="job-card">
                <div class="job-row-one">
                    <div class="job-main-info">
                        <h3 class="job-title">${job.title}</h3>
                        <span class="job-company">${job.company}</span>
                    </div>
                    <div class="match-rate-box">
                        <span class="match-value ${colorClass}">${matchPercentage}%</span>
                        <span class="match-label">match</span>
                    </div>
                </div>

                <div class="progress-bar-container">
                    <div class="progress-fill ${colorClass}" style="width: ${matchPercentage}%"></div>
                </div>

                <div class="job-row-three">
                    <div class="job-badges-list">
                        ${job.requiredSkills.map(skill => {
                            const isMatch = userSkills.includes(skill);
                            return `
                                <span class="job-badge ${isMatch ? 'acquired' : ''}">
                                    ${skill}
                                </span>
                            `;
                        }).join('')}
                    </div>
                    <div class="job-meta-info">
                        <span class="job-salary">${salaryRange}</span>
                        <span class="job-type-tag">${jobType}</span>
                    </div>
                </div>
            </div>
        `;
    });

    jobsContainer.innerHTML = jobsHTML;
}






// sidebar
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