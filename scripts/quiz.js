(function () {
  let userScore = 0;
  let totalQuestions = 0;
  let quizResults = [];
  let currentQuestionIndex = 0;
  let quizData;

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

  function startTimer(duration, display) {
    let timer = duration;
    setInterval(function () {
      display.textContent = timer;
      if (--timer < 0) {
        timer = 0;
      }
    }, 1000); // Update every second
  }

  function displayQuestion() {
    if (!quizData || quizData.length <= currentQuestionIndex) {
      console.log("No more questions or quiz data not loaded.");
      return;
    }

    const questionText = document.getElementById("questionText");
    const options = document.getElementById("options");
    const quizTitle = document.getElementById("quizTitle");
    const imageContainer = document.getElementById("imageContainer");

    imageContainer.innerHTML = "";

    if (quizData[currentQuestionIndex].image) {
      const image = document.createElement("img");
      image.src = quizData[currentQuestionIndex].image;
      imageContainer.appendChild(image);
    }

    // Update quiz title and question
    quizTitle.textContent = `Quiz ${getQueryParam("quiz")}`;
    questionText.textContent = quizData[currentQuestionIndex].question;
    options.innerHTML = "";

    // Display options
    quizData[currentQuestionIndex].options.forEach((option) => {
      const button = document.createElement("button");
      button.setAttribute("type", "button");
      button.classList.add("btn", "btn-primary", "m-2", "quiz-button");
      button.textContent = option;
      button.onclick = function () {
        selectOption(option);
      };
      options.appendChild(button);
    });

    const timerDisplay = document.querySelector(".timeSeconds");
    const duration = 15; // 15 seconds for each question

    startTimer(duration, timerDisplay);
  }

  function redirectToQuizComplete() {
    let allQuizResults = localStorage.getItem("allQuizResults");
    allQuizResults = allQuizResults ? JSON.parse(allQuizResults) : [];
    allQuizResults.push({
      quiz: getQueryParam("quiz"),
      questionsAndAnswers: quizResults,
      score: userScore,
      totalQuestions: totalQuestions,
    });

    // Save quiz results, user score, and total questions to local storage
    localStorage.setItem("allQuizResults", JSON.stringify(allQuizResults));
    localStorage.setItem("recentQuizResults", JSON.stringify(quizResults));
    localStorage.setItem("recentUserScore", userScore);
    localStorage.setItem("recentTotalQuestions", totalQuestions);

    window.location.href = `quiz-complete.html`;
  }

  function moveToNextQuestion(question, option, correct) {
    quizResults.push({
      question: question.question,
      selectedOption: option,
      correctOption: question.answer,
      correct: correct,
    });

    if (currentQuestionIndex < quizData.length - 1) {
      currentQuestionIndex++;
      displayQuestion();
    } else {
      console.log("Quiz finished");

      redirectToQuizComplete();
    }
  }

  let optionSelected = false; // Flag to track if an option has been selected

  function selectOption(option) {
    const question = quizData[currentQuestionIndex];
    let correct = false;

    // Check if the selected option is correct
    if (option === question.answer) {
      console.log("Correct!");
      userScore++;
      correct = true;
    } else {
      console.log("Wrong!");
    }

    // Highlight the selected option
    const options = document.getElementById("options");
    const buttons = options.getElementsByTagName("button");
    for (let button of buttons) {
      if (button.textContent === option) {
        button.style.backgroundColor = correct ? "green" : "red";
      } else {
        button.disabled = true; // Disable other options after selecting one
      }
    }

    // Set optionSelected flag to true
    optionSelected = true;
  }

  function addSkipButtonHandler() {
    const skipButton = document.getElementById("skipButton");
    skipButton.addEventListener("click", function () {
      const question = quizData[currentQuestionIndex];

      moveToNextQuestion(question, null, false);
    });
  }
  function addNextButtonHandler() {
    const nextButton = document.getElementById("nextButton");
    nextButton.addEventListener("click", function () {
      if (optionSelected) {
        // Move to next question only if an option has been selected
        const question = quizData[currentQuestionIndex];
        moveToNextQuestion(question, null, false);
        optionSelected = false; // Reset optionSelected flag
      }
    });
  }

  function main() {
    addReviewButtonHandler();
    addSkipButtonHandler();
    addNextButtonHandler();

    const quizName = getQueryParam("quiz");
    if (quizName) {
      loadQuizData(quizName).then((data) => {
        quizData = data.questions;
        totalQuestions = quizData.length; // Set total number of questions
        displayQuestion(); // Display the first question
      });
    }
  }
  main();
})();
