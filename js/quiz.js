const questionsContainer = document.getElementById("questionsContainer");
const quizForm = document.getElementById("quizForm");
const trackName = document.getElementById("trackName");
const questionCount = document.getElementById("questionCount");

let questions = [];

const selectedTrackId = Number(localStorage.getItem("trackId")) || 1;

async function loadQuestions() {

    try {

const [tracksRes, questionsRes] = await Promise.all([
    fetch("http://localhost:3000/tracks"),
    fetch("http://localhost:3000/questions")
]);

const tracks = await tracksRes.json();
const allQuestions = await questionsRes.json();

const track = tracks.find(track => track.id === selectedTrackId);

if (track) {
    trackName.textContent = track.name;
}

questions = allQuestions.filter(
    question => question.trackId === selectedTrackId
);
        console.log("Track ID:", selectedTrackId);
console.log("Questions:", questions);
console.log("Questions Count:", questions.length);

        questionCount.textContent = `${questions.length} Questions`;

        displayQuestions();
        

    }

    catch (error) {

        console.error(error);

        Swal.fire({

            icon: "error",
            title: "Error",
            text: "Cannot load questions."

        });

    }

}


function displayQuestions() {

    questionsContainer.innerHTML = "";

    questions.forEach((question, index) => {

        const card = document.createElement("div");

        card.classList.add("question-card");

        let options = "";

        question.options.forEach((option, optionIndex) => {

            const safeOption = option
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");

            options += `

                <label class="option">

                    <input
                        type="radio"
                        name="question${question.id}"
                        value="${optionIndex}"
                    >

                    <span>${safeOption}</span>

                </label>

            `;

        });

        card.innerHTML = `

            <h3 class="question-title">

                ${index + 1}. ${question.question}

            </h3>

            <div class="options">

                ${options}

            </div>

        `;

        questionsContainer.appendChild(card);

    });

}

quizForm.addEventListener("submit", function (e) {

    e.preventDefault();

    let answeredQuestions = 0;
    let skillScores = {};

    questions.forEach(question => {

        const selectedAnswer = document.querySelector(
            `input[name="question${question.id}"]:checked`
        );

        if (selectedAnswer) {

            answeredQuestions++;

            if (Number(selectedAnswer.value) === question.correctAnswer) {

                if (!skillScores[question.skill]) {
                    skillScores[question.skill] = 0;
                }

                skillScores[question.skill]++;

            }

        }

    });

    if (answeredQuestions !== questions.length) {

        Swal.fire({

            icon: "warning",
            title: "Incomplete Quiz",
            text: "Please answer all questions before submitting."

        });

        return;

    }

    const totalScore = Object.values(skillScores).reduce(
        (sum, score) => sum + score,
        0
    );

    localStorage.setItem("skillScores", JSON.stringify(skillScores));
    localStorage.setItem("totalScore", totalScore);

    showResult(skillScores, totalScore);

});


function showResult(skillScores, totalScore) {

    let result = "";

    if (totalScore >= 13) {

        result = "Excellent 🎉";

    } else if (totalScore >= 9) {

        result = "Good 👍";

    } else {

        result = "Keep Learning 💪";

    }

    let resultHTML = "";

    const displayedSkills = [];

    questions.forEach(question => {

        if (!displayedSkills.includes(question.skill)) {

            displayedSkills.push(question.skill);

            const score = skillScores[question.skill] || 0;

            const totalQuestions = questions.filter(
                q => q.skill === question.skill
            ).length;

resultHTML += `

<div class="skill-card">

    <div class="skill-circle">

        <span>${score}</span>

        <small>/${totalQuestions}</small>

    </div>

    <p>${question.skill}</p>

</div>

`;
        }

    });

Swal.fire({
title: result, 
    html: `

        <div class="assessment-result">

            <div class="skills-container">

                ${resultHTML}

            </div>

            <div class="total-circle">

                <span>${totalScore}</span>

                <small>/ ${questions.length}</small>

                <p>Total Score</p>

            </div>

        </div>

    `,

    background: "#13162F",

    color: "#fff",

    width: "700px",

    confirmButtonText: "View Your Roadmap",

    confirmButtonColor: "#7C3AED",

    showCloseButton: true

}).then((result) => {

    if (result.isConfirmed) {

        window.location.href = "roadmap.html";

    }

});}

loadQuestions();
