(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const score = urlParams.get("score");
  const total = urlParams.get("total");

  document.getElementById("score").textContent = score;
  document.getElementById("total").textContent = total;
})();
