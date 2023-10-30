const prePath = 'https://image.tmdb.org/t/p/w500';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MWEzYmZjYmQxN2RkMDdhOTliYjk0NGI4N2E4Y2NhOCIsInN1YiI6IjY1MzEwYmNkZjE3NTljMDBjNWM0N2RlYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.l_eNJVJeWDsjOwjRISRpNGpzZD4CO7nT44WdPD7itss'
  }
};

const mainContainer = document.querySelector('#main-container');
const baseCard = document.querySelector('#base-card');
const searchButton = document.querySelector('#search-button');
const modalBody = document.querySelector('#modal-body');
const pageButtonBox = document.querySelector('#page-button-box');
const summaryOverview = (overview) => {
  let max = 200; // 표시할 글자수 기준 => 200자 추천하기
  if (overview.length > max) {
    overview =
      overview.substr(0, max - 2) +
      `...
       더보기`;
  }
  // console.log(max);
  return overview;
};
const modal = (img, title, overview, voteAverage, voteCount) => {
  return (`
    <div id="modalContainer" class="mainModule">
      <div id="modalContent" class="module">
        <div class="module-head">
          <div class="moduleLt">
            <img class="moduleImg"
              src="${prePath + img}" />
          </div>
          <div class="moduleRt">
            <div class="moduleTitle-box">
              <div class="moduleTitle">${title}</div>
            </div>
            <div class="moduleRating-box">
              <div class="moduleRating">평점 ${voteAverage} (${voteCount.toLocaleString()})</div>
            </div>
            <div class="moduleDescription-box">
              <div class="moduleDescription">
              ${overview}
              </div>
            </div>
          </div>
        </div>
        <div class="module-bottom">
          <div class="review-box">
            <div class="comment">
              <div class="userinfo">
                <div class="name"></div>
              </div>
              <div class="review"></div>
              <div class="datebox">
                <div clas="date"> </div>
              </div>
            </div>
          </div>
          <div class="comment-input-box">
            <input class="input-name" type="text" placeholder="이름" />
            <input class="input-password" type="text" placeholder="비밀번호" />
            <input class="input-password" type="text" placeholder="확인" />
            <input class="input" type="text" placeholder="여기에 적으세요." />
            <button type="button" class="send-button">작성하기</button>
          </div>
        </div>
      </div>
    </div>
  `)
}
// 이 함수가 page가 없을 때 대처를 해놓는게 좋지 어떻게 하나면
const fetchData = (search, page) => {
  mainContainer.innerHTML = '';
  fetch(`https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${page ?? 1}`, options) //page값이 없으면(page 가 undefiend 이면 1을 주겠다) 널병합연산
    .then(response => response.json())
    .then(response => {
      // console.log(response);
      response.results.forEach((item) => {
        // console.log(item);
        if (search) {
          title = item.title.toLowerCase();
          search = search.toLowerCase();
          if (title.includes(search)) {
            createCards(item);
          }
        } else {
          createCards(item);
        }
      });
    })
    .catch(err => console.error(err));
}

// 모달창에서 localStorage를 사용하여 작성자, 리뷰, 확인 비밀번호를 저장하는 함수
function saveReview(event) {
  const movieTitle = document.querySelector(".moduleTitle").textContent;
  const author = document.querySelector(".input-name").value;
  const review = document.querySelector(".input").value;
  const password = document.querySelector(".input-password").value;
  const confirmPassword = document.querySelectorAll(".input-password")[1].value;
  const textInput = document.querySelector(".input");
  textInput.addEventListener("input", function () {
    inputCheck(this, 100); // 글자 설정 100자
  });
  if (password !== confirmPassword) {
    alert("비밀번호가 일치하지 않습니다. 다시 시도하세요.");
    return;
  }
  if (author && review) {
    // 작성자, 리뷰, 비밀번호를 localStorage에 저장
    const reviewData = {
      author,
      review,
      password,
    };
    const existingReviews = localStorage.getItem(movieTitle);
    let reviews = [];
    if (existingReviews === null || existingReviews === "[]") {
      reviews.push(reviewData);
      localStorage.setItem(movieTitle, JSON.stringify(reviews));
      updateReviewList();
      return;
    } else {
      reviews = JSON.parse(existingReviews);
    }
    reviews.push(reviewData);
    localStorage.setItem(movieTitle, JSON.stringify(reviews));

    // 저장 후, 리뷰를 모달에 추가하고 입력 필드를 비우기
    const comment = document.querySelector(".comment");
    comment.querySelector(".name").textContent = author;
    comment.querySelector(".review").textContent = review;
    const date = new Date();
    comment.querySelector(".date").textContent = date.toLocaleString();

    document.querySelector(".input-name").value = "";
    document.querySelector(".input").value = "";
    document.querySelector(".input-password").value = "";
    document.querySelectorAll(".input-password")[1].value = "";
    // 저장 후, 리뷰 목록을 업데이트 (이미 작성된 리뷰가 있을 경우)
    updateReviewList();
  } else {
    alert("작성자와 리뷰를 모두 입력해야 합니다.");
  }
}

