
/*Object date with methods*/
const date = new Date()
const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const monthsvalue =["01","02","03","04","05","06","07","08","09","10","11","12"];

const selectyear = document.getElementById('YearDateSelect');
const selectmonth = document.getElementById('MonthDateSelect');
const selectday = document.getElementById('DayDateSelect');


function selectOptionCreateMonth(selectElement, stringArray, datearray) {
  // Clear existing options, if any
  selectElement.innerHTML = '';

  // Loop through the string array using the index and create options
  for (let index = 0; index < stringArray.length; index++) {
    const option = document.createElement('option');
    option.text = stringArray[index];
    option.value = datearray[index];
    selectElement.appendChild(option);
  };

  if (localStorage.getItem('selectedMonth')) {
    selectElement.value = localStorage.getItem('selectedMonth');
  }
}

selectOptionCreateMonth(selectmonth,months,monthsvalue);

// Add an event listener to the Month select element to reload the Day options when the month is changed
selectmonth.addEventListener('change', (event) => {
  const selectedMonth = event.target.value;
  reloadDaysFromMonth(selectedMonth);
});

/* Save the selected month locally for session*/
selectmonth.addEventListener('change', function() {
  localStorage.setItem('selectedMonth', selectmonth.value);
});



// Initial load of the Day options based on the default selected month (January)
reloadDaysFromMonth(monthsvalue[0]);

function reloadDaysFromMonth(selectedMonth) {
  const daySelectElement = document.getElementById('DayDateSelect');
  
  // Clear existing options, if any
  daySelectElement.innerHTML = '';
  
  // Get the number of days in the selected month
  const selectedMonthIndex = monthsvalue.indexOf(selectedMonth);
  const days = daysInMonth[selectedMonthIndex];

  // Create options for the days
  for (let i = 1; i <= days; i++) {
    const option = document.createElement('option');
    const dayValue = i < 10 ? `0${i}` : i.toString(); // Add leading zero for single-digit numbers
    option.text = dayValue;
    option.value = dayValue;
    daySelectElement.appendChild(option);
  }
}

/* Save the selected day locally for session*/
selectday.addEventListener('change', function() {
  localStorage.setItem('selectedDay', selectday.value);
});



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

  // Set the index of the current year as selected or if in the same session someone already choose an option that remains from localstorage
  if (localStorage.getItem('selectedYear')) {
    selectElement.value = localStorage.getItem('selectedYear');
  }
  else{
    selectElement.selectedIndex = 50;
  }
}

// Call the function to create the select element initially
selectOptionCreateYear();

/* Save the selected year locally for session*/
selectyear.addEventListener('change', function() {
  localStorage.setItem('selectedYear', selectyear.value);
});
