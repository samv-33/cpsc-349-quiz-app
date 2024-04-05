(function () {
  // Retrieve data from local storage
  let userScore = localStorage.getItem("recentUserScore");
  let totalQuestions = localStorage.getItem("recentTotalQuestions");

  // Update HTML elements with the retrieved data
  document.getElementById("score").innerText = userScore;
  document.getElementById("total").innerText = totalQuestions;
})();