// 리뷰 업데이트
function updateReviewList() {
  const movieTitle = document.querySelector(".moduleTitle").textContent;
  const reviews = localStorage.getItem(movieTitle);
  if (reviews) {
    const reviewData = JSON.parse(reviews);
    const reviewBox = document.querySelector(".review-box");
    reviewBox.innerHTML = "";

    reviewData.forEach((data, index) => {
      const comment = document.createElement("div");
      comment.classList.add("comment");
      const userinfo = document.createElement("div");
      userinfo.classList.add("userinfo");
      userinfo.innerHTML = `<div class="name">${data.author}</div>`;
      comment.appendChild(userinfo);
      comment.innerHTML += `<div class="review">${data.review}</div>`;
      const datebox = document.createElement("div");
      datebox.classList.add("datebox");
      datebox.innerHTML = `<div class="date">${new Date().toLocaleString()}</div>`;
      comment.appendChild(datebox);

      // 추가: 수정 및 삭제 버튼
      const editButton = document.createElement("button");
      editButton.textContent = "수정";
      editButton.addEventListener("click", () => editReview(index));

      comment.appendChild(editButton);

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "삭제";
      deleteButton.addEventListener("click", () => deleteReview(index));
      comment.appendChild(deleteButton);

      reviewBox.appendChild(comment);
    });
  }
}
function editReview(index) {
  const movieTitle = document.querySelector(".moduleTitle").textContent;
  const reviews = localStorage.getItem(movieTitle);
  if (reviews) {
    const reviewData = JSON.parse(reviews);

    // 비밀번호 확인
    const reviewPassword = reviewData[index].password;
    const inputPassword = prompt("비밀번호를 입력하세요:");

    if (inputPassword === reviewPassword) {
      // 수정할 리뷰를 편집할 수 있는 입력 필드로 교체
      const reviewBox = document.querySelector(".review-box");
      const comment = reviewBox.children[index];

      const reviewText = comment.querySelector(".review").textContent;
      comment.querySelector(".review").innerHTML = `
        <input class="edit-review-input" type="text" value="${reviewText}" />
        <button class="save-edit-button">저장</button>
      `;

      const saveButton = comment.querySelector(".save-edit-button");
      saveButton.addEventListener("click", () => saveEditedReview(index));
    } else {
      alert("비밀번호가 일치하지 않습니다.");
    }
  }
}

// 편집한 리뷰 저장 함수
function saveEditedReview(index) {
  const editedReviewInput = document.querySelector(".edit-review-input");
  const newReviewText = editedReviewInput.value;
  const movieTitle = document.querySelector(".moduleTitle").textContent;
  if (newReviewText) {
    const reviews = localStorage.getItem(movieTitle);
    if (reviews) {
      const reviewData = JSON.parse(reviews);
      reviewData[index].review = newReviewText;
      localStorage.setItem(movieTitle, JSON.stringify(reviewData));
      updateReviewList();
    }
  }
}

// 리뷰 삭제 함수
function deleteReview(index) {
  const movieTitle = document.querySelector(".moduleTitle").textContent;
  const reviews = localStorage.getItem(movieTitle);
  if (reviews) {
    const reviewData = JSON.parse(reviews);

    // 비밀번호 확인
    const reviewPassword = reviewData[index].password;
    const inputPassword = prompt("비밀번호를 입력하세요:");

    if (inputPassword === reviewPassword) {
      // 비밀번호가 일치하면 리뷰 삭제
      reviewData.splice(index, 1);
      localStorage.setItem(movieTitle, JSON.stringify(reviewData));
      updateReviewList();
    } else {
      alert("비밀번호가 일치하지 않습니다. 삭제할 수 없습니다.");
    }
  }
}

const createCards = (item) => {
  const clickCard = () => {
    modalBody.innerHTML = modal(item.backdrop_path, item.title, item.overview, item.vote_average, item.vote_count);
 
        //모달 바디가 생성시 이벤트 추가
        updateReviewList();
        const sendButton = document.querySelector(".send-button");
        sendButton.addEventListener("click", saveReview);
        const textInput = document.querySelector(".input"); // input 텍스트박스에 이벤트 추가.
        textInput.addEventListener("input", function () {
          inputCheck(this, 100); // 100 = 두번째 인자값이 10이면 10자 제한, 100이면 100자 제한
        });
  };

  const newCard = baseCard.cloneNode(true);
  newCard.querySelector('.movieimg').src = prePath + item.backdrop_path;
  newCard.querySelector('.movie-title').append(item.title);
  newCard.querySelector('.rating').append(`평점 ${item.vote_average} (${item.vote_count.toLocaleString()})`);
  newCard.querySelector('.description').append(summaryOverview(item.overview));
  newCard.onclick = clickCard;
  mainContainer.append(newCard);
};

// 영화 리뷰 100자 이내
function inputCheck(el, maxlength) {
  if (el.value.length > maxlength) {
    alert("텍스트 길이는 100자 이하여야 합니다."); //알람 출력
    el.value = el.value.substr(0, maxlength);
  }
}


function clickSearch() {
  const search = document.querySelector('#search-input').value;
  fetchData(search);
}

const searchInput = document.querySelector("#search-input"); // 엔터키설정

searchInput.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    clickSearch(); // 검색 버튼 클릭과 동일한 동작을 실행
  }
});

function closeModal(event) {
  if (event.target.id === 'modalContainer') modalBody.innerHTML = '';
}

for (let i = 1; i < 10; i++) {
  let button = document.createElement('button');
  button.textContent = i;
  button.onclick = () => fetchData(null, i);
  pageButtonBox.append(button);
}

let menuEvent = document.getElementById("page-button-box"); 

menuEvent.addEventListener("mouseover", function (event) {
  event.target.style.color = "red";
});


menuEvent.addEventListener("mouseout", function(event){
  event.target.style.color = "white";
})

searchButton.onclick = clickSearch;
modalBody.onclick = closeModal;


fetchData(null, 1);

