 // firebase module 제외 js코드
 
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

// 방명록 html 생성
function createGuestBook(docs, name){
    docs.forEach((doc) => {
        let row = doc.data();

        if(row.name !== name){
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

            // let card = $(`
            //     <div class="guest-book">
            //         <div class="guest-name">
            //             <p>${guest_name}</p>
            //         </div>
            //         <div class="guest-message">
            //             <p>${guest_message}</p> 
            //         </div>
            //         <div class="date">
            //             <p>${date}</p>
            //         </div>
            //         <button class="deleteBtn" data-bs-toggle="modal" id=${id} data-bs-target="#passwordModal"id=${id}>삭제</button>
            //     </div>`)
            // <button class="deleteBtn" id=${id}>삭제</button>
        //     <button type="button" class="btn btn-primary deleteBtn" data-bs-toggle="modal" id=${id} data-bs-target="#passwordModal" data-bs-whatever="@mdo">삭제</button>

        $("#guestbook-entries").append(card);
    });
    $("#guestbook-entries").append($(`<hr>`))
}

// 비빌번호 유효성 검사 
function checkPassword(inputPw, docs, fieldId){
    let row;
    
    docs.forEach((doc) => {

        if(doc.id === fieldId){
            row = doc.data();
        }
    })

    if(row.guest_pw == inputPw){
        return true;
    }
    return false;
}

// 비밀번호 모달 닫기
function closeModal(){
    $('#passwordModal').modal('hide');
    $("#inputPw").val("");
    $("#inputPw").text("");

    debugger;

}

function validInputs(){

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


