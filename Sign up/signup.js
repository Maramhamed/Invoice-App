window.api = "https://invoice-app-lqzf.onrender.com/api/v1/";

const submitBtn = document.getElementById("btn-sign");
const signupForm = document.getElementById("signup_form");

// Send the login request
async function signUpUser(name, email, password, confirmedPassword) {
  submitBtn.textContent = "Loading...";
  submitBtn.disabled = true;

  try {
    const response = await fetch(`${window.api}user/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, confirmedPassword }),
    });

    if (!response.ok) {
      let errorMsg = "Something went wrong.";
      if (response.status === 401) {
        errorMsg = "Unauthorized! Please check your email or password.";
      } else if (response.status === 400) {
        errorMsg = "Bad Request! Please check your inputs.";
      } else if (response.status === 500) {
        errorMsg = "Internal Server Error! Please try again later.";
      }

      throw new Error(errorMsg);
    }

    const { message: successMsg, token } = await response.json();
    localStorage.setItem("Token", token);
    submitBtn.textContent = "Login";
    submitBtn.disabled = false;

    // Navigate to the main page
    window.location.href = "/Main-page/Dashboard.html";
  } catch (error) {
    alert(error.message);
    submitBtn.textContent = "Login";
    submitBtn.disabled = false;
  }
}

signupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("user-name").value;
  const email = document.getElementById("email-address").value;
  const passwordInput = document.getElementById("Password").value;
  const passwordInputConfirm = document.getElementById("confirmPassword").value;

  if (passwordInput !== passwordInputConfirm) {
    alert("Passwords do not match. Please enter the same password in both fields.");
    return;
  }

  if (!name || !email || !passwordInput || !passwordInputConfirm) {
    alert("Please do not leave an empty field");
    return;
  }

  // Additional validation logic (e.g., password length, email format) can be added here if needed.

  signUpUser(name, email, passwordInput, passwordInputConfirm);
});
