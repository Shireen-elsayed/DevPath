const trackCards = document.querySelectorAll(".track-card");

// choose your track then go to test.
trackCards.forEach((track) => {
  track.addEventListener("click", () => {
    const userId = 1;
    // const userId = localStorage.getItem("userId"); // Saved after login
    const selectedTrack = track.dataset.track;

    fetch(`http://localhost:3000/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        track: selectedTrack,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to update user.");
        }
        return res.json();
      })
      .then((user) => {
        localStorage.setItem("selectedTrack", selectedTrack);
        //go to quiz page
        //window.location.href="quiz.html";
        window.location.href = "roadmap.html";
      })
      .catch((error) => {
        console.error(error);
      });
  });
});
