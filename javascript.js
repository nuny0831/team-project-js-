const prePath = "https://image.tmdb.org/t/p/w500";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MWEzYmZjYmQxN2RkMDdhOTliYjk0NGI4N2E4Y2NhOCIsInN1YiI6IjY1MzEwYmNkZjE3NTljMDBjNWM0N2RlYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.l_eNJVJeWDsjOwjRISRpNGpzZD4CO7nT44WdPD7itss",
  },
};

const mainContainer = document.querySelector("#main-container");
const baseCard = document.querySelector("#base-card");

const fetchData = (search) => {
  mainContainer.innerHTML = "";
  fetch(
    "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1",
    options
  )
    .then((response) => response.json())
    .then((response) => {
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
    .catch((err) => console.error(err));
};

const createCards = (item) => {
  const newCard = baseCard.cloneNode(true);
  newCard.querySelector(".movieimg").src = prePath + item.backdrop_path;
  newCard.querySelector(".movie-title").append(item.title);
  newCard
    .querySelector(".rating")
    .append(`평점 ${item.vote_average} (${item.vote_count.toLocaleString()})`);
  newCard.querySelector(".description").append(summaryOverview(item.overview));
  newCard.onclick = () => alert(`영화 id: ${item.id}`);
  mainContainer.append(newCard);
};

function clickSearch() {
  const search = document.querySelector("#search-input").value;
  fetchData(search);
}
document.querySelector("#search-button").onclick = clickSearch;

// 영화 설명 문자열 줄이기 (...)

const summaryOverview = (overview) => {
  let max = 300; // 표시할 글자수 기준
  if (overview.length > max) {
    overview =
      overview.substr(0, max - 2) +
      `

    더보기 ...`;
  }
  console.log(max);
  return overview;
};

// // 비밀번호 숫자 4자리
function validatePassword() {
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const resultDiv = document.getElementById("result");

  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{4}$/;

  if (passwordRegex.test(newPassword)) {
    if (newPassword === confirmPassword) {
      resultDiv.innerHTML = "비밀번호가 확인되었습니다.";
      resultDiv.style.color = "green";
    } else {
      resultDiv.innerHTML =
        "최소 특수문자,대문자,소문자, 숫자 1개를 사용하여 다시 입력해주시기 바랍니다.";
      resultDiv.style.color = "red";
    }
  } else {
    resultDiv.innerHTML = "올바른 비밀번호 4자리를 입력해주시기 바랍니다.";
    resultDiv.style.color = "red";
  }
}

// // 100자 초과 시 작성 안됨
// function inputCheck(el, maxlength) {
//   if (el.value.length > maxlength) {
//     el.value = el.value.substr(0, maxlength);
//   }
// }

fetchData();
