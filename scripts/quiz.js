(function () {
  let userScore = 0;
  let quizResults = [];
  let totalQuestions = 0; // Variable to store total number of questions

  // Function to get query parameter for quiz number
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  // Function to load quiz data
  async function loadQuizData(quizNumber) {
    try {
      const response = await fetch(`quizzes/quiz${quizNumber}.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Could not load quiz data:", error);
    }
  }

  let currentQuestionIndex = 0;
  let quizData;

  async function displayQuestion() {
    if (!quizData || quizData.length <= currentQuestionIndex) {
      console.log("No more questions or quiz data not loaded.");
      return;
    }

    const questionText = document.getElementById("questionText");
    const options = document.getElementById("options");
    const quizTitle = document.getElementById("quizTitle");

    // Update quiz title and question
    quizTitle.textContent = `Quiz ${getQueryParam("quiz")}`;
    questionText.textContent = quizData[currentQuestionIndex].question;
    options.innerHTML = "";

    // Display options
    quizData[currentQuestionIndex].options.forEach((option) => {
      const button = document.createElement("button");
      button.textContent = option;
      button.classList.add("btn", "btn-info", "m-2");
      button.onclick = function () {
        selectOption(option);
      };
      options.appendChild(button);
    });
  }

  function selectOption(option) {
    const question = quizData[currentQuestionIndex];
    if (option === question.answer) {
      console.log("Correct!");
      userScore++; // Increment score if the answer is correct
    } else {
      console.log("Wrong!");
    }

    quizResults.push({
      quizNumber: getQueryParam("quiz"), // Store quiz number
      question: question.question,
      selectedOption: option,
      correctOption: question.answer,
    });

    console.log("Quiz results:", quizResults); // Log the quiz results

    if (currentQuestionIndex < quizData.length - 1) {
      currentQuestionIndex++;
      displayQuestion();
    } else {
      console.log("Quiz finished");
      // Save quiz results, user score, and total questions to local storage
      localStorage.setItem("quizResults", JSON.stringify(quizResults));
      localStorage.setItem("userScore", userScore);
      localStorage.setItem("totalQuestions", totalQuestions);
      // Redirect to quiz-complete.html with score and total questions as query parameters
      window.location.href = `quiz-complete.html?score=${userScore}&total=${totalQuestions}`;
    }
  }

  document.getElementById("nextButton").addEventListener("click", function () {
    if (currentQuestionIndex < quizData.length - 1) {
      currentQuestionIndex++;
      displayQuestion();
    } else {
      console.log("Quiz finished");
      // Save quiz results, user score, and total questions to local storage
      localStorage.setItem("quizResults", JSON.stringify(quizResults));
      localStorage.setItem("userScore", userScore);
      localStorage.setItem("totalQuestions", totalQuestions);
      window.location.href = `analytics.html?user=${getQueryParam(
        "user"
      )}&quiz=${getQueryParam("quiz")}`;
    }
  });

  const quizNumber = getQueryParam("quiz");
  if (quizNumber) {
    loadQuizData(quizNumber).then((data) => {
      quizData = data.questions;
      totalQuestions = quizData.length; // Set total number of questions
      displayQuestion(); // Display the first question
    });
  }
})();
