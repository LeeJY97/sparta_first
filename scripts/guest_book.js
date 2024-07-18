// Firebase SDK 라이브러리 가져오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, set, update, ref } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";
import {
    getFirestore,
    doc,
    getDocs,
    getDoc,
    collection,
    addDoc,
    updateDoc,
    writeBatch,
    where,
    setDoc,
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

// 상세페이지 팀원 이름
const name = $('#myName').val();

var pw;

var fieldId;    // 방명록 삭제시 id값
var parentId;   // 답글달때 필요한 부모 방명록 ID
var isRoot;     // 신규 방명록 판별 (답글 X)


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * 방명록, 답글 저장  * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

// 방명록 저장 클릭 이벤트
$("#addEntry").click(async function () {
    let guest_name = $("#guest-name").val();
    let guest_pw = $("#guest-pw").val();
    let guest_message = $("#guest-message").val();
    let date = getDate();

    isRoot = true;

    var obj = {
        name: name,
        guest_name: guest_name,
        guest_pw: guest_pw,
        guest_message: guest_message,
        date: date,
        isRoot: isRoot,
    }

    if (validInputs("guest-name", "guest-message", "guest-pw")) {
        saveDoc(obj);
    }

});

// 답글 저장 클릭 이벤트
$(document).on("click", "#addReply", async function () {
    let guest_name = $("#reply-guest-name").val();
    let guest_pw = $("#reply-guest-pw").val();
    let guest_message = $("#reply-guest-message").val();
    let date = getDate();

    isRoot = false;

    var obj = {
        name: name,
        guest_name: guest_name,
        guest_pw: guest_pw,
        guest_message: guest_message,
        date: date,
        isRoot: isRoot,
        parentId: parentId
    }

    if (validInputs("reply-guest-name", "reply-guest-message", "reply-guest-pw")) {
        saveDoc(obj);
    }

})

// 방명록, 답글 저장
async function saveDoc(obj) {
    const docRef = await addDoc(collection(db, "guest_book"), obj);

    if (isRoot) {
        updateRootDoc(docRef, obj);
    }

    inputClear();
    cardClear();
    loadGuestBook();
}

// 방명록일경우 본인의 id를 parentId로 업데이트 (parentId = doc.id)
async function updateRootDoc(docRef, obj) {
    obj.parentId = docRef.id;
    await setDoc(docRef, obj)
}



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * 방명록, 답글 읽기  * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

// 페이지 로드되면 db 가져옴
$(window).load(async () => {
    loadGuestBook();
});


// 방명록 db 데이터 가져오기
async function loadGuestBook() {
    let docs = await getDocs(
        query(
            collection(db, "guest_book"),
            orderBy("isRoot", "desc"),
            orderBy("date", "desc")
        )
    );

    createGuestBook(docs, name);
}



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * 방명록, 답글 삭제  * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
var delRow;

// 삭제버튼 클릭 이벤트 (클릭된 방명록의 db id값 가져옴)
$(document).on("click", ".deleteBtn", async function () {
    fieldId = $(this).attr("id");
    mode = "delete"
});


function deleteProcess() {
    if (delRow.isRoot) {
        multiDeleteDocs().then(() => {
            clearAll();
        })
    } else {
        singleDeleteDoc().then(() => {
            clearAll();
        })
    }
}

// 방명록 삭제 -> 하위 답글 전부 삭제
async function multiDeleteDocs() {
    const q = query(collection(db, "guest_book"), where("parentId", "==", delRow.parentId));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        deleteDoc(doc.ref);
    });
}

// 모달 확인 버튼 클릭 이벤트
$('#validPassword').click(async function () {
    const inputPw = $('#inputPw').val();
    let docs = await getDocs(collection(db, "guest_book"), doc);

    if (checkPassword(inputPw, docs, fieldId)) {
        if (mode == "delete") {
            deleteProcess()
        }
        else if (mode == "update") {
            createUpdateForm();
        }
    } else {
        closeModal();
        window.alert('비밀번호가 틀렸습니다.');
    }
})

// 클리어, 다시 로드
function clearAll() {
    cardClear();
    loadGuestBook();
    closeModal();
}



