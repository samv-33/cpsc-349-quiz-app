(function () {
  // Retrieve data from local storage
  let userScore = localStorage.getItem("recentUserScore");
  let totalQuestions = localStorage.getItem("recentTotalQuestions");

  // Update HTML elements with the retrieved data
  document.getElementById("score").innerText = userScore;
  document.getElementById("total").innerText = totalQuestions;

  const quizResults = JSON.parse(localStorage.getItem("recentQuizResults"));
  console.log(quizResults);

  function displayFeedback() {
    const feedbackList = document.getElementById("feedbackList");
    feedbackList.innerHTML = "";
    quizResults.forEach((result, index) => {
      const listItem = document.createElement("li");
      listItem.textContent = `Question ${index + 1}: ${
        result.correct ? "Correct" : "Incorrect"
      }`;
      listItem.style.color = result.correct ? "green" : "red";
      feedbackList.appendChild(listItem);
    });
  }

  function addReviewButtonHandler() {
    const reviewButton = document.getElementById("reviewButton");
    reviewButton.addEventListener("click", function () {
      const feedbackSection = document.getElementById("feedbackSection");
      feedbackSection.style.display = "block";
      displayFeedback();
    });
  }
  // Function to get query parameter for quiz number
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  function main() {
    const quizResults = JSON.parse(localStorage.getItem("recentQuizResults"));
    addReviewButtonHandler();
    const quizName = getQueryParam("quiz");
    if (quizName) {
      loadQuizData(quizName).then((data) => {
        const quizData = data.questions;
        totalQuestions = quizData.length; // Set total number of questions
        displayQuestion(); // Display the first question
      });
    }
  }
  main();
})();
