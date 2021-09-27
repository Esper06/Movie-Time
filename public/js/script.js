const errorHandler = (message) => {
  $("#alertMessage").empty();
  errMessage = ` <div id="alertMessage" class="alert alert-danger alert-dismissible fade show " role="alert">
  <strong><i class="fas fa-exclamation-triangle"></i></strong> <span>${message}</span> 
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>`;
  $("#alertMessage").append(errMessage);
  return;
};
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
const loginFormHandler = async (event) => {
  event.preventDefault();
  console.log("hi login");
  // Collect values from the login form
  const email = $("#email-login").val().trim().toLowerCase();
  const password = $("#password-login").val().trim();
  if (email && password) {
    // Send a POST request to the API endpoint
    const response = await fetch("/api/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });

    resMessage = await response.json();
    console.log("before response.ok");

    if (response.ok) {
      console.log(" response.ok");
      document.location.replace("/profile");
    } else {
      console.log(" response not ok");

      errorHandler(resMessage.message);

      return;
    }
    return;
  }
  errorHandler("Error: Fill in the requiered fileds!");

  return;
};

const signupFormHandler = async (event) => {
  event.preventDefault();
  const userName = capitalizeFirstLetter($("#name-signup").val().trim());
  const email = $("#email-signup").val().trim().toLowerCase();
  const password = $("#password-signup").val().trim();
  const password2 = $("#password-signup2").val().trim();
  if (!userName || !email || !password | !password2) {
    errorHandler("Error: Fill in the requiered fileds");
    return;
  }
  if (password !== password2) {
    errorHandler("Error: Password should match!");
    return;
  }
  if (password.length < 8) {
    errorHandler("Error: Password should be at least 8 characters!");
    return;
  }
  if (userName && email && password && password2) {
    const response = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify({ userName, email, password }),
      headers: { "Content-Type": "application/json" },
    });
    resMessage = await response.json();
    if (response.ok) {
      document.location.replace("/profile");
    } else {
      errorHandler(resMessage.message);
      return;
    }
  }
};


const delteMovie = async (event) => {
  event.preventDefault();
  const targeted = event.target;
  const id = parseInt(targeted.getAttribute("data-id").trim());
  console.log(id);

  const response = await fetch(`/api/movie/${id}`, { method: "DELETE" });

  if (response.ok) {
    // If successful, redirect the browser to the profile page
    document.location.replace("/profile");
  } else {
    errorHandler(response.statusText);
    return;
  }
};
const likeEvent = async (event) => {
  event.preventDefault();
  let targeted = event.target;
  let movie_id = parseInt(targeted.getAttribute("data-id"));
  console.log(movie_id);

  const reactionType = targeted.getAttribute("data-reaction");
  console.log("try to: ", reactionType);

  let like_evt = false;
  let disLike_evt = false;

  if (reactionType === "like") like_evt = true;
  if (reactionType === "dislike") disLike_evt = true;

  const response = await fetch(`/api/movie/like/${movie_id}`, {
    method: "PUT",
    body: JSON.stringify({ movie_id, like_evt, disLike_evt }),
    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    resMessage = await response.json();

    if (reactionType == "like") {
      targeted.innerHTML = `<span class="font-weight-bold px-2 text-green-600">${resMessage.likes_count}</span>`;
      targeted.nextElementSibling.innerHTML = `<span class="font-weight-bold px-2 text-red-600">${resMessage.dislikes_count}</span>`;
    }
    if (reactionType == "dislike") {
      targeted.innerHTML = `<span class="font-weight-bold px-2 text-red-600">${resMessage.dislikes_count}</span>`;
      targeted.previousElementSibling.innerHTML = `<span class="font-weight-bold px-2 text-green-600">${resMessage.likes_count}</span>`;
    }

    // errorHandler("Vote saved!");
  } 
  
};
const logout = async () => {
  const response = await fetch("/api/users/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    document.location.replace("/");
  } else {
    errorHandler(response.statusText);
    return;
  }
};

const updateUserName = async (event) => {
  const userName = $("#userChange").val().trim();
  event.preventDefault();
  if (userName) {
    // Send a POST request to the API endpoint
    const response = await fetch("/api/users/update", {
      method: "PUT",
      body: JSON.stringify({ userName: userName }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      // If successful, redirect the browser to the profile page
      document.location.replace("/profile");
    } else {
      errorHandler(response.statusText);
      return;
    }
  } else {
    errorHandler("Use Name can't be empty!");
    return;
  }
};



const updateEmail = async (event) => {
  const email = $("#emailChange").val().trim();
  event.preventDefault();
  if (email) {
    // Send a POST request to the API endpoint
    const response = await fetch("/api/users/update", {
      method: "PUT",
      body: JSON.stringify({ email: email }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      // If successful, redirect the browser to the profile page
      document.location.replace("/profile");
    } else {
      errorHandler(response.statusText);
      return;
    }
  } else {
    errorHandler("Email can't be empty!");
    return;
  }
};

const updateApiKey = async (event) => {
  const apiKey = $("#apiChange").val().trim();
  event.preventDefault();
  if (apiKey) {
    // Send a POST request to the API endpoint
    const response = await fetch("/api/users/update", {
      method: "PUT",
      body: JSON.stringify({ apiKey: apiKey }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      // If successful, redirect the browser to the profile page
      document.location.replace("/profile");
    } else {
      errorHandler(response.statusText);
      return;
    }
  } else {
    errorHandler("Api key can't be empty!");
    return;
  }
};

$(".login-form").on("submit", loginFormHandler);

$(".signup-form").on("submit", signupFormHandler);

$(".userName-form").on("submit", updateUserName);
$(".email-form").on("submit", updateEmail);
$(".apikey-form").on("submit", updateApiKey);

$(".deleteMovie").on("click", delteMovie);
$(".reaction").on("click", likeEvent);

$("#logout").on("click", logout);

const commentfn = async (event) => {
  var options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  var today = new Date();

  event.preventDefault();
  let id = event.target.getAttribute("data-id");
  let userName = event.target.getAttribute("data-username");
  log("name", userName, id);
  let comment = $(`#comment${id}`).val();
  let containerId = `.comments-container${id}`;
  $(containerId).prepend(`<div class="card my-2 bg-black-50 mx-4">
  <div class="card-header"> <i class="fas fa-user-edit"></i></i> <span class=" text-info font-weight-bold fs-5 text-warning">${userName}</span>  <span class=" text-info font-weight-bold float-end">${today.toLocaleDateString(
    "en-US"
  )}</span> </div>
  <div class="card-body">
    <p class="card-text"><i class="far fa-comment-dots"></i> ${comment}</p>
    
  </div>
</div>`);
  const postData = { movie_id: id, content: comment };
  const response = await fetch("/api/comment", {
    method: "POST",
    body: JSON.stringify(postData),
    headers: { "Content-Type": "application/json" },
  });
  log(postData);
  if (!response.ok) {
    resMessage = await response.json();
    errorHandler(resMessage.message);
    return;
  }
};

$(".replyBtn").on("click", commentfn);