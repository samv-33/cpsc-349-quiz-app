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
      const listItem = document.createElement("li");
      listItem.textContent = `Question ${index + 1}: 
        Your answer: ${result.selectedOption || "Not answered"} 
        | Correct answer: ${result.correctOption}`;
      listItem.style.color = result.correct ? "green" : "red";
      feedbackList.appendChild(listItem);
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
