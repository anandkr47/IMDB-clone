'use strict'

//API Links used
// https://imdb-api.com/en/API/Title/${API}/${Movie-ID}/Images,Trailer,Ratings,
// https://imdb-api.com/en/API/SearchMovie/k_e59052u3/${Movie-Name}
// const api = 'k_f8ns5vy9';
const api = 'k_r5rty56w';
const home = document.querySelector('#home');
const fav = document.querySelector('#fav');
const homeMovies = document.querySelector('#home-card');
const serchText = document.querySelector('#search-movie');
const serchBtn = document.querySelector('#search-btn');
const addFav = document.querySelector('.fav-btn');
const getinfo = document.querySelector('#getFullInfo');

let favList = [];

home.addEventListener('click', () => {
    homeMovies.innerHTML = '';
});

//get all data for Favourite section
fav.addEventListener('click', () => {
    homeMovies.innerHTML = '';
    favList.forEach((element) => {
        fetchData(`https://imdb-api.com/en/API/Title/${api}/${element}/FullCast,Images,Trailer,Ratings,`, 'fav');
    });
})

//renders all data of movies
const renderMovies = function (data) {
    let html = `
    <div class="card m-2 bg-dark" style="width: 18rem; " id="${data.id}">
        <img id="getFullInfo" onclick="getFullInfo()"src="${data.image}"class="card-img-top" alt="${data.title}">
        <ul class="list-group list-group-flush bg-dark text-center">
            <li class="list-group-item bg-dark text-light">${data.title}</li>
            <li class="list-group-item bg-danger fav-btn btn" onclick="updateFav()">Add Favourite</li>
        </ul>
    </div>
    `;
    homeMovies.insertAdjacentHTML('beforeend', html);
}

//renders all data of movie with full information
const renderMovie = function (data) {
    let html = `
    <div class="card mb-3 bg-dark" id="${data.id}">
        <div class="row g-0">
            <div class="col-md-4">
                    <img src="${data.image}"
                    class="img-fluid rounded-start" alt="${data.title}">
            </div>
            <div class="col-md-8">
                <div class="card-body">
                    <h5 class="card-title">${data.fullTitle}</h5>
                    <p class="card-text">Director:- ${data.directors}</p>
                    <p class="card-text">${data.plot}</p>
                    <p class="card-text">Relece date: ${data.releaseDate}</p>
                    <p class="card-text">⭐${data.ratings.imDb}/10</p>
                    <button class="btn btn-danger" id="${data.id}" onclick="updateFav2()">Add Favourite</button>
                </div>
            </div>
        </div>
    </div>
    `;
    homeMovies.insertAdjacentHTML('beforeend', html);
}


//renders all data of that have been saved in Favourite movies
const renderFavMovies = function (data) {
    let html = `
    <div class="card m-2 bg-dark" style = "width: 18rem; " id = "${data.id}" >
        <img id="getFullInfo" onclick="getFullInfo()" src="${data.image}" class="card-img-top" alt="${data.title}">
        <ul class="list-group list-group-flush bg-dark text-center">
            <li class="list-group-item bg-dark text-light">${data.fullTitle}</li>
            <li class="list-group-item bg-dark text-light">⭐ ${data.ratings.imDb}/10</li>
        </ul>
    </div>
        `;
    homeMovies.insertAdjacentHTML('beforeend', html);
}

// fetchs data After searching
const fetchDataSearch = function (url) {
    fetch(url).then((response) => response.json())
        .then((data) => {
            data.results.forEach(element => {
                renderMovies(element);
            });
        })
}

//fetchs the data to display in Favourite scection
const fetchData = function (url, input = '') {
    fetch(url).then((response) => response.json())
        .then((data) => {
            if (input === 'fav') {
                renderFavMovies(data);
            } else {
                renderMovie(data);
            }
        });
}

//Search button to search for movies
serchBtn.addEventListener('click', () => {
    const value = serchText.value;
    homeMovies.innerHTML = '';
    fetchDataSearch(`https://imdb-api.com/en/API/SearchMovie/${api}/${value}`);
});

// updating all the data and saving for Favourite list
function updateFav() {
    const id = event.target.parentElement.parentElement.id;
    if (favList.includes(id)) {
        return;
    }
    favList.push(id);
    setLocalStorage();
};

// updating all the data and saving for Favourite list
function updateFav2() {
    const id = event.target.id;
    if (favList.includes(id)) {
        return;
    }
    favList.push(id);
    setLocalStorage();
};

// fetchs full information of the movies
function getFullInfo() {
    const id = event.target.parentElement.id;
    homeMovies.innerHTML = '';
    fetchData(`https://imdb-api.com/en/API/Title/${api}/${id}/FullCast,Images,Trailer,Ratings,`);
    renderMovie(data);
}

//its a local storage so after refreshing the website also we can see the saved Favourite list of movies

function setLocalStorage() {
    localStorage.setItem('favList', JSON.stringify(favList))
}

function getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('favList'));
    if (!data) return;

    favList = data;
}
getLocalStorage();

function reset() {
    localStorage.removeItem('favList');
    location.reload();
}
