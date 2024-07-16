  // Firebase SDK 라이브러리 가져오기
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
  import {
    getFirestore,
    doc,
    getDocs,
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    deleteField,
    query,
    orderBy,
    limit,
  } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

  // Firebase 구성 정보 설정
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyD0oERzI0jnFGWaAR8NaYPkGqGYft-NOfs",
    authDomain: "sparta-test-71931.firebaseapp.com",
    projectId: "sparta-test-71931",
    storageBucket: "sparta-test-71931.appspot.com",
    messagingSenderId: "557999158224",
    appId: "1:557999158224:web:799f97b40ab8e897293fd5",
    measurementId: "G-1QGVSEZ52D",
  };

  // Firebase 인스턴스 초기화
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // 페이지 로딩 후 db 가져옴
  $(window).load(async () => {
    loadGuestBook();
  });

  // 날짜 저장 yyyy.mm.dd HH:mm:ss
  function getDate() {
    const currentDate = new Date();
    return `${currentDate.getFullYear()}.${(
      "0" +
      (currentDate.getMonth() + 1)
    ).slice(-2)}.${("0" + currentDate.getDate()).slice(-2)} ${(
      "0" + currentDate.getHours()
    ).slice(-2)}:${("0" + currentDate.getMinutes()).slice(-2)}:${(
      "0" + currentDate.getSeconds()
    ).slice(-2)}`;
  }

  // 날짜 불러오기 yyyy.mm.dd
  function formatDate(date) {
    const datetime = new Date(date);

    const year = datetime.getFullYear();
    const month = ("0" + (datetime.getMonth() + 1)).slice(-2); // 월은 0부터 시작하므로 +1 해줘야 함
    const day = ("0" + datetime.getDate()).slice(-2);

    return `${year}.${month}.${day}`;
  }

  // 방명록 저장
  $("#addEntry").click(async function () {
    let guest_name = $("#guest-name").val();
    let pw = $("#pw").val();
    let guest_message = $("#guest-message").val();
    let date = getDate();

    console.log(guest_name);

    // await addDoc(collection(db, "guest_book"),doc);
    await addDoc(collection(db, "guest_book"), {
      guest_name: guest_name,
      pw: "",
      guest_message: guest_message,
      date: date,
    });

    inputClear();
    cardClear();
    loadGuestBook();
  });

  // input 비우기
  function inputClear() {
    $("#guest-name").val("");
    $("#pw").val("");
    $("#guest-message").val("");
  }

  // 방명록 비우기
  function cardClear() {
    $("#guestbook-entries").empty();
  }

  // db 불러오기
  async function loadGuestBook() {
    let docs = await getDocs(
      query(collection(db, "guest_book"), orderBy("date", "desc"))
    );

    docs.forEach((doc) => {
      let id = doc.id;
      let row = doc.data();
      let guest_name = row.guest_name;
      let guest_message = row.guest_message;
      let date = formatDate(row.date);

      console.log(id);

          console.log(id)

          let card = $(`
              <div class="guest-book">
                  <div class="guest-name">
                      <p>이름</p>
                      <p>${guest_name}</p>
                  </div>
                  <div class="guest-message">
                      <p>내용</p>
                      <p>${guest_message}</p> 
                  </div>
                  <div class="date">
                      <p>${date}</p>
                  </div>
                  <button class="deleteBtn" id=${id}>삭제</button>
              </div>`);
      $("#guestbook-entries").append(card);
    });
  }

  // db 삭제
  $(document).on("click", ".deleteBtn", async function () {
    // 클릭된 버튼의 id 값
    const id = $(this).attr("id");
    console.log("버튼 " + id + " 가 클릭되었습니다.");

    await deleteDoc(doc(db, "guest_book", id));

    cardClear();
    loadGuestBook();
  });