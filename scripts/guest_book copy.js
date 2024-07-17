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

// 방명록 삭제시 id값
var fieldId;
var pw;

// 부모 방명록 id값
var parentId = null; 

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
    let isRoot = parentId == null

    var obj = {
        name: name,
        guest_name : guest_name,
        guest_pw : guest_pw,
        guest_message : guest_message,
        date : date,
        isRoot : isRoot,
        parentId: parentId
    }

    if(validInputs("guest-name", "guest-message", "guest-pw")){
        saveDoc(obj);
    }
    
});


async function saveDoc(obj){
    // if (validInputs()) {
        await addDoc(collection(db, "guest_book"), obj);

        inputClear();
        cardClear();
        loadGuestBook();
        parentId = null;
    // }
}

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
            <div class="show-container" id="container-${id}">
                <div class="show-name-container">
                    <span class="show-name">${guest_name}</span>
                    <span class="show-guest-massage">${guest_message}</span> 
                    <span class="show-date">${date}</span>
                </div>
                <div class="show-button-container">
                    <button class="deleteBtn" data-bs-toggle="modal" id=${id} data-bs-target="#passwordModal">삭제</button>
                    <button class="replyBtn" id="${id}">답글</button>
                </div>
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
    } else {
        closeModal();
        window.alert('틀림')
    }
})


$(document).on("click", "#addReply", async function () {
    console.log(parentId);

    let guest_name = $("#reply-guest-name").val();
    let guest_pw = $("#reply-guest-pw").val();
    let guest_message = $("#reply-guest-message").val();
    let date = getDate();
    let isRoot = parentId == null


    var obj = {
        name: name,
        guest_name : guest_name,
        guest_pw : guest_pw,
        guest_message : guest_message,
        date : date,
        isRoot : isRoot,
        parentId: parentId
    }

    if(validInputs("reply-guest-name", "reply-guest-message", "reply-guest-pw")){
        saveDoc(obj);
    }
    
})



// 답글 버튼
$(document).on("click", ".replyBtn", async function () {
    removeReplyInput()
    parentId = $(this).attr("id");

    const parentDiv = document.getElementById('container-'+parentId);

    let replyInput = $(`
        <div class="reply-input-container">
            <hr>
            <div class="reply-input-name-pw-container">
                <p class="reply-icon">⤷</p>
                <input type="text" class="reply-input-name" id="reply-guest-name" placeholder="이름" />
                <input type="password" class="reply-input-pw" id="reply-guest-pw" placeholder="비밀번호" maxlength="4" />
            </div>
            <div class="reply-input-message-container">
                <textarea type="text" class="reply-input-message" id="reply-guest-message" placeholder="내용을 입력하세요"></textarea>
            </div>
            <div class="reply-input-submit-container">
                <button id="addReply">등록</button>
                <button id="removeReply">취소</button>
            </div>
            <hr>
        </div>
    `)

    parentDiv.insertAdjacentElement('afterend', replyInput[0]);

});

// 답글 > 등록 버튼 (오타인가)
// $(document).on("click", "#removeReply", async function () {
//     removeReplyInput()
// })


// 답글 > 취소 버튼
$(document).on("click", "#removeReply", async function () {
    removeReplyInput()
})

// 답글 영역 지우기
function removeReplyInput(){
    $('.reply-input-container').remove();
    parentId = null;
}


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
function validInputs(guestName, guestMessage, guestPw) {

    const nameInput = document.getElementById(guestName).value.trim();
    const messageInput = document.getElementById(guestMessage).value.trim();
    const passwordInput = document.getElementById(guestPw).value.trim();

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


