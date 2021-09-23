const log = console.log;

const searchBtn = $("#searchBtn");
const youtubeApiKey = "AIzaSyB9ILII2-SnkQFm4eEVSNcNMXvhmg_FcEs";
const omdbApiKey = "bcb8a4fa";


const findMovie = async (url) => {
  movieList = [];
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
  $("#alertMessage").empty();
  ev.preventDefault();
  const movieName = $("#movieName").val();
  const searchType = `s=${movieName}`;
  const url = `http://www.omdbapi.com/?${searchType}&plot=full&apikey=${omdbApiKey}&Type=movie`;

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
  //  cardCreat(movieListTitle);
});

const pickMovie = async (event) => {
  log(event);
  const myTarget = event.target;
  log(myTarget.innerHTML);
  let movieTitle = myTarget.innerHTML.split("-");
  log(movieTitle);

  let searchTypeTitle = `t=${movieTitle[0]}`;

  const urlTitle = `http://www.omdbapi.com/?${searchTypeTitle}&Year=${movieTitle[1]}&apikey=${omdbApiKey}&Type=movie`;
  const pickedMovie = await findMovie(urlTitle);
  log(pickedMovie);
  if (pickedMovie.Response == "False") {
    errorHandler(pickedMovie.Error);
    return;
  }
  const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${movieTitle[0]} ${movieTitle[1]} trailer&type=video&key=${youtubeApiKey}`;
  vieoLink = await findMovie(youtubeUrl);
  log(vieoLink.items[0].id.videoId);
  //   $(".trailer").append(
  //     `
  //     <div class="embed-responsive embed-responsive-16by9">
  //   <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/${vieoLink.items[0].id.videoId}" allowfullscreen style="width:600px ; height:400px"></iframe>
  // </div>`);
  pickedMovie.trailer = `https://www.youtube.com/embed/${vieoLink.items[0].id.videoId}`;
  cardCreat(pickedMovie);
};
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
        
        <div class="img-thumbnail mx-auto  text-center">
      <iframe class="embed-responsive-item w-100" src="${content.trailer}" allowfullscreen ></iframe>
    </div>
        </div>
     <button type="submit" class="btn bg-green-400 w-100"> <i class="fas fa-photo-vide"></i> Add to List</button>
       
    </div>

  </div>

</div>
`
  );

  //   <div class="row">
  //   <div class="col-sm-6">
  //     <div class="card">
  //       <div class="card-body">
  //         <h5 class="card-title">Special title treatment</h5>
  //         <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
  //         <a href="#" class="btn btn-primary">Go somewhere</a>
  //       </div>
  //     </div>
  //   </div>

  //   <div class="col-sm-6">
  //     <div class="card">
  //       <div class="card-body">
  //         <h5 class="card-title">Special title treatment</h5>
  //         <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
  //         <a href="#" class="btn btn-primary">Go somewhere</a>
  //       </div>
  //     </div>
  //   </div>
  // </div>
};