// 답글 삭제 -> 답글 1개만 삭제
async function singleDeleteDoc() {
    await deleteDoc(doc(db, "guest_book", fieldId));
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * 방명록, 답글 수정 * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
let mode;

$(document).on("click", ".updateBtn", async function () {
    mode = "update";
    fieldId = $(this).attr("id");
});


// 답글 폼 생성
async function createUpdateForm() {
    closeModal();

    const tempDiv = document.getElementById('container-' + fieldId);

    const updateGuestName = tempDiv.querySelector('.show-name').textContent;
    const updateGuestMessage = tempDiv.querySelector('.show-guest-message').textContent;


    let updateInput = $(`
        <div class="input-container">
            <div class="input-name-pw-container">
                <input type="text" class="input-name" id="update-guest-name" value="${updateGuestName}"/>
                <div class="input-submit-container">
                    <button id="updateEntry">수정</button>
                    <button id="updateCancle">취소</button>
                  </div>
            </div>
            <div class="input-message-container">
                <textarea type="text" class="input-message" id="update-guest-message">${updateGuestMessage}</textarea>
            </div>
        </div>
    `)

    tempDiv.insertAdjacentElement('afterend', updateInput[0]);
    $(tempDiv).hide();

    // 취소 버튼 (나중에 이벤트 따로 만들어야함)
    // $(updateInput).hide();
}

// 수정 폼 -> 수정 버튼 클릭 이벤트 (db값 수정)
$(document).on("click", "#updateEntry", async function () {

    const updateGuestName = $('#update-guest-name').val();
    const updateGuestMessage = $('#update-guest-message').val()

    const docRef = doc(collection(db, "guest_book"), fieldId);
    const docSnap = await getDoc(docRef);

    let row = docSnap.data();
    row.guest_name = updateGuestName;
    row.guest_message = updateGuestMessage;

    await setDoc(docRef, row);

    clearAll();
});






/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * html 생성   * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

// 방명록 html 생성 (답글 기능 추가)
function createGuestBook(docs, name) {
    docs.forEach((doc) => {
        let row = doc.data();

        // 페이지 주인(?)의 방명록이 아니면 보이지 않음
        if (row.name !== name) {
            return;
        }

        let id = doc.id;
        let isRoot = row.isRoot;
        let parentId = row.parentId;

        let guest_name = row.guest_name;
        let guest_message = row.guest_message;
        let date = formatDate(row.date);

        let guest_book;
        if (isRoot) {
            guest_book = $(`
                <div class="show-container" id="container-${id}">
                    <div class="show-name-container">
                        <span class="show-name">${guest_name}</span>
                        <span class="show-guest-message">${guest_message}</span> 
                        <span class="show-date">${date}</span>
                    </div>
                    <div class="show-button-container">
                        <button class="replyBtn" id="${id}">답글</button>
                        <button class="deleteBtn" data-bs-toggle="modal" id=${id} data-bs-target="#passwordModal">삭제</button>
                        <button class="updateBtn" data-bs-toggle="modal" id=${id} data-bs-target="#passwordModal">수정</button>
                    </div>
                </div>
            `);
            // <button class="updateBtn" id="${id}">수정</button>

            $("#guestbook-entries").append(guest_book);

        } else {
            const parentDiv = document.getElementById('container-' + parentId);

            guest_book = $(`
                <div class="reply-show-container">
                    <div class="reply-show-icon-container">
                            <p>⤷</p>
                    </div>
                    <div class="reply-show-info-container" id="reply-container-${id}">
                        <span class="reply-show-name">${guest_name}</span>
                        <span class="reply-show-guest-massage">${guest_message}</span> 
                        <span class="reply-show-date">${date}</span>
                    </div>
                    <div class="reply-show-message-container">
                        <button class="deleteBtn" data-bs-toggle="modal" id=${id} data-bs-target="#passwordModal">삭제</button>
                        <button class="updateBtn" data-bs-toggle="modal" id=${id} data-bs-target="#passwordModal">수정</button>
                    </div>
                </div>
            `)

            parentDiv.insertAdjacentElement('afterend', guest_book[0]);
        }

    });
    // $("#guestbook-entries").append($(`<hr>`))
}



// 답글 버튼 누르면 새 영역 생김
$(document).on("click", ".replyBtn", async function () {
    removeReplyInput()
    parentId = $(this).attr("id");

    const parentDiv = document.getElementById('container-' + parentId);

    let replyInput = $(`
        <div class="reply-input-container">
            <div class="reply-input-name-pw-container">
                <p class="reply-icon">⤷</p>
                <input type="text" class="reply-input-name" id="reply-guest-name" placeholder="이름" />
                <input type="password" class="reply-input-pw" id="reply-guest-pw" placeholder="비밀번호" maxlength="4" />
                <button id="addReply">등록</button>
                <button id="removeReply">취소</button>
            </div>
            <div class="reply-input-message-container">
                <textarea type="text" class="reply-input-message" id="reply-guest-message" placeholder="내용을 입력하세요"></textarea>
            </div>
    `)

    parentDiv.insertAdjacentElement('afterend', replyInput[0]);

});




/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * 유효성 검사  * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

// 비빌번호 유효성 검사 
function checkPassword(inputPw, docs, fieldId) {
    docs.forEach((doc) => {
        if (doc.id === fieldId) {
            delRow = doc.data();
        }
    })

    if (delRow.guest_pw == inputPw) {
        return true;
    }
    return false;
}

// input 유효성 검사
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

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * 비우기, 닫기 * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
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

// 답글 > 취소 버튼
$(document).on("click", "#removeReply", async function () {
    removeReplyInput()
})

// 답글 영역 지우기
function removeReplyInput() {
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

