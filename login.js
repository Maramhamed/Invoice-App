const URL = "https://invoice-app-lqzf.onrender.com/api/v1/";
let submitBtn = document.getElementById("btn-login");
const loginForm = document.getElementById("login_form");

// Send the login request
async function loginUser(email, password) {
  submitBtn.textContent = "loading......";
  submitBtn.disabled = true;
  try {
    const response = await fetch(`${URL}user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.status === 401) {
      throw new Error("unauthorized! please check your email or password");
    }
    if (response.status === 400 || response.status === 500) {
      //500 database error
      throw new Error("Something went very wrong");
    }

    const { token } = await response.json();
    //save token in local storage
    localStorage.setItem("Token", token);

    //reset button text content
    submitBtn.textContent = "login";
    submitBtn.disabled = false;
    window.location.href = "/main-page/dashboard.html";

  } catch (error) {
    alert(error.message);

    submitBtn.textContent = "login";
    submitBtn.disabled = false;
  }
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const emailInput = document.getElementById("email-address").value,
    passwordInput = document.getElementById("Password").value; // Corrected the ID here.
  if (!emailInput || !passwordInput) {
    alert("please provide your email and password");
    return;
  }
  loginUser(emailInput, passwordInput);
});




