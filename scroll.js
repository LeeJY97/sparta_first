window.addEventListener("DOMContentLoaded", function () {
  // 스크롤 이벤트 처리
  window.addEventListener("scroll", function (event) {
    if (document.querySelector(".progressbar") != null) setProgress();
  });
});

function setProgress() {
  let currY = document.documentElement.scrollTop; // 스크롤한 높이
  let totalY =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight; // 전체 높이
  let percentage = (currY / totalY) * 100; // 퍼센트 값
  document.querySelector(".progress").style.width = percentage + "%"; // 프로그래스바 너비 변경
}
