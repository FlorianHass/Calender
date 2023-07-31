
/*Object date with methods*/
const date = new Date()

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const day_in_month = [31,28,31,30,31,30,31,31,30,31,30,31]

/* Render based on a constant variable in backend */
/*calenderbodyrender(){
    
}

const rendermonth = month () {

}*/

/* Look at jquery and jquery user interface */




function selectOptionCreateYear() {
  const selectElement = document.getElementById('YearDateSelect');
  const currentYear = new Date().getFullYear();

  // Clear existing options
  selectElement.innerHTML = '';

  // Adding options for the past 50 years
  for (let i = 50; i >= 1; i--) {
    const yearOption = document.createElement('option');
    yearOption.value = currentYear - i;
    yearOption.textContent = currentYear - i;
    selectElement.appendChild(yearOption);
  }

  // Adding options for current year and the next 50 years
  for (let i = 0; i <= 50; i++) {
    const yearOption = document.createElement('option');
    yearOption.value = currentYear + i;
    yearOption.textContent = currentYear + i;
    selectElement.appendChild(yearOption);
  }

  // Set the index of the current year as selected
  selectElement.selectedIndex = 50;
}

// Call the function to create the select element initially
selectOptionCreateYear();
