let score = 0;
let timeLeft = 60;
let timer;
let correctAnswers = 0;
let wrongAnswers = 0;
let currentQuestion = {};


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateQuestion() {
    let p, q, b, c;
    
    // Ensure p, q are not zero and b is not zero
    do {
        p = getRandomInt(-10, 10);
        q = getRandomInt(-10, 10);
        b = p + q;
        c = p * q;
    } while (p === 0 || q === 0 || b === 0); // Prevents b from being zero

    // Format polynomial correctly
    let bTerm = "";
    if (b === 1) {
        bTerm = " + x"; // No "1x", just "x"
    } else if (b === -1) {
        bTerm = " - x"; // No "-1x", just "-x"
    } else if (b > 0) {
        bTerm = ` + ${b}x`;
    } else {
        bTerm = ` - ${Math.abs(b)}x`;
    }

    let cTerm = c === 0 ? "" : (c > 0 ? ` + ${c}` : ` - ${Math.abs(c)}`);

    currentQuestion = {
        p: p,
        q: q,
        expression: `x²${bTerm}${cTerm}`
    };

    document.getElementById("question").innerText = `Factor: ${currentQuestion.expression}`;
    document.getElementById("answer").value = ""; // Clear previous answer
}

// Allow Enter key to submit answer
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("startButton").addEventListener("click", startGame);

    document.getElementById("answer").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            checkAnswer();
        }
    });

    generateQuestion();
});

// Initialize the first question
generateQuestion();

let correctStreak = 0; // Tracks consecutive correct answers

function checkAnswer() {
    let userAnswer = document.getElementById("answer").value.replace(/\s+/g, ''); // Remove spaces
    let p = currentQuestion.p;
    let q = currentQuestion.q;

    let correctAnswer1 = `(x${p < 0 ? p : '+' + p})(x${q < 0 ? q : '+' + q})`;
    let correctAnswer2 = `(x${q < 0 ? q : '+' + q})(x${p < 0 ? p : '+' + p})`; // Swapped order

    if (userAnswer === correctAnswer1 || userAnswer === correctAnswer2) {
        score++;
        correctStreak++; // Increase correct streak
        
        // Random positive feedback messages
        let positiveFeedback = [
            "Great job! 🎉",
            "You're a factoring master! 🔥",
            "Keep it up! 🚀",
            "Awesome work! ✅",
            "You’re nailing this! 🌟"
        ];
        
        // Pick a random phrase
        let feedbackMessage = positiveFeedback[Math.floor(Math.random() * positiveFeedback.length)];
        
        // Special bonus message after 3 correct in a row
        if (correctStreak === 3) {
            feedbackMessage = "Incredible! You're on fire! 🔥🔥🔥";
        } else if (correctStreak === 5) {
            feedbackMessage = "Math genius alert! 🚀💡";
        } else if (correctStreak === 10) {
            feedbackMessage = "Unstoppable! 🏆 You should be teaching this! 👏";
        }

        document.getElementById("feedback").innerText = feedbackMessage;
    } else {
        correctStreak = 0; // Reset streak if incorrect
        document.getElementById("feedback").innerText = "❌ Incorrect, try again!";
    }

    if (userAnswer === correctAnswer1 || userAnswer === correctAnswer2) {
        score++;
        correctAnswers++; // Track correct answers
        correctStreak++;
    } else {
        wrongAnswers++; // Track wrong answers
        correctStreak = 0;
    }
    
    
    document.getElementById("score").textContent = score; // Update only the score number
    generateQuestion(); // Generate new question
}



function startGame() {
    score = 0;
    timeLeft = parseInt(document.querySelector('input[name="timer"]:checked').value); // Get selected time

    document.getElementById("score").textContent = score;
    document.getElementById("timer").textContent = timeLeft;
    
    // Clear any existing timer to prevent multiple countdowns
    if (timer) {
        clearInterval(timer);
    }

    // Re-enable input and submit button
    document.getElementById("answer").disabled = false;
    document.querySelector("#question-box button").disabled = false;

    generateQuestion(); // Generate a new question

    // Start the countdown timer
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}




function endGame() {
    clearInterval(timer); // Stop the timer
    document.getElementById("final-score").innerText = score;
    document.getElementById("end-screen").classList.remove("hidden");

    // Disable input and submit button to prevent further answers
    document.getElementById("answer").disabled = true;
    document.querySelector("#question-box button").disabled = true;
}

function generateCertificate() {

    document.getElementById("certificate").style.display = "block";


    let playerName = document.getElementById("player-name").value.trim();
    if (playerName === "") {
        playerName = "Student"; // Default if no name is entered
    }

    let totalQuestions = correctAnswers + wrongAnswers;
    let percentage = totalQuestions > 0 ? ((correctAnswers / totalQuestions) * 100).toFixed(2) : 0;

    // Achievement messages based on performance
    let achievementMessage = "";
    if (percentage === 100) {
        achievementMessage = "Outstanding performance! You achieved a perfect score! 🌟";
    } else if (percentage >= 90) {
        achievementMessage = "Amazing work! You're mastering factoring like a pro! 🚀";
    } else if (percentage >= 75) {
        achievementMessage = "Great job! You're on your way to becoming a factoring expert! 💡";
    } else if (percentage >= 50) {
        achievementMessage = "Good effort! Keep practicing and you'll be a pro in no time! 🔥";
    } else {
        achievementMessage = "Keep going! Every mistake is a step toward improvement. 💪";
    }

    // Get the selected timer challenge
    let selectedTimer = document.querySelector('input[name="timer"]:checked')?.value || "Unknown";

    // Certificate template
    let certificateHTML = `
        <h2>Factoring Challenge Certificate</h2>
        <p><strong>Congratulations, ${playerName}!</strong></p>
        <p>You completed the Factoring Challenge in <strong>${selectedTimer} seconds</strong> with the following results:</p>
        <ul>
            <p><strong>Correct Answers:</strong> ${correctAnswers} and <strong>Wrong Answers:</strong> ${wrongAnswers}</p>
            <p></p>
            <p><strong>Total Questions Attempted:</strong> ${totalQuestions}</p>
            <p><strong>Accuracy:</strong> ${percentage}%</p>
        </ul>
        <p>${achievementMessage}</p>
        <p>Keep up the great work, and continue sharpening your math skills! </p>
    `;

    document.getElementById("certificate").innerHTML = certificateHTML;
}

function saveCertificateAsImage() {
    const certificateElement = document.getElementById("certificate");

    html2canvas(certificateElement).then(canvas => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "Factoring_Certificate.png";
        link.click();
    });
}

function saveCertificateAsPDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
        orientation: "landscape", // Landscape format
        unit: "in", // Use inches
        format: [11, 8.5] // US Letter size (11 x 8.5 inches)
    });

    const certificateElement = document.getElementById("certificate");

    html2canvas(certificateElement, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL("image/png");

        const margin = 0.5; // Adjust bottom margin (in inches)
        const imgWidth = 10.2; // Keep some space on left/right
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.setFontSize(15); // Adjust font size (default is 16)

        pdf.addImage(imgData, "PNG", margin, margin, imgWidth, imgHeight - margin); // Adds spacing at bottom
        pdf.save("Factoring_Certificate.pdf");
    });
}


