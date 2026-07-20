//display correct roadmap
const selectedTrack = window.localStorage.getItem("selectedTrack");

fetch("http://localhost:3000/roadmaps")
  .then((res) => res.json())
  .then((roadmaps) => {
    const roadmap = roadmaps.find((track) => track.id === selectedTrack);

    console.log(roadmap);

  });

// sidebar
const barsIcon = document.querySelector(".bars-icon");
const sideBar = document.querySelector(".sidebar");
const overlay = document.querySelector(".overlay");

//open and close sidebar
barsIcon.addEventListener("click", () => {
  sideBar.classList.toggle("open");
  barsIcon.children[0].classList.toggle("fa-bars");
  barsIcon.children[0].classList.toggle("fa-xmark");
  overlay.classList.toggle("show");
});

//to close sidebar when i click on any point on the main page
document.addEventListener("click", (e) => {
  if (!sideBar.contains(e.target) && !barsIcon.contains(e.target)) {
    sideBar.classList.remove("open");
    barsIcon.children[0].classList.remove("fa-xmark");
    barsIcon.children[0].classList.add("fa-bars");
    overlay.classList.remove("show");
  }
});

//your map
const arrowIcons = document.querySelectorAll(".arrow-icon i");

// close and open card of each level
arrowIcons.forEach((arrow) => {
  arrow.addEventListener("click", () => {
    arrow.classList.toggle("fa-chevron-up");
    arrow.classList.toggle("fa-angle-down");

    const timelineCard = arrow.closest(".timeline-card");
    const cardDetails = timelineCard.querySelector(".skill-level");
    cardDetails.classList.toggle("open");
  });
});
