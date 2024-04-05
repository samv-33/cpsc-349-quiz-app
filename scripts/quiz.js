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
  async function loadQuizData(quizName) {
    try {
      const response = await fetch(`quizzes/${quizName}.json`);
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
      button.setAttribute("type", "button");
      button.classList.add("btn", "btn-primary", "m-2");
      button.style.padding = "3rem 10rem"; // Set padding directly
      button.style.fontSize = "1.5rem"; // Set font size directly
      button.textContent = option;
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
      question: question.question,
      selectedOption: option,
      correctOption: question.answer,
      correct: option === question.answer,
    });

    console.log("Quiz results:", quizResults); // Log the quiz results

    if (currentQuestionIndex < quizData.length - 1) {
      currentQuestionIndex++;
      displayQuestion();
    } else {
      console.log("Quiz finished");
      let allQuizResults = localStorage.getItem("allQuizResults");
      allQuizResults = allQuizResults ? JSON.parse(allQuizResults) : [];
      allQuizResults.push({
        quiz: getQueryParam("quiz"),
        questionsAndAnswers: quizResults,
        score: userScore,
        totalQuestions: totalQuestions,
        timestamp: new Date().toISOString(),
      });

      // Save quiz results, user score, and total questions to local storage
      localStorage.setItem("recentQuizResults", JSON.stringify(quizResults));
      localStorage.setItem("allQuizResults", JSON.stringify(allQuizResults));
      localStorage.setItem("recentUserScore", userScore);
      localStorage.setItem("recentTotalQuestions", totalQuestions);
      // Redirect to quiz-complete.html with score and total questions as query parameters
      window.location.href = `quiz-complete.html`;
    }
  }

  document.getElementById("skipButton").addEventListener("click", function () {
    if (currentQuestionIndex < quizData.length - 1) {
      currentQuestionIndex++;
      displayQuestion();
    } else {
      console.log("Quiz finished");
      // Save quiz results, user score, and total questions to local storage
      localStorage.setItem("quizResults", JSON.stringify(quizResults));
      localStorage.setItem("userScore", userScore);
      localStorage.setItem("totalQuestions", totalQuestions);
      window.location.href = "quiz-complete.html";
    }
  });

  const quizName = getQueryParam("quiz");
  if (quizName) {
    loadQuizData(quizName).then((data) => {
      quizData = data.questions;
      totalQuestions = quizData.length; // Set total number of questions
      displayQuestion(); // Display the first question
    });
  }
})();
