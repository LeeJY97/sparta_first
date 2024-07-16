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
    $("#pw").val("");
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
                
            </div>`)

            // <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo">삭제</button>

        $("#guestbook-entries").append(card);
    });
}


// 비밀번호 삭제
const exampleModal = document.getElementById('exampleModal')
if (exampleModal) {
  exampleModal.addEventListener('show.bs.modal', event => {

    console.log(event);
    // Button that triggered the modal
    const button = event.relatedTarget
    // Extract info from data-bs-* attributes
    const recipient = button.getAttribute('data-bs-whatever')
    // If necessary, you could initiate an Ajax request here
    // and then do the updating in a callback.

    // Update the modal's content.
    const modalTitle = exampleModal.querySelector('.modal-title')
    const modalBodyInput = exampleModal.querySelector('.modal-body input')

    modalTitle.textContent = `New message to ${recipient}`
    modalBodyInput.value = recipient
  })
}


