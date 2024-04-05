(function () {
  function displayResults() {
    const resultsElement = document.getElementById("historyContainer");
    const storedResults = JSON.parse(localStorage.getItem("allQuizResults")) || [];

    console.log("Stored results:", storedResults);

    storedResults.forEach((result, index) => {
      const card = document.createElement("div");
      card.className = "card";
      const cardBody = document.createElement("div");
      cardBody.className = "card-body";

      const quizTitle = document.createElement("h4");
      quizTitle.className = "card-title";
      quizTitle.textContent = `Quiz Name: ${result.quiz} - Score: ${result.score}/${
        result.totalQuestions
      } - Completed: ${new Date(result.timestamp).toLocaleString()}`;
      cardBody.appendChild(quizTitle);

      const listGroup = document.createElement("ul");
      listGroup.className = "list-group list-group-flush";
      result.questionsAndAnswers.forEach((qa) => {
        const listItem = document.createElement("li");
        listItem.className = "list-group-item";
        listItem.innerHTML = `${qa.question} <br> Selected option: <strong>${qa.selectedOption}</strong>, Correct option: <strong>${qa.correctOption}</strong>`;

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

  displayResults();
})();
