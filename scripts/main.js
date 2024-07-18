document.addEventListener("DOMContentLoaded", () => {
    /* 갤러리 슬라이드 */
    const galleryWrapper = document.querySelector(".gallery-wrapper"); //갤러리 랩퍼
    const galleryItem = document.querySelectorAll(".gallery-item"); //갤러리 아이템
    let slider = document.querySelector(".gallery-container");
    let isDown = false; //클릭 상태 체크
    let startX; //마우스 드래그 시작점 x좌표 체크
    let scrollLeft; //마우스 드래그시 x좌표 체크
    const paginationContainer = document.querySelector(
      ".gallery-pagination"
    ); //페이지네이션 부모
    const nextBtn = document.querySelector(".next-btn"); //다음 버튼
    const prevBtn = document.querySelector(".prev-btn"); //이전 버튼
    let btn;

    const handleButtonClick = (i) => {
      document.querySelectorAll(".gallery-btn").forEach((button) => {
        button.classList.remove("active");
      });
      document.querySelectorAll(".gallery-btn")[i].classList.add("active");
      galleryWrapper.style.transition = "transform 2s";
      galleryWrapper.style.transform = `translateX(-${i * (100 / 6)}%)`;
    };

    for (let i = 0; i < galleryItem.length; i++) {
      const btn = document.createElement("span");
      btn.className = "gallery-btn";
      if (i === 0) {
        btn.classList.add("active");
      }

      btn.addEventListener("click", () => handleButtonClick(i));
      paginationContainer.appendChild(btn);
    }

      nextBtn.addEventListener("click", () => {
        const activeIndex = [
          ...document.querySelectorAll(".gallery-btn"),
        ].findIndex((button) => button.classList.contains("active"));
        const nextIndex = (activeIndex + 1) % galleryItem.length;
        handleButtonClick(nextIndex);
        prevBtn.classList.remove("hightOn");
        nextBtn.classList.add("hightOn");
      });

      prevBtn.addEventListener("click", () => {
        const activeIndex = [
          ...document.querySelectorAll(".gallery-btn"),
        ].findIndex((button) => button.classList.contains("active"));
        const prevIndex =
          (activeIndex - 1 + galleryItem.length) % galleryItem.length;
        handleButtonClick(prevIndex);
        nextBtn.classList.remove("hightOn");
        prevBtn.classList.add("hightOn");
      });

    /* 갤러리 이미지 호버시 크기조정 */
    const galleryImgs = document.querySelectorAll(
      ".gallery-item ul li img"
    );
    galleryImgs.forEach((img) => {
      img.addEventListener("mouseover", () => {
        img.classList.add("on");
      });
      img.addEventListener("mouseout", () => {
        img.classList.remove("on");
      });
    });






  });