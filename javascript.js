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

const fetchData = (search) => {
     mainContainer.innerHTML = '';
     fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', options)
          .then(response => response.json())
          .then(response => {
               console.log(response)
               response.results.forEach((item) => {
                    console.log(item);
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
     const newCard = baseCard.cloneNode(true);
     newCard.querySelector('.movieimg').src = prePath + item.backdrop_path;
     newCard.querySelector('.movie-title').append(item.title)
     newCard.querySelector('.rating').append(`평점 ${item.vote_average} (${item.vote_count.toLocaleString()})`)
     newCard.querySelector('.description').append(item.overview)
     newCard.onclick = () => alert(`영화 id: ${item.id}`);
     mainContainer.append(newCard)
}


function clickSearch() {
     const search = document.querySelector('#search-input').value;
     fetchData(search);
}
document.querySelector('#search-button').onclick = clickSearch;

fetchData();
