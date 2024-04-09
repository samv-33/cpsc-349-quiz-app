(function () {
  let userScore = 0;
  let totalQuestions = 0;
  let quizResults = [];
  let currentQuestionIndex = 0;
  let quizData;
  let selectedOption; // Variable to store the selected option
  let intervalId; //Variable to set the time interval

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

  //Function for a timer to countdown, skips if the user don't answer before time is up
  function questionTimer(display) {
    let timeLeft = 15;
    intervalId = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(intervalId);
        let currentQuestion = quizData[currentQuestionIndex];
        moveToNextQuestion(currentQuestion, null, false);
      } else {
        display.textContent = timeLeft;
        timeLeft--;
      }
    }, 1000);
  }
  
  //Short countdown to allow users to press the next question
  function questionAnsweredTimer(display) {
    let timeLeft = 3;
    intervalId = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(intervalId);
        let currentQuestion = quizData[currentQuestionIndex];
        moveToNextQuestion(
          currentQuestion,
          selectedOption,
          currentQuestion.answer === selectedOption
        );
      } else {
        display.textContent = timeLeft;
        timeLeft--;
      }
    }, 1000);
  }

  function stopTimer() {
    clearInterval(intervalId);
  }

  function addNextButtonHandler() {
    const nextButton = document.getElementById("nextButton");
    nextButton.addEventListener("click", function () {
      if (selectedOption) {
        // Use selectedOption here instead of optionSelected
        // Move to next question only if an option has been selected
        const question = quizData[currentQuestionIndex];
        const correctAnswer = question.answer;
        const correct = selectedOption === correctAnswer;
        moveToNextQuestion(question, selectedOption, correct);
        selectedOption = null; // Reset selectedOption
      }
    });
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
    quizTitle.textContent = `Quiz Topic: ${getQueryParam("quiz")}`;
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

    questionTimer(timerDisplay);
  }

  function redirectToQuizComplete() {
    let allQuizResults = localStorage.getItem("allQuizResults");
    allQuizResults = allQuizResults ? JSON.parse(allQuizResults) : [];

    const completionTimestamp = new Date().getTime();

    allQuizResults.push({
      quiz: getQueryParam("quiz"),
      questionsAndAnswers: quizResults,
      score: userScore,
      totalQuestions: totalQuestions,
      timestamp: completionTimestamp, // Store the completion timestamp
    });

    // Save quiz results, user score, and total questions to local storage
    localStorage.setItem("allQuizResults", JSON.stringify(allQuizResults));
    localStorage.setItem("recentQuizResults", JSON.stringify(quizResults));
    localStorage.setItem("recentUserScore", userScore);
    localStorage.setItem("recentTotalQuestions", totalQuestions);

    window.location.href = `quiz-complete.html`;
  }

  function moveToNextQuestion(question, option, correct) {
    // Check if an option was selected
    const optionSelected = option !== null;

    console.log(option);
    console.log(correct);

    // Record the selected option in quiz results
    if (optionSelected) {
      quizResults.push({
        question: question.question,
        selectedOption: option,
        correctOption: question.answer,
        correct: correct || false,
      });
    } else {
      // If no option was selected, mark the question as not answered
      quizResults.push({
        question: question.question,
        selectedOption: null,
        correctOption: question.answer,
        correct: false,
      });
    }

    const skipButton = document.getElementById("skipButton");
    const nextButton = document.getElementById("nextButton");

    // Hide next button
    nextButton.style.display = "none";
    // Display skip button and change text back to "skip"
    skipButton.style.display = "block";
    skipButton.textContent = "skip";

    stopTimer();
    if (currentQuestionIndex < quizData.length - 1) {
      currentQuestionIndex++;
      displayQuestion();
    } else {
      console.log("Quiz finished");

      redirectToQuizComplete();
    }
  }

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

    // If the selected option is wrong, highlight the correct answer in green
    if (!correct) {
      for (let button of buttons) {
        if (button.textContent === question.answer) {
          button.style.backgroundColor = "green";
          break; // Break out of the loop once the correct answer is found
        }
      }
    }

    // Set selectedOption variable to the selected option
    selectedOption = option;

    const skipButton = document.getElementById("skipButton");
    const nextButton = document.getElementById("nextButton");

    //Hide skip button
    skipButton.style.display = "none";
    //Display Next button
    nextButton.style.display = "block";
    nextButton.textContent = "Next";

    stopTimer();
    const timerDisplay = document.querySelector(".timeSeconds");
    questionAnsweredTimer(timerDisplay);
  }

  function addSkipButtonHandler() {
    const skipButton = document.getElementById("skipButton");
    skipButton.addEventListener("click", function () {
      const question = quizData[currentQuestionIndex];
      stopTimer();
      moveToNextQuestion(question, null, false);
    });
  }

  function main() {
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
