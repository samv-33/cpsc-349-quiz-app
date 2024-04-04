document.addEventListener("DOMContentLoaded", function () {
  // Function to get query parameters
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  // Function to display quiz results
  function displayResults() {
    const resultsElement = document.getElementById("analyticsContainer");
    const storedResults = JSON.parse(localStorage.getItem("quizResults")) || [];
    const storedScore = JSON.parse(localStorage.getItem("userScore")) || [];
    const storedTotalQuestions =
      JSON.parse(localStorage.getItem("totalQuestions")) || [];

    console.log("Stored Quiz Results:", storedResults);
    console.log("Score Quiz Results:", storedScore);
    console.log("Total Quiz Results:", storedTotalQuestions);
  }
  displayResults();
});
