window.api = "https://invoice-app-lqzf.onrender.com/api/v1/";
const token = localStorage.getItem("Token");


async function displayUserData() {
  try {
    const response = await fetch(`${window.api}user/me`, {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${token}`
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user data.');
    }

    const data = await response.json();
    let userName = data['results']['doc']['name'];
     let userEmail = data['results']['doc']['email'];
    let userRole = data['results']['doc']['role'];


    return { userName, userEmail, userRole };

  } catch (error) {
    console.error(error);
  }
}

async function populateForm() {
  try {
    const userData = await displayUserData();

    // Update the input fields with the fetched data
    document.getElementById('inputName').value = userData.userName; // Assuming the API response contains a 'name' property
    document.getElementById('inputEmail').value = userData.userEmail; // Assuming the API response contains an 'email' property
    document.getElementById('inputRole').value = userData.userRole; // Assuming the API response contains a 'role' property

  } catch (error) {
    console.error(error);
  }
}

populateForm()
// For the Left Navbar
var menu_btn = document.querySelector("#menu-btn");
var sidebar = document.querySelector("#sidebar");
var container = document.querySelector(".my-container");
menu_btn.addEventListener("click", () => {
  sidebar.classList.toggle("active-nav");
  container.classList.toggle("active-cont");
});