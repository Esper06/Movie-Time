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
      document.location.replace("/");
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

const addNewPost = async (event) => {
  const title = $("#post-title").val().trim();
  const content = $("#post-content").val().trim();
  const id = parseInt($("#post-id").text().trim());
  event.preventDefault();
  if (title && content) {
    // Send a POST request to the API endpoint
    const response = await fetch("/api/post", {
      method: "POST",
      body: JSON.stringify({ title, content }),
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
    errorHandler("Post title or content can't be empty!");
    return;
  }
};
const updatePost = async (event) => {
  const title = $("#post-title").val().trim();
  const content = $("#post-content").val().trim();
  const id = parseInt($("#post-id").text().trim());
  console.log(title, content, id);
  event.preventDefault();
  if (title && content) {
    // Send a POST request to the API endpoint
    const response = await fetch(`/api/post/${id}`, {
      method: "PUT",
      body: JSON.stringify({ title, content }),
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
    errorHandler("Title or content can't be empty!");
    return;
  }
};
const delteMovie = async (event) => {
  const id = parseInt($("#movie-id").text().trim());

  event.preventDefault();
  const response = await fetch(`/api/movie/${id}`, { method: "DELETE" });

  if (response.ok) {
    // If successful, redirect the browser to the profile page
    document.location.replace("/profile");
  } else {
    errorHandler(response.statusText);
    return;
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

const addComment = async (event) => {
  const post_id = parseInt($("#post-id").text().trim());
  const user_id = parseInt($("#post-id").text().trim());
  const content = $("#comment-content").val().trim();
  console.log(post_id, user_id, content);
  event.preventDefault();
  if (content) {
    // Send a POST request to the API endpoint
    const response = await fetch("/api/comment", {
      method: "POST",
      body: JSON.stringify({ post_id, user_id, content }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      // If successful, redirect the browser to the profile page
      document.location.replace("/");
    } else {
      errorHandler(response.statusText);
      return;
    }
  } else {
    errorHandler("content can't be empty!");

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

const updatePassword = async (event) => {
  const password = $("#passChange").val().trim();
  event.preventDefault();
  if (password) {
    // Send a POST request to the API endpoint
    const response = await fetch("/api/users/update", {
      method: "PUT",
      body: JSON.stringify({ password: password }),
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
    errorHandler("Password can't be empty!");
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
$(".password-form").on("submit", updatePassword);
$(".email-form").on("submit", updateEmail);
$(".apikey-form").on("submit", updateApiKey);



$("#addNewPost").on("click", addNewPost);
$("#updatePost").on("click", updatePost);
$(".delteMovie").on("click", delteMovie);
$("#addComment").on("click", addComment);

$("#logout").on("click", logout);
