window.api = "https://invoice-app-lqzf.onrender.com/api/v1/";
const token = localStorage.getItem("Token");

// This function to make form movement come from left side and then back
function moveElements() {
  const button = document.getElementById("showFormButton");
  const formMovement = document.getElementById("formMovement");

  if (formMovement.classList.contains("move-left")) {
    // Move elements to the right before animating further
    formMovement.classList.remove("move-left");
    formMovement.style.left = "100px";
    button.disabled = true; // Disable the button after clicking once
    formMovement.style.pointerEvents = "none"; // Disable pointer events on the div
  } else {
    // Move elements to the left before animating further
    formMovement.classList.add("move-left");
    formMovement.style.left = "-200%";
    formMovement.style.pointerEvents = "auto"; // Enable pointer events on the div
  }
}

// This function for cancel button
const cancelButton = document.getElementById("cancelButton");
const formMovement = document.getElementById("formMovement");

cancelButton.addEventListener("click", () => {
  formMovement.style.left = "-100%"; // Set the left position to hide the form
});

/*****************************************************************************************************/

// This function use to repeat item list when I click on button --Add New Item--

// JavaScript
document.getElementById("repeatButton").addEventListener("click", addNewInput);

function addNewInput() {
  const inputContainer = document.getElementById("inputContainer");

  // Create a new row for each item
  const itemRow = document.createElement("div");
  itemRow.classList.add("row", "item-container");

  // Create the input elements for each item
  const itemNameCol = createItemColumn("Item Name", "text", "col-md-3");
  itemRow.appendChild(itemNameCol);

  const quantityCol = createItemColumn("Quantity", "number", "col-md-2");
  itemRow.appendChild(quantityCol);

  const priceCol = createItemColumn("Price", "number", "col-md-2");
  itemRow.appendChild(priceCol);

  const taxesCol = createItemColumn("Taxes", "number", "col-md-2");
  itemRow.appendChild(taxesCol);

  const totalCol = createItemColumn("Total", "number", "col-md-2");
  itemRow.appendChild(totalCol);

  const deleteCol = createDeleteColumn(itemRow); // Pass the current row to the function
  itemRow.appendChild(deleteCol);

  // Append the new item row to the container
  inputContainer.appendChild(itemRow);
}

function createItemColumn(labelText, inputType, columnClass) {
  const colDiv = document.createElement("div");
  colDiv.classList.add(columnClass);

  const label = document.createElement("label");
  label.innerText = labelText + ":";

  const input = document.createElement("input");
  input.type = inputType;
  input.classList.add("form-control");
  input.autocomplete = "off";

  colDiv.appendChild(label);
  colDiv.appendChild(input);

  return colDiv;
}

function createDeleteColumn(rowToDelete) {
  const colDiv = document.createElement("div");
  colDiv.classList.add(
    "col-md-1",
    "mb-2",
    "d-flex",
    "flex-column",
    "align-items-center",
    "justify-content-center"
  );

  const deleteLabel = document.createElement("label");
  deleteLabel.innerText = "Delete:";

  const deleteLink = document.createElement("a");
  deleteLink.href = "#";

  const deleteIcon = document.createElement("i");
  deleteIcon.classList.add("fa", "fa-times");
  deleteIcon.style.fontSize = "48px";
  deleteIcon.style.color = "red";

  // Add event listener to delete icon
  deleteIcon.addEventListener("click", function () {
    if (rowToDelete !== inputContainer.firstElementChild) {
      // Check if the row is not the original row before deleting
      rowToDelete.remove();
    }
  });

  deleteLink.appendChild(deleteIcon);
  colDiv.appendChild(deleteLabel);
  colDiv.appendChild(deleteLink);

  return colDiv;
}

// document.getElementById("inputContainer")
//   .addEventListener("input", function (event) {
//     const target = event.target;
//     if (target.tagName === "INPUT") {
//       const labelText = target.previousElementSibling.innerText;
//       console.log(labelText + ": " + target.value);
//     }
//   });

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
getAllCompanies();

// ---------------------------------------------------------------------------------

/*
to send POST request we need data to provide it inside the body request 
*/
const clientName = document.getElementById("inputClientName"),
  clientPhone = document.getElementById("inputPhone"),
  clientCity = document.getElementById("inputAddress");

/*


*/

async function createInvoice(bill_from, clientName, clientPhone, clientCity, invoiceItemsValues) {
  // Create a new invoice object
  const invoice = {
    bill_from: bill_from,
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
    } else {
      // The invoice was not created successfully
      alert('Failed to create invoice.');
    }
  }

  catch (error) {
    // An error occurred while creating the invoice
    console.error(error);
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

  // Call the createInvoice function with the necessary data
  createInvoice(
    bill_from,
    clientName.value,
    clientPhone.value,
    clientCity.value,
    invoiceItemsValues
  );
});

const tableBody = document.querySelector("#invoice_view tbody")



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


