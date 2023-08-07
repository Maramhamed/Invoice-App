window.api = "https://invoice-app-lqzf.onrender.com/api/v1/";
const token = localStorage.getItem("Token");
let submitBtn = document.getElementById("createInvoice");

// -------------------------------------------------------------------------------------

const getAllCompanies = async () => {
  try {
    const res = await fetch(`${window.api}company`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // if (!res.ok) {
    //   throw new Error(`Failed to fetch companies. Status: ${res.status} ${res.statusText}`);
    // }
    console.log(res);
    const data = await res.json();
    console.log(data);

    if (data.message === "jwt malformed") {
      localStorage.removeItem("Token");
      window.location.href = "login.html";
    }

    // if (!data || data.results || data.results.doc.length === 0) {
    //   throw new Error("No companies found in the API response.");
    // }

    const typeBill = document.getElementById("typeBill");
    if (!typeBill) {
      throw new Error("Dropdown element 'typeBill' not found in the HTML.");
    }

    typeBill.innerHTML = ""; // Clear existing options (optional)

    data.results.doc.forEach((company, i, arr) => {
      const optionElement = document.createElement("option");
      optionElement.innerText = company.company_name;
      optionElement.value = company._id;
      typeBill.appendChild(optionElement);
      typeBill.value = "";
    });
  } catch (err) {
    console.log("An error occurred while fetching companies:", err.message);
    // Optionally, you can display an error message to the user here
  }
};

// Call the function to fetch and populate the dropdown
document.addEventListener("DOMContentLoaded", () => {
  getAllCompanies();
});
// ---------------------------------------------------------------------------------

/*
to send POST request we need data to provide it inside the body request 
*/

let companyID;
async function createInvoice(bill_from, clientName, clientPhone, clientCity, invoiceItemsValues) {
  companyID = document.getElementById("typeBill").value;

  // Get the client name, phone, and city from the HTML form
  clientName = document.getElementById("clientName").value;
  clientPhone = document.getElementById("clientPhone").value;
  clientCity = document.getElementById("clientCity").value;

  // Create a new invoice object
  const invoice = {
    bill_from: companyID,
    client_name: clientName,
    client_phone: clientPhone,
    client_city: clientCity,
    items: invoiceItemsValues,
  };

  try {
    // Send the invoice to the server
    const res = await fetch(`${window.api}invoice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(invoice),
    })
    const data = await res.json()
    //get data
    getAllInvoices()
    if (res.status === 201) {


      // The invoice was created successfully
      alert('Invoice created successfully!');
      submitBtn.disabled = false;
    } else {
      // The invoice was not created successfully
      alert('Failed to create invoice.');
    }
  }

  catch (error) {
    // An error occurred while creating the invoice
    console.error(error.message);
  };
}







const invoiceItems = Array.from(
  document.querySelector("#inputContainer .item-container").children
);
invoiceItems.splice(-2);

/*
map
*/
const submitInvoice = document.getElementById("invoice_form");

const companyMenu = document.getElementById("typeBill");



let bill_from;
const invoiceItemsValues = [];
companyMenu.onchange = (e) => {
  bill_from = e.target.value;
};
submitInvoice.addEventListener("submit", (event) => {
  event.preventDefault();

  const invoiceItems = document.querySelectorAll(".item-container");
  const invoiceItemsValues = [];

  for (const item of invoiceItems) {
    const itemName = document.querySelector('#itemName', item).value;
    const price = parseFloat(document.querySelector('#price', item).value);
    const quantity = parseInt(document.querySelector('#quantity', item).value);

    const invoiceItem = {
      item_name: itemName,
      price: price,
      quantity: quantity,
    };

    invoiceItemsValues.push(invoiceItem);
  }
    // Disable the submit button before calling the createInvoice function
    submitBtn.textContent = "loading....";
    submitBtn.disabled = true;
  
  // Call the createInvoice function with the necessary data
   createInvoice(
    bill_from,
    clientName.value,
    clientPhone.value,
    clientCity.value,
    invoiceItemsValues
  );
  submitBtn.textContent = "Create";
  submitBtn.disabled = false;
});

const tableBody = document.querySelector("#invoice_view tbody");
async function getAllInvoices(page = 1) {
  tableBody.innerHTML = ""
  try {
    const res = await fetch(`${window.api}invoice?page=${page}`, {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${token}`
      },
    });
    const data = await res.json();
    const invoices = data.results.doc;
    let count = data.count


    renderInvoice(invoices)
  paginationEl(Math.ceil(count/10))
   // console.log(count)
   
  } catch (error) {
    console.error(error);
  }
}

getAllInvoices();

//render
function renderInvoice(invoices) {
  const tableBody = document.getElementById("tableBody");
 
  for (let i = 0; i < invoices.length; i++) {
    
    const invoice = invoices[i];

    const tr = document.createElement("tr");

    const td_created_at = document.createElement("td");
    const td_name = document.createElement("td");
    const td_status = document.createElement("td");

    td_created_at.textContent = new Date(invoice.created_at).toDateString();
    td_name.textContent = invoice.client_name;
    td_status.textContent = invoice.status;




    tr.appendChild(td_created_at);
    tr.appendChild(td_name);
    tr.appendChild(td_status);

    tableBody.appendChild(tr);
  }
}

//pagination
const paginationContainer = document.getElementById("pagination")
//const paginationBtns = paginationContainer.children

console.log(paginationContainer)


function paginationEl(numPage ) {
  //page number ? items per page & count of documents
  paginationContainer.innerHTML = ""
 // console.log(numPage)
  for(let i = 0; i < numPage; i++) {
  const li =  document.createElement("li")
  li.textContent = i + 1
    paginationContainer.append(li)
    console.log(li)


    li.addEventListener('click', function() {
    
    getAllInvoices(this.textContent * 1)
  })

  }
}




//"127.0.0.1:3000/api/v1/employees?location=4934308402203235"

// JavaScript
document.getElementById("repeatButton").addEventListener("click", addNewInput);


function addNewInput() {
  const inputContainer = document.getElementById("inputContainer");
  const templateRow = document.querySelector(".item-container");

  // Clone the template row
  const newItemRow = templateRow.cloneNode(true);
  newItemRow.classList.remove("item-container");
  newItemRow.style.display = "flex"; // Show the cloned row

  // Reset the input fields in the cloned row
  newItemRow.querySelector("#itemName").value = "";
  newItemRow.querySelector("#quantity").value = "";
  newItemRow.querySelector("#price").value = "";

  // Add event listener to the delete link
  const deleteLink = newItemRow.querySelector("a");
  deleteLink.addEventListener("click", function () {
    // Check if the row is not the original row before deleting
    if (newItemRow !== inputContainer.firstElementChild) {
      newItemRow.remove();
    }
  });

  // Append the new item row to the container
  inputContainer.appendChild(newItemRow);
}

