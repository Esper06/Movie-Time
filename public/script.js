const log = console.log;

const searchBtn = $("#searchBtn");
const youtubeApiKey = "AIzaSyB9ILII2-SnkQFm4eEVSNcNMXvhmg_FcEs";
const omdbApiKey = "bcb8a4fa";
searchBtn.on("click", async (ev) => {
  ev.preventDefault();
  const movieName = $("#movieName").val();
  log("the movie is ", movieName);

  const searchType = `s=${movieName}`;
  log("the movie is ", movieName);
  const url = `http://www.omdbapi.com/?${searchType}&plot=full&apikey=${omdbApiKey}&Type=movie`;
  const movieList = await findMovie(url);

  const searchTypeTitle = `t=${movieName}`;
  log("the movie is ", movieName);
  const urlTitle = `http://www.omdbapi.com/?${searchTypeTitle}&apikey=${omdbApiKey}&Type=movie`;
  const movieListTitle = await findMovie(urlTitle);
  log(movieListTitle);
  $("#myMovieList").append(
    `<li class="list-group-item active">${movieList.Search[0].Title}</li>`
  );
  for (var i = 1; i < movieList.Search.length; i++) {
    $("#myMovieList").append(
      `<li class="list-group-item">${movieList.Search[i].Title}</li>`
    );
  }

  const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${movieList.Search[0].Title}  trailer&type=video&key=${youtubeApiKey}`;

  const vieoLink = await findMovie(youtubeUrl);
  log(movieList);
  log(
    `https://www.youtube.com/results?search_query=${vieoLink.items[0].id.videoId}`
  );
  $(".trailer").append(
    `
    <div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/${vieoLink.items[0].id.videoId}" allowfullscreen style="width:600px ; height:400px"></iframe>
</div>

<div class="card" style="width: 18rem;">
  <img class="card-img-top" src="${movieListTitle.Poster}" alt="Card image cap">
  <div class="card-body">
    <h5 class="card-title">Card title</h5>
    <p class="card-text">${movieListTitle.Plot}</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>

    `
  );
});

const findMovie = async (url) => {
  movieList = [];
  const res = await fetch(url);
  const data = await res.json();
  return data;
};
