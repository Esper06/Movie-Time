const errHandler = (message) => {
  $("#alertMessage").empty();
  errMessage = ` <div id="alertMessage" class="alert alert-warning alert-dismissible fade show " role="alert">
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
    if (response.ok) {
      document.location.replace("/");
    } else {
      errHandler(resMessage.message);

      return;
    }
    return;
  }
  errHandler("Error: Fill in the requiered fileds!");

  return;
};

const signupFormHandler = async (event) => {
  event.preventDefault();
  const userName = capitalizeFirstLetter($("#name-signup").val().trim());
  const email = $("#email-signup").val().trim().toLowerCase();
  const password = $("#password-signup").val().trim();
  const password2 = $("#password-signup2").val().trim();
  if (!userName || !email || !password | !password2) {
    errHandler("Error: Fill in the requiered fileds");
    return;
  }
  if (password !== password2) {
    errHandler("Error: Password should match!");
    return;
  }
  if (password.length < 8) {
    errHandler("Error: Password should be at least 8 characters!");
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
      errHandler(resMessage.message);
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
      errHandler(response.statusText);
      return;
    }
  } else {
    errHandler("Post title or content can't be empty!");
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
      errHandler(response.statusText);
      return;
    }
  } else {
    errHandler("Title or content can't be empty!");
    return;
  }
};
const deletePost = async (event) => {
  const id = parseInt($("#post-id").text().trim());

  event.preventDefault();
  const response = await fetch(`/api/post/${id}`, { method: "DELETE" });

  if (response.ok) {
    // If successful, redirect the browser to the profile page
    document.location.replace("/profile");
  } else {
    errHandler(response.statusText);
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
    errHandler(response.statusText);
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
      errHandler(response.statusText);
      return;
    }
  } else {
    errHandler("content can't be empty!");

    return;
  }
};

$(".login-form").on("submit", loginFormHandler);

$(".signup-form").on("submit", signupFormHandler);
$("#addNewPost").on("click", addNewPost);
$("#updatePost").on("click", updatePost);
$("#deletePost").on("click", deletePost);
$("#addComment").on("click", addComment);

$("#logout").on("click", logout);
