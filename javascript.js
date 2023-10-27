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
const modal = (img, title, overview, voteAverage, voteCount) => {
     return (
          `
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
              <div class="name">name</div>
            </div>
            <div class="review">리뷰 작성 test</div>
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
  `
     )
}
const fetchData = (search) => {
     mainContainer.innerHTML = '';
     fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', options)
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


const createCards = (item) => {
     const clickCard = () => {
          modalBody.innerHTML = modal(item.backdrop_path, item.title, item.overview, item.vote_average, item.vote_count);
     };

     const newCard = baseCard.cloneNode(true);
     newCard.querySelector('.movieimg').src = prePath + item.backdrop_path;
     newCard.querySelector('.movie-title').append(item.title);
     newCard.querySelector('.rating').append(`평점 ${item.vote_average} (${item.vote_count.toLocaleString()})`);
     newCard.querySelector('.description').append(summaryOverview(item.overview));
     newCard.onclick = clickCard;
     mainContainer.append(newCard);
}


function clickSearch() {
     const search = document.querySelector('#search-input').value;
     fetchData(search);
}

function closeModal(event) {
     if (event.target.id === 'modalContainer') modalBody.innerHTML = '';
}

searchButton.onclick = clickSearch;
modalBody.onclick = closeModal;
fetchData();

