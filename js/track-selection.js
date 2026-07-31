const trackCards = document.querySelectorAll(".track-card");

// choose your track then go to test.
trackCards.forEach((track) => {
  track.addEventListener("click", () => {
    const userId = localStorage.getItem("currentUserId");
    const selectedTrack = track.dataset.track;
    const selectedLevel = track.dataset.level.trim(); // <-- إضافة جديدة

    fetch("http://localhost:3000/roadmaps")
      .then((res) => {
        if (!res.ok) throw new Error("failed to fetch roadmaps");
        return res.json();
      })
      .then((roadmaps) => {
        const myRoadmap = roadmaps.find((roadmap) => roadmap.id === selectedTrack);
        if (!myRoadmap) throw new Error("your roadmap not found");

        const userSkills = myRoadmap.skills.map((skill, index) => ({
          id: index + 1,
          name: skill.title,
          lessons: skill.lessons.map((lesson) => ({
            title: lesson.title,
            completed: false,
          })),
        }));

        return fetch(`http://localhost:3000/users/${userId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            track: selectedTrack,
            level: selectedLevel,   // <-- إضافة جديدة
            skills: userSkills,
          }),
        });
      })
      .then((res) => {
        if (!res.ok) throw new Error("failed to update user info");
        return res.json();
      })
      .then(() => {
        localStorage.setItem("selectedTrack", selectedTrack);
        window.location.href = "quiz.html";
      })
      .catch((error) => {
        console.error(error);
      });
  });
});