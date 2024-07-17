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
    query,
    orderBy,
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

const name = $('#myName').val();

let fieldId;
let pw;

// 페이지 로딩 후 db 가져옴
$(window).load(async () => {
    loadGuestBook();
});


// 방명록 저장
$("#addEntry").click(async function () {
    let guest_name = $("#guest-name").val();
    let guest_pw = $("#guest-pw").val();
    let guest_message = $("#guest-message").val();
    let date = getDate();


    if (validInputs()) {
        // await addDoc(collection(db, "guest_book"),doc);
        await addDoc(collection(db, "guest_book"), {
            name: name,
            guest_name: guest_name,
            guest_pw: guest_pw,
            guest_message: guest_message,
            date: date,
        });

        inputClear();
        cardClear();
        loadGuestBook();
    }
});

// db 불러오기
async function loadGuestBook() {
    let docs = await getDocs(
        query(collection(db, "guest_book"), orderBy("date", "desc"))
    );

    createGuestBook(docs, name);
}

// 방명록 html 생성
function createGuestBook(docs, name) {
    docs.forEach((doc) => {
        let row = doc.data();

        if (row.name !== name) {
            return;
        }

        let id = doc.id;
        let guest_name = row.guest_name;
        let guest_message = row.guest_message;
        let date = formatDate(row.date);

        let card = $(`
            <hr>
            <div class="show-container">
                <div class="show-name-container">
                    <span class="show-name">${guest_name}</span>
                    <button class="deleteBtn" data-bs-toggle="modal" id=${id} data-bs-target="#passwordModal"id=${id}>삭제</button>
                </div>
                <span class="show-guest-massage">${guest_message}</span> 
                <span class="show-date">${date}</span>
            </div>
            `)
        $("#guestbook-entries").append(card);
    });
    $("#guestbook-entries").append($(`<hr>`))
}


/************ 방명록 삭제 ******************/
$(document).on("click", ".deleteBtn", async function () {
    fieldId = $(this).attr("id");
});

$('#validPassword').click(async function () {
    const inputPw = $('#inputPw').val();
    let docs = await getDocs(collection(db, "guest_book"), doc);

    if (checkPassword(inputPw, docs, fieldId)) {
        await deleteDoc(doc(db, "guest_book", fieldId));
        cardClear();
        loadGuestBook();
        closeModal();
        window.alert('지워짐')
        // $('#passwordModal').modal('hide');
    } else {
        closeModal();
        window.alert('틀림')
    }
})

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

// 비빌번호 유효성 검사 
function checkPassword(inputPw, docs, fieldId) {
    let row;

    docs.forEach((doc) => {

        if (doc.id === fieldId) {
            row = doc.data();
        }
    })

    if (row.guest_pw == inputPw) {
        return true;
    }
    return false;
}


// input 비우기
function inputClear() {
    $("#guest-name").val("");
    $("#guest-pw").val("");
    $("#guest-message").val("");
}

// 방명록 비우기 (데이터 추가, 삭제시 새로운 리스트 추가하기 위함)
function cardClear() {
    $("#guestbook-entries").empty();
}

// 비밀번호 모달 닫기
function closeModal() {
    $('#passwordModal').modal('hide');
    $("#inputPw").val("");
    $("#inputPw").text("");
}

// 입력칸 유효성 체크
function validInputs() {

    const nameInput = document.getElementById('guest-name').value.trim();
    const messageInput = document.getElementById('guest-message').value.trim();
    const passwordInput = document.getElementById('guest-pw').value.trim();

    if (nameInput === '') {
        alert('이름을 입력해주세요.');
        return false;
    }

    if (messageInput === '') {
        alert('메시지를 입력해주세요.');
        return false;
    }

    if (passwordInput === '') {
        alert('비밀번호를 입력해주세요.');
        return false;
    }

    return true;
}


