/* header, footer*/
const headerFooterComponent = () => {
  const headerId = document.querySelector("#header");
  const footerId = document.querySelector("#footer");

  if (headerId) {
    const header = fetch("header.html");
    header
      .then((res) => res.text())
      .then((text) => {
        document.querySelector("#header").innerHTML = text;
      });
  }
  if (footerId) {
    const footer = fetch("footer.html");
    footer
      .then((res) => res.text())
      .then((text) => {
        document.querySelector("#footer").innerHTML = text;
        let style = document.createElement("link");
        style.href = "headerFooter.css";
        style.rel = "stylesheet";
        document.head.appendChild(style);
      });
  }
};
headerFooterComponent();

/*header nav바 페이지 이동 */
$(document).ready(function ($) {
  $(".scroll_move").click(function (event) {
    event.preventDefault();
    $("html,body").animate({ scrollTop: $(this.hash).offset().top }, 500);
  });
});
