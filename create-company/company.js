window.api = "https://invoice-app-lqzf.onrender.com/api/v1/";
const token = localStorage.getItem("Token");

;

async function createCompany(company_name, location, sector, description) {
  // Create a new company
  console.log('Before fetch request');

  const companyInformation = {
    company_name,
    location,
    sector,
    description
  }
  try {
    // Check if the token is valid
    if (!token) {
      throw new Error("No token found. Please log in first.");
    }

    // Send the company info to the server
    const res = await fetch(`${window.api}company`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(companyInformation),
    });

   console.log('After fetch request');


    if (res.status !== 201) {
      throw new Error(`Something went wrong. Status code: ${res.status}`);
    }

    // Parse the response data
    const responseData = await res.json();
console.log(res);
console.log(responseData);
    // Check if the response data contains the company information
 

    // Company successfully created
    console.log("Company created successfully!", responseData.company);
  }  catch (error) {
    // An error occurred while creating the company
    console.error("Error:", error.message);
    if (error.message === "No token found. Please log in first.") {
      alert("Please log in first.");
    } else if (error.message === "Something went wrong. Status code: 400") {
      alert("The company name is already taken.");
    } else {
      alert(`Something went wrong: ${error.message}`);
    }
  }
}

const create_Company = document.getElementById('create_company')

create_Company.addEventListener("submit", (event) => {
  event.preventDefault();
  const companyName = document.getElementById("company_name").value;
  const location = document.getElementById("location").value;
  const sector = document.getElementById("sector").value;
  const description = document.getElementById("description").value;

  if (!companyName || !location || !sector || !description) {
    alert("Please do not leave an empty field");
    return;
  }

  createCompany(companyName, location, sector, description);
});


//const create_Company = document.getElementById('create_company')

const btnCreate = document.getElementById("btn-create");

btnCreate.onclick = () => {
  const companyName = document.getElementById("company_name").value;
  const location = document.getElementById("location").value;
  const sector = document.getElementById("sector").value;
  const description = document.getElementById("description").value;

  if (!companyName || !location || !sector || !description) {
    alert("Please do not leave an empty field");
    return;
  }

  createCompany(companyName, location, sector, description);
};
  