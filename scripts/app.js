(function () {
    document.querySelectorAll('.quiz-btn').forEach(button => {
        button.addEventListener('click', function() {
            const quizName = this.getAttribute('data-quiz');
            // Example of redirecting, can be replaced with your logic
            window.location.href = quizName + '.html';
        });
    });
})();