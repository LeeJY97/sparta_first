/* header, footer*/
const headerFooterComponent = () => {
  const headerId = document.querySelector("#header");
  const footerId = document.querySelector("#footer");

  if (headerId) {
    const header = fetch("/header.html");
    header
      .then((res) => res.text())
      .then((text) => {
        document.querySelector("#header").innerHTML = text;
      });
  }
  if (footerId) {
    const footer = fetch("/footer.html");
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
/* header, footer*/
