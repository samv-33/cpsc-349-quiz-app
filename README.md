# cpsc-349-quiz-app

## Description

This is a quiz app that we created for our CPSC 349 class. It is a simple quiz app, users select from 4 quiz options. The quiz is timed and the user is given a score at the end of the quiz. The user can also view the correct answers to the quiz. The app tracks your previous quiz attempts in local storage and allows you to view them in the quiz history page. The app is built using HTML, CSS, and JavaScript. We used the Bootstrap framework to style the app. We also used the browser-sync package to run the app locally on our computers.

## Installation

To run this app, you will need to have Node.js installed on your computer. You can download it [here](https://nodejs.org/en/). Once you have Node.js installed, you can run the following commands in a terminal to install the necessary dependencies:

```bash
npm install -g browser-sync

browser-sync start --server --browser "firefox" --files "css/*.css, *.html"
```

## Navigation

To navigate the app, you can click on the buttons on the home page to start the quiz or view the quiz history. Once you start the quiz, you can select from the 4 options and a countdown timer will run. Once you completed a quiz it will redirect you to a quiz-complete page where you can see the results of the quiz you just completed. You can view your previous quiz attempts in the quiz history page and see the correct answers there. You can also clear the history, navigate back to the home page, and try out another quiz topic. 

## Authors

Nadeem Maida,
Samuel Vo,
Karson Lant
