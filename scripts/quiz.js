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

  function startTimer(duration, display) {
    //display.timerInterval
    clearInterval(window.timerInterval); //clears any existing timer
    let timer = duration;
    //const display.timerInterval was before
    window.timerInterval = setInterval(function () {
      display.textContent = timer;
      if (--timer < 0) {
        clearInterval(window.timerInterval); // Stop the timer
        timer = 0; // Ensure the timer display shows 0

        // Highlight all options in red
        const options = document.getElementById("options");
        const buttons = options.getElementsByTagName("button");

        for (let button of buttons) {
          // button.style.backgroundColor = "red";
          //I think we just need to disable it
          button.disabled = true; // Disable all options
        }

        //shows answer if nothing is selected when timer is out
        const correctAnswer = quizData[currentQuestionIndex].answer;
        for (let button of buttons) {
          if (button.textContent === correctAnswer) {
            button.style.backgroundColor = "green";
            break; // Exit loop after finding correct answer
          }
        }

        //Hide skip button
        skipButton.style.display = "none";
        //Display Next button
        nextButton.style.display = "block";
        nextButton.textContent = "Next";
        //set flag for options to true, so it can move to next question
        if (!optionSelected) {
          optionSelected = true;
          addNextButtonHandler();
        }
      }
    }, 1000); // Update every second
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
    const duration = 15; // 15 seconds for each question

    startTimer(duration, timerDisplay);
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
    // Mark the question as incorrect if not already marked as correct
    if (!correct) {
      quizResults.push({
        question: question.question,
        selectedOption: option,
        correctOption: question.answer,
        correct: correct,
      });
    }

    /*// Highlight all options in red
    const options = document.getElementById("options");
    const buttons = options.getElementsByTagName("button");
    for (let button of buttons) {
      button.style.backgroundColor = "red";
      button.disabled = true; // Disable all options
    }

    */ //addNextButtonHandler();
    const skipButton = document.getElementById("skipButton");
    const nextButton = document.getElementById("nextButton");

    // Hide next button
    nextButton.style.display = "none";
    // Display skip button and change text back to "skip"
    skipButton.style.display = "block";
    skipButton.textContent = "skip";

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

    // If the selected option is wrong, highlight the correct answer in green
    if (!correct) {
      for (let button of buttons) {
        if (button.textContent === question.answer) {
          button.style.backgroundColor = "green";
          break; // Break out of the loop once the correct answer is found
        }
      }
    }

    // Set optionSelected flag to true
    optionSelected = true;

    const skipButton = document.getElementById("skipButton");
    const nextButton = document.getElementById("nextButton");

    //Hide skip button
    skipButton.style.display = "none";
    //Display Next button
    nextButton.style.display = "block";
    nextButton.textContent = "Next";
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
