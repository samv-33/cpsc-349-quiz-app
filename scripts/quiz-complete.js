(function () {
  // Retrieve data from local storage
  let userScore = localStorage.getItem("recentUserScore");
  let totalQuestions = localStorage.getItem("recentTotalQuestions");

  // Update HTML elements with the retrieved data
  document.getElementById("score").innerText = userScore;
  document.getElementById("total").innerText = totalQuestions;

  // Parse the quiz results from local storage
  const quizResults = JSON.parse(localStorage.getItem("recentQuizResults"));
  console.log(quizResults);

  function displayFeedback(quizResults) {
    const feedbackList = document.getElementById("feedbackList");
    feedbackList.innerHTML = "";

    quizResults.forEach((result, index) => {
      const questionInfo = document.createElement("div");
      questionInfo.classList.add("question-info");

      // Create elements for question, selected option, and correct option
      const question = document.createElement("p");
      question.textContent = `Question ${index + 1}: ${result.question}`;
      const selectedOption = document.createElement("p");
      selectedOption.textContent = `Your answer: ${
        result.selectedOption || "Not answered"
      }`;
      const correctOption = document.createElement("p");
      correctOption.textContent = `Correct answer: ${result.correctOption}`;

      // Set color based on correctness
      question.style.color = "black";
      selectedOption.style.color = result.correct ? "green" : "red";
      correctOption.style.color = "green"; // Correct answer always in green

      // Append elements to questionInfo
      questionInfo.appendChild(question);
      questionInfo.appendChild(selectedOption);
      questionInfo.appendChild(correctOption);

      // Append questionInfo to feedbackList
      feedbackList.appendChild(questionInfo);
    });
  }

  function addReviewButtonHandler() {
    const reviewButton = document.getElementById("reviewButton");
    reviewButton.addEventListener("click", function () {
      const feedbackSection = document.getElementById("feedbackSection");
      feedbackSection.style.display = "block"; // Ensure the feedback section is visible
      const quizResults = JSON.parse(localStorage.getItem("recentQuizResults"));
      const quizData = JSON.parse(localStorage.getItem("quizData")); // Retrieve quiz data
      displayFeedback(quizResults, quizData); // Pass both quizResults and quizData to displayFeedback
    });
  }

  // Call the main function to set up event handlers
  function main() {
    addReviewButtonHandler();
  }

  // Call the main function when the page loads
  main();
})();
