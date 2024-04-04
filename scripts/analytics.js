document.addEventListener('DOMContentLoaded', function() {
    // Function to get query parameters
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    const user = getQueryParam('user');
    const quizNumber = getQueryParam('quiz');

    // Assuming you store user results in a structured way in localStorage
    // e.g., localStorage.setItem('userResults', JSON.stringify({ userId: { quizNumber: { score: 8, totalQuestions: 10 } } }))
    function displayResults() {
        const resultsElement = document.getElementById('analyticsContainer');
        const storedResults = JSON.parse(localStorage.getItem('userResults')) || {};
        const userResults = storedResults[user] || {};
        const quizResults = userResults[quizNumber];

        if(quizResults) {
            const resultDiv = document.createElement('div');
            resultDiv.textContent = `Quiz ${quizNumber} - Score: ${quizResults.score}/${quizResults.totalQuestions}`;
            resultsElement.appendChild(resultDiv);
        } else {
            resultsElement.textContent = "No results found for this quiz.";
        }
    }

    displayResults();
});