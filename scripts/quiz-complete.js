(function () {
  // Retrieve data from local storage
  let userScore = localStorage.getItem("userScore");
  let totalQuestions = localStorage.getItem("totalQuestions");

  // Update HTML elements with the retrieved data
  document.getElementById("score").innerText = userScore;
  document.getElementById("total").innerText = totalQuestions;
})();
