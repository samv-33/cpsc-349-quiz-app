(function () {
  // Function to display quiz results
  function displayResults() {
    // Get the HTML element where the results will be displayed
    const resultsElement = document.getElementById("historyContainer");
    // Retrieve quiz results from localStorage or initialize an empty array if no results exist
    const storedResults = JSON.parse(localStorage.getItem("allQuizResults")) || [];

    //Log stored results to console for debugging
    console.log("Stored results:", storedResults);

    // Loop through each quiz result and create a card to display it
    storedResults.forEach((result, index) => {
      const card = document.createElement("div");
      card.className = "card";
      const cardBody = document.createElement("div");
      cardBody.className = "card-body";

      const quizTitle = document.createElement("h4");
      quizTitle.className = "card-title";

      // Check if the timestamp is valid
      const completedDate = result.timestamp ? new Date(result.timestamp).toLocaleString() : "N/A";

      // Set the text content of the quiz title
      quizTitle.textContent = `Quiz Name: ${result.quiz} - Score: ${result.score}/${result.totalQuestions} - Completed: ${completedDate}`;
      cardBody.appendChild(quizTitle);

      // Create a list to display each question and its selected and correct options
      const listGroup = document.createElement("ul");
      listGroup.className = "list-group list-group-flush";
      result.questionsAndAnswers.forEach((qa) => {
        const listItem = document.createElement("li");
        listItem.className = "list-group-item";
        listItem.innerHTML = `${qa.question} <br> Selected option: <strong>${
          qa.selectedOption ? qa.selectedOption : "N/A"
        }</strong>, Correct option: <strong>${qa.correctOption}</strong>`;

        // Add a class to the list item based on whether the answer is correct or incorrect
        if (qa.correct) {
          listItem.classList.add("correct-answer");
        } else {
          listItem.classList.add("incorrect-answer");
        }
        listGroup.appendChild(listItem);
      });

      card.appendChild(cardBody);
      card.appendChild(listGroup);
      resultsElement.appendChild(card);
    });
  }

   // Function to clear quiz history from localStorage and reload the page
  function clearHistory() {
    localStorage.removeItem("allQuizResults");
    location.reload();
  }

  // Function to initialize the page by adding event listener to clear history button and displaying quiz results
  function main() {
    const clearHistoryButton = document.getElementById("clearHistory");
    clearHistoryButton.addEventListener("click", function () {
      clearHistory();
    });
    displayResults();
  }

  main();
})();
