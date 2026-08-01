const trackCards = document.querySelectorAll(".track-card");

// choose your track then go to test.
trackCards.forEach((track) => {
  track.addEventListener("click", () => {
    const userId = localStorage.getItem("currentUserId"); // Saved after login
    const selectedTrack = track.dataset.track;
    const selectedLevel = track.dataset.level.trim();

    //get all roadmaps
    fetch("http://localhost:3000/roadmaps")
      .then((res) => {
        if (!res.ok) {
          throw new Error("failed to fetch roadmaps");
        }
        return res.json();
      })
      .then((roadmaps) => {
        //find selected roadmap
        console.log("selectedTrack:", selectedTrack);
        console.log("roadmaps:", roadmaps);
        console.log(
          "roadmap ids:",
          roadmaps.map((r) => r.id),
        );
        const myRoadmap = roadmaps.find(
          (roadmap) => roadmap.id === selectedTrack,
        );
        if (!myRoadmap) {
          throw new Error("your roadmap not found");
        }

        //create user skills array, each skill now carries its own lessons
        const userSkills = myRoadmap.skills.map((skill, index) => ({
          id: index + 1,
          name: skill.title,
          lessons: skill.lessons.map((lesson) => ({
            title: lesson.title,
            completed: false,
          })),
        }));

        //save track and skills to the user
        return fetch(`http://localhost:3000/users/${userId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            track: selectedTrack,
            level: selectedLevel,
            skills: userSkills,
          }),
        });
      })
      .then((res) => {
        if (!res.ok) {
          throw new Error("failed to update user info");
        }
        return res.json();
      })
      .then(() => {
        localStorage.setItem("selectedTrack", selectedTrack);

        //go to quiz page
        window.location.href = "quiz.html";
      })
      .catch((error) => {
        console.error(error);
      });
  });
});
