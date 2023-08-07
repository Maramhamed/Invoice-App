window.api = "https://invoice-app-lqzf.onrender.com/api/v1/";
const token = localStorage.getItem("Token");

async function displayCompanies(){

try{
    const response = await fetch(`${window.api}company`, {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${token}`
        },
      });

      if (response.status === 200) {

        console.log('fetch done');     
      }
  
      const data = await response.json();
      const count = data.count;
      const results = data.results.doc;
    
      console.log("Count:", count);
      console.log("Results:", results);

      const companyListDiv = document.getElementById("companyList");
      companyListDiv.innerHTML = ""; // Clear existing content

      const table = document.createElement("table");

      // Create the header row with fixed "Company Name" field
      const headerRow = table.insertRow();
      const companyNameHeader = document.createElement("th");
      companyNameHeader.textContent = "Company Name";
      headerRow.appendChild(companyNameHeader);

      // Add other headers if needed (e.g., "Description", "Location", "Sector")
      const descriptionHeader = document.createElement("th");
      descriptionHeader.textContent = "Description";
      headerRow.appendChild(descriptionHeader);


      const locationHeader = document.createElement("th");
      locationHeader.textContent = "Location";
      headerRow.appendChild(locationHeader);


      const sectorHeader = document.createElement("th");
      sectorHeader.textContent = "Sector";
      headerRow.appendChild(sectorHeader);


      for (let i = 0; i < count; i++) {
          const companyName = results[i]['company_name'],
              description = results[i]['description'],
              location = results[i]['location'],
              sector = results[i]['sector'];

          const row = table.insertRow();
          const companyNameCell = row.insertCell();
          const descriptionCell = row.insertCell();
          const Location = row.insertCell();
          const Sector = row.insertCell();

          companyNameCell.textContent = companyName;
          descriptionCell.textContent = description;
          Location.textContent = location;
          Sector.textContent = sector;

          // You can add more cells if you want to display "Location" and "Sector"
      }

      companyListDiv.appendChild(table);
  } catch (error) {
      console.error(error);
  }
}

displayCompanies();
