const log = console.log;
var movieData = {};
const searchBtn = $("#searchBtn");

const obtainApi = async () => {
  let res = await fetch("/api/users/Apikey");
  let data = await res.json();
  errorHandler(data.message);

  var { ombdApi, youtubeApi } = data;
  return { youtubeApi, ombdApi };
};
const findMovie = async (url) => {
  try {
    const res = await fetch(url);
    const data = await res.json();

    return data;
  } catch (err) {
    console.log("Error", err);
  }
};

const pick_color = () => {
  return (Math.floor(Math.random() * 6) + 1) * 100;
};
searchBtn.on("submit", async (ev) => {
  movieData = {};
  $("#alertMessage").empty();
  $("#result-card").empty();
  $("#SeachContainer").empty();
  ev.preventDefault();

  var { ombdApi } = await obtainApi();
  const movieName = $("#movieName").val().trim();
  const searchType = `s=${movieName}`;
  const url = `https://www.omdbapi.com/?${searchType}&plot=full&apikey=${ombdApi}&Type=movie`;

  const movieList = await findMovie(url);

  if (movieList.Response == "False") {
    errorHandler(movieList.Error);
    return;
  }

  log("the movie list are ", movieList);
  $("#SeachContainer")
    .append(`<div class=" bg-transparent my-2 py-1" role="alert">
  <h5 class="text-green-200"">Search Result </h2>
  </div>`);
  var colorBg = [];

  for (var i = 1; i < movieList.Search.length - 1; i++) {
    colorList = ["bg-green", "bg-blue", "bg-yellow", "bg-pink", "bg-red"];
    let btnColor = `${
      colorList[Math.floor(Math.random() * 4)]
    }-${pick_color()}`;
    if (colorBg.includes(btnColor)) {
      btnColor = `${colorList[Math.floor(Math.random() * 4)]}-${pick_color()}`;
    } else {
      colorBg.push(btnColor);
    }

    $("#movieList").append(
      `<button type="button" id="movieListItem${i}" class=" btn ${btnColor} m-2">${movieList.Search[i].Title}-${movieList.Search[i].Year}</button>`
    );
    $(`#movieListItem${i}`).on("click", pickMovie);
  }

  $(".movieListItem0").click(pickMovie);
});

const pickMovie = async (event) => {
  var { ombdApi, youtubeApi } = await obtainApi();

  const myTarget = event.target;
  let movieTitle = myTarget.innerHTML.split("-");
  let searchTypeTitle = `t=${movieTitle[0]}`;
  const urlTitle = `https://www.omdbapi.com/?${searchTypeTitle}&Year=${movieTitle[1]}&apikey=${ombdApi}&Type=movie`;
  const pickedMovie = await findMovie(urlTitle);
  if (pickedMovie.Response == "False") {
    errorHandler(pickedMovie.Error);
    return;
  }
  const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${movieTitle[0]} ${movieTitle[1]} trailer&type=video&key=${youtubeApi}`;
  vieoLink = await findMovie(youtubeUrl);

  pickedMovie.trailer = `https://www.youtube.com/embed/${vieoLink.items[0].id.videoId}`;
  cardCreat(pickedMovie);
  console.log(pickedMovie);
};;
const cardCreat = (content) => {
  $("#result-card").empty();
  if (content.Poster == "N/A") content.Poster = "./images/noPoster.jpg";
  $("#result-card").append(
    `
    <div class="row d-flex ">

  <div class="col-sm-6">
      <img class="img-thumbnail rounded mx-auto d-block" src="${content.Poster}" alt="Card image cap">
  </div>

  <div class="col-sm-6">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title text-red-900"><i class="fas fa-step-forward text-green-500"></i> ${content.Title}</i> <span class="text-green-900"> ${content.Year}</span> </h5>
        <p class="card-text"></i> <i class="fas fa-users"> Actors: </i> ${content.Actors}</p>
        <p class="card-text"><i class="fas fa-photo-video"> Plot: </i>  ${content.Plot}</p>
        <p class="card-text bg-red-900 m-0 p-2 text-red-300"></i><i class="fas fa-star "> Rating: </i>  ${content.Ratings[0].Value}</p>
        
        <div class="img-thumbnail ">
      <iframe class="embed-responsive-item w-100" src="${content.trailer}" allowfullscreen ></iframe>
    </div>
        </div>
     <button type="submit" id="submitMovie" class="btn bg-green-400 w-100"> <i class="fas fa-photo-vide"></i> Add to List</button>
       
    </div>

  </div>

</div>
`
  );
  movieData = {
    title: content.Title,
    year: content.Year,
    posterLink: content.Poster,
    actors: content.Actors,
    trailerLink: content.trailer,
    rating: content.Ratings[0].Value,
    plot: content.Plot,
    genre: content.Genre,
  };
  $("#submitMovie").on("click", addNewMovie);
};

const addNewMovie = async () => {
  
  if (movieData) {
    // Send a POST request to the API endpoint
    const response = await fetch("/api/movie", {
      method: "POST",
      body: JSON.stringify(movieData),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      errorHandler("Movie added to your profile");
      // If successful, redirect the browser to the profile page
      document.location.replace("/search");
    } else {
      resMessage = await response.json();
      errorHandler(resMessage.message);
      return;
    }
  } else {
    errorHandler("Post title or content can't be empty!");
    return;
  }
};



const addComment = async (event) => {
  const movie_id = parseInt($("#movie-id").text().trim());
  const user_id = parseInt($("#user-id").text().trim());
  const content = $("#comment-content").val().trim();

  console.log(movie_id, user_id, content);
  event.preventDefault();
  if (content) {
    // Send a POST request to the API endpoint
    const response = await fetch("/api/comment", {
      method: "POST",
      body: JSON.stringify({ movie_id, user_id, content }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      // If successful, redirect the browser to the profile page
      document.location.replace("/");
    } else {
      errHandler(response.statusText);
      return;
    }
  } else {
    errHandler("content can't be empty!");

    return;
  }
};

$("#addComment").on("click", addComment);