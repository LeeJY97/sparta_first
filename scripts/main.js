document.addEventListener("DOMContentLoaded", () => {
    /* 갤러리 슬라이드 */
    const galleryWrapper = document.querySelector(".gallery-wrapper"); //갤러리 랩퍼
    const galleryItem = document.querySelectorAll(".gallery-item"); //갤러리 아이템
    let slider = document.querySelector(".gallery-container");
    let startX; //마우스 드래그 시작점 x좌표 체크
    let endX; //마우스 드래그시 x좌표 체크
    const paginationContainer = document.querySelector(".gallery-pagination"); //페이지네이션 부모
    const nextBtn = document.querySelector(".next-btn"); //다음 버튼
    const prevBtn = document.querySelector(".prev-btn"); //이전 버튼

    // 슬라이드 이름 배열
    const slideNameBox = document.querySelector(".slideName");
    const slideNames = ["For. JUNG SO HYUN", "For. LIM BO RA", "For. CHOI JI MIN", "For. LEE JOON YEOL", "For. JUNG MIN JI", "For. LEE JUN"];

    // 페이지네이션 엑션
    const handleButtonClick = (i) => {
      document.querySelectorAll(".gallery-btn").forEach((button) => {
        button.classList.remove("active");
      });
      document.querySelectorAll(".gallery-btn")[i].classList.add("active");
      galleryWrapper.style.transition = "transform 2s";
      galleryWrapper.style.transform = `translateX(-${i * (100 / 6)}%)`;

      //이름 처음 디폴트 지정
      slideNameBox.textContent = slideNames[i];
    };

    // 페이지네이션 버튼 생성 후 엑션
    for (let i = 0; i < galleryItem.length; i++) {
      const btn = document.createElement("span");
      btn.className = "gallery-btn";
      if (i === 0) {
        btn.classList.add("active");
      }

      btn.addEventListener("click", () => handleButtonClick(i));
      paginationContainer.appendChild(btn);
      slideNameBox.textContent = slideNames[0];
    }

    // 다음 엑션
    function nextMove(){
      const activeIndex = [...document.querySelectorAll(".gallery-btn"),].findIndex((button) => button.classList.contains("active"));
      const nextIndex = (activeIndex + 1) % galleryItem.length;
      handleButtonClick(nextIndex);
      prevBtn.classList.remove("hightOn");
      nextBtn.classList.add("hightOn");
    }
      nextBtn.addEventListener("click", () => {
        nextMove()
      });

    // 이전 엑션
    function prevMove(){
      const activeIndex = [...document.querySelectorAll(".gallery-btn"),].findIndex((button) => button.classList.contains("active"));
      const prevIndex =
        (activeIndex - 1 + galleryItem.length) % galleryItem.length;
      handleButtonClick(prevIndex);
      nextBtn.classList.remove("hightOn");
      prevBtn.classList.add("hightOn");
    }
      prevBtn.addEventListener("click", () => {
        prevMove()
      });

    /* 갤러리 이미지 호버시 크기조정 */
    const galleryImgs = document.querySelectorAll(".gallery-item ul li img");
    galleryImgs.forEach((img) => {
      img.addEventListener("mouseover", () => {
        img.classList.add("on");
      });
      img.addEventListener("mouseout", () => {
        img.classList.remove("on");
      });
    });


    /*갤러리 드래그*/ 
    slider.addEventListener("mousedown", (e) => {
      console.log("mousedown", e.pageX);
      startX = e.pageX; // 마우스 드래그 시작 위치 저장
      // galleryItem.classList.add("grab");
    });

    slider.addEventListener("mouseup", (e) => {
      console.log("mouseup", e.pageX);
      endX = e.pageX; // 마우스 드래그 끝 위치 저장
      if (startX < endX) {
        // 마우스가 오른쪽으로 드래그 된 경우
        console.log("prev move");
        prevMove();
      } else if (startX > endX) {
        // 마우스가 왼쪽으로 드래그 된 경우
        console.log("next move");
        nextMove();
      }
    });



  });