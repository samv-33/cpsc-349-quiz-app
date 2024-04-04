(function () {
  // Retrieve data from local storage
  var userScore = localStorage.getItem("userScore");
  var totalQuestions = localStorage.getItem("totalQuestions");

  // Update HTML elements with the retrieved data
  document.getElementById("score").innerText = userScore;
  document.getElementById("total").innerText = totalQuestions;
})();
