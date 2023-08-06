const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const monthsvalue =["01","02","03","04","05","06","07","08","09","10","11","12"];

const selectyear = document.getElementById('YearDateSelect');
const selectmonth = document.getElementById('MonthDateSelect');
const selectday = document.getElementById('DayDateSelect');
const Lengthofday = 8.64e+7;

/*Get User E-mail*/
if (localStorage.getItem("registration") === null) {
  registerUser();
}

/* Register User by checking if User-Account already exists, create new one if doesnt */
function registerUser() {
  const userInput = prompt("Please enter max 8 Digits Username: ");
  if (userInput === null) {
    alert("You canceled the prompt");}
  else if (userInput.length > 8){
    alert("Username too long");
    registerUser();
  }
  else {
    const url = `http://dhbw.radicalsimplicity.com/calendar/88${userInput}/events`;
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length === 0) { /* Check if the json array is empty */
          localStorage.setItem("registration", userInput);
        } else {
          alert("Username already given, try again");
          registerUser(); // Recursive call to prompt for username again
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
}

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

  if (sessionStorage.getItem('selectedmonth')) {
    selectElement.value = sessionStorage.getItem('selectedmonth');
  }
  else{
    selectElement.value = datearray[new Date().getMonth()];
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
  sessionStorage.setItem('selectedmonth', selectmonth.value);
});

// Load of the Day options based on the month when page is first loaded
window.onload = function () {
  if (sessionStorage.getItem("hasCodeRunBefore") === null) {
      reloadDaysFromMonth(monthsvalue[new Date().getMonth()]);
      sessionStorage.setItem("hasCodeRunBefore", true);
  }
  else{
    reloadDaysFromMonth(sessionStorage.getItem('selectedmonth'));
  }
}

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

  // Set the index of the current year as selected or if in the same session someone already choose an option that remains from sessionStorage
  if (sessionStorage.getItem('selectedyear')) {
    selectElement.value = sessionStorage.getItem('selectedyear');
  }
  else{
    selectElement.selectedIndex = 50;
  }
}

// Call the function to create the select element initially
selectOptionCreateYear();

/* Save the selected year locally for session*/
selectyear.addEventListener('change', function() {
  sessionStorage.setItem('selectedyear', selectyear.value);
});

/*Set the global date*/
const date = returndate();

function returndate() {
  if (sessionStorage.getItem('date')) {
    return sessionStorage.getItem('date');
  }
  else{
    return new Date();
  }
}

// Function to get the selected date from the form and set the global 'date' variable
function handleSubmit(event) {
  event.preventDefault(); // Prevent form submission

  const selectedYear = selectyear.value;
  const selectedMonth = selectmonth.value;
  const selectedDay = selectday.value;

  // Set the global 'date' variable to the selected date
  const currentdate = `${selectedYear}-${selectedMonth}-${selectedDay}`;
  console.log("Selected Date:", currentdate);
  sessionStorage.setItem('date',currentdate);
  sessionStorage.setItem('selectedyear', selectedYear);
  sessionStorage.setItem('selectedmonth', selectedMonth);
  sessionStorage.setItem('selectedday', selectedDay);
  /*Refresh the page*/
  location.reload();
}

// Event listener to handle form submission
const dateForm = document.getElementById('dateForm');
dateForm.addEventListener('submit', handleSubmit);

function loadview(){
  const calendarDiv = document.getElementById('calendartable');
  calendarDiv.innerHTML = "";
  switch (sessionStorage.getItem('view')) {
    case "month": /*Month*/
      const calendarTable = createCalendarMonth(sessionStorage.getItem("selectedyear"), sessionStorage.getItem("selectedmonth"));
      calendarDiv.appendChild(calendarTable);
      break;
    
    case "week": /*Week*/
      const calendarTable2 = createCalendarWeek(sessionStorage.getItem("selectedyear"), sessionStorage.getItem("selectedmonth"),sessionStorage.getItem("selectedday"));
      calendarDiv.appendChild(calendarTable2);
      break;

    case "day": /*Day*/
    const calendarTable3 = createCalendarDay(sessionStorage.getItem("selectedyear"), sessionStorage.getItem("selectedmonth"),sessionStorage.getItem("selectedday"));
    calendarDiv.appendChild(calendarTable3);
      break;
    
    default:
      const calendarTable4 = createCalendarMonth(sessionStorage.getItem("selectedyear"), sessionStorage.getItem("selectedmonth"));
      calendarDiv.appendChild(calendarTable4);
      sessionStorage.setItem("view","month");
      break;
  }
}

function getDaysInMonth(year, month) {
  // Return the number of days in a given month (month is 0-indexed)
  return new Date(year, month, 0).getDate();
}

function createCalendarMonth(year, month) {
  // Create a new Date object with the given year and month (month is 0-indexed)
  const firstDayOfMonth = new Date(year+"-"+month+"-"+"01");

  // Get the first day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const firstDayOfWeek = firstDayOfMonth.getDay();

  // Create the calendar table
  const table = document.createElement('calendertable');
  table.style.borderCollapse = 'collapse';

  // Create the table header with day names
  const headerRow = document.createElement('tr');
  const daysOfWeek = ['Sun','Mon','Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 0; i < 7; i++) {
      const headerCell = document.createElement('th');
      headerCell.textContent = daysOfWeek[i];
      headerCell.style.border = '1px solid black';
      headerCell.style.padding = '5px';
      headerRow.appendChild(headerCell);
  }

  table.appendChild(headerRow);

  // Create the table rows for the days in the month
  const daysInMonth2 = getDaysInMonth(year, month);
  let currentDate = 1;

  for (let row = 0; row < 6; row++) {
      const tableRow = document.createElement('tr');

      for (let col = 0; col < 7; col++) {
          const tableCell = document.createElement('td');

          if (row === 0 && col < firstDayOfWeek) {
              // Empty cell before the first day of the month
              tableCell.textContent = '';
          } else if (currentDate > daysInMonth2) {
              // Empty cell after the last day of the month
              tableCell.textContent = '';
          } else {
              // Display the current date
              tableCell.textContent = currentDate;
              currentDate++;
          }

          tableCell.style.border = '1px solid black';
          tableCell.style.padding = '5px';
          tableRow.appendChild(tableCell);
      }

      table.appendChild(tableRow);
  }

  return table;
}

function createCalendarWeek(year, month, day) {
  // Create the calendar table
  const table = document.createElement('calendertable');
  table.style.borderCollapse = 'collapse';

  // Create the table header with day names
  const headerRow = document.createElement('tr');
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 0; i < 7; i++) {
    const headerCell = document.createElement('th');
    headerCell.textContent = daysOfWeek[i];
    headerCell.style.border = '1px solid black';
    headerCell.style.padding = '5px';
    headerRow.appendChild(headerCell);
  }
  table.appendChild(headerRow);

  // Calculate the start and end dates for the week
  const startDate = new Date(year+"-"+month+"-"+day);
  const firstdateofweek = new Date(startDate.valueOf(startDate) - startDate.getDay()* Lengthofday);
  
  // Populate the table cells with the dates for the week
  const tableRow = document.createElement('tr');

  for (let col = 0; col < 7; col++) {
    const tableCell = document.createElement('td');
    const dateValue = new Date(firstdateofweek.valueOf(firstdateofweek) + col * Lengthofday).getDate();
    tableCell.textContent = dateValue;

    tableCell.style.border = '1px solid black';
    tableCell.style.padding = '5px';
    tableRow.appendChild(tableCell);
  }

  table.appendChild(tableRow);
  return table;
}

function createCalendarDay(year,month,day) {
  // Create the calendar table
  const table = document.createElement('calendertable');
  table.style.borderCollapse = 'collapse';
  const currentdate = new Date(year+"-"+month+"-"+day);
  const headerRow = document.createElement('tr');
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const headerCell = document.createElement('th');
  headerCell.textContent = daysOfWeek[currentdate.getDay()];
  headerCell.style.border = '1px solid black';
  headerCell.style.padding = '5px';
  headerRow.appendChild(headerCell);
  table.appendChild(headerRow);

  // Populate the table cells with the dates for the week
  const tableRow = document.createElement('tr');

    const tableCell = document.createElement('td');
    tableCell.textContent = currentdate.getDate();

    tableCell.style.border = '1px solid black';
    tableCell.style.padding = '5px';
    tableRow.appendChild(tableCell);

  table.appendChild(tableRow);

  return table;
}


function setmonthview(){
  sessionStorage.setItem("view","month");
  loadview();
}

function setweekview(){
  sessionStorage.setItem("view","week");
  loadview();
}

function setdayview(){
  sessionStorage.setItem("view","day");
  loadview();
}

loadview();

function goforthinview(){
  switch (sessionStorage.getItem("view")) {
    case "month":
      
      const countmonth = parseInt(sessionStorage.getItem("selectedmonth"));
      if (countmonth === 12) {
        countyear = parseInt(sessionStorage.getItem("selectedyear"));
        sessionStorage.setItem("selectedyear", (countyear+1).toString() );
        sessionStorage.setItem("selectedmonth",monthsvalue[0]);
      }
      else if (countmonth < 9){
        sessionStorage.setItem("selectedmonth","0"+(countmonth+1).toString());
      }
      else {
        sessionStorage.setItem("selectedmonth",(countmonth+1).toString());
      }
      break;
  
    case "week":
      const currentdate = new Date(sessionStorage.getItem("selectedyear")+"-"+sessionStorage.getItem("selectedmonth")+"-"+sessionStorage.getItem("selectedday"));
      const nextdate = new Date(currentdate.valueOf(currentdate) + 7*Lengthofday);
      sessionStorage.setItem("selectedyear",nextdate.getFullYear());
      sessionStorage.setItem("selectedmonth",monthsvalue[nextdate.getMonth()]);
      if (nextdate.getDate() < 10) {
        sessionStorage.setItem("selectedday","0"+(nextdate.getDate()).toString());
      }
      else{
        sessionStorage.setItem("selectedday",nextdate.getDate().toString());
      }
      break;

    case "day":
      const currentdate2 = new Date(sessionStorage.getItem("selectedyear")+"-"+sessionStorage.getItem("selectedmonth")+"-"+sessionStorage.getItem("selectedday"));
      const nextdate2 = new Date(currentdate2.valueOf(currentdate2) + Lengthofday);

      sessionStorage.setItem("selectedyear",nextdate2.getFullYear());
      sessionStorage.setItem("selectedmonth",monthsvalue[nextdate2.getMonth()])
      if (parseInt(nextdate2.getDate) < 10) {
        sessionStorage.setItem("selectedday","0"+nextdate2.getDate());
      }
      else{
      sessionStorage.setItem("selectedday",nextdate2.getDate());
      }
      break;

    default:

      break;
  }
  selectOptionCreateMonth(selectmonth,months,monthsvalue);
  selectOptionCreateYear();
  loadview();
}

function gobackinview(){
  switch (sessionStorage.getItem("view")) {
    case "month":
      
      const countmonth = parseInt(sessionStorage.getItem("selectedmonth"));
      if (countmonth === 0) {
        countyear = parseInt(sessionStorage.getItem("selectedyear"));
        sessionStorage.setItem("selectedyear", (countyear-1).toString() );
        sessionStorage.setItem("selectedmonth",monthsvalue[11]);
      }
      else if (countmonth < 11){
        sessionStorage.setItem("selectedmonth","0"+(countmonth-1).toString());
      }
      else {
        sessionStorage.setItem("selectedmonth",(countmonth-1).toString());
      }
      break;
  
    case "week":
      const currentdate = new Date(sessionStorage.getItem("selectedyear")+"-"+sessionStorage.getItem("selectedmonth")+"-"+sessionStorage.getItem("selectedday"));
      const nextdate = new Date(currentdate.valueOf(currentdate) - 7*Lengthofday);
      sessionStorage.setItem("selectedyear",nextdate.getFullYear());
      sessionStorage.setItem("selectedmonth",monthsvalue[nextdate.getMonth()]);
      if (nextdate.getDate() < 10) {
        sessionStorage.setItem("selectedday","0"+(nextdate.getDate()).toString());
      }
      else{
        sessionStorage.setItem("selectedday",nextdate.getDate().toString());
      }
      break;

    case "day":
      const currentdate2 = new Date(sessionStorage.getItem("selectedyear")+"-"+sessionStorage.getItem("selectedmonth")+"-"+sessionStorage.getItem("selectedday"));
      const nextdate2 = new Date(currentdate2.valueOf(currentdate2) - Lengthofday);

      sessionStorage.setItem("selectedyear",nextdate2.getFullYear());
      sessionStorage.setItem("selectedmonth",monthsvalue[nextdate2.getMonth()])
      if (parseInt(nextdate2.getDate) < 10) {
        sessionStorage.setItem("selectedday","0"+nextdate2.getDate());
      }
      else{
      sessionStorage.setItem("selectedday",nextdate2.getDate());
      }
      break;

    default:

      break;
  }
  selectOptionCreateMonth(selectmonth,months,monthsvalue);
  selectOptionCreateYear();
  loadview();
}

/* Checkbox for allday */
function regulatetimespan(){
  const bool = document.getElementById("ReservationAllday").checked;

  if(bool){
    document.getElementById("timespan").style.display="none";
  }
  else{
    document.getElementById("timespan").style.display="block";
  }
}

/* Show timespan div for a reservation submit */
function showtimespan(){
  document.getElementById("timespan").style.display="block";
}

/* Hide timespan div for a reservation submit */
function hidetimespan(){
  document.getElementById("timespan").style.display="none";
}

/*Max amount of years for reservation form*/
function getMaxDate() {
  const today = new Date();
  const maxDate = new Date(today.getFullYear() + 50, today.getMonth(), today.getDate());
  return maxDate.toISOString().split('T')[0];
}

document.addEventListener('DOMContentLoaded', function () {
  const eventDateInput = document.getElementById("ReservationDate");
  eventDateInput.setAttribute('max', getMaxDate());
});

function openreservation(){
  document.getElementById("reservationsystem").style.display = 'block';
}

function cancelreservation(){
  document.getElementById("ReservationDate").value = "";
  document.getElementById("ReservationDescription").value = "";
  document.getElementById("ReservationImage").value = "";
  document.getElementById("ReservationLocation").value = "";
  document.getElementById("reservationsystem").style.display = 'none';
  document.getElementById("ReservationTitle").value = "";
}

function checktimespan(){
  const startTimeInput = document.getElementById('ReservationBegin');
  const endTimeInput = document.getElementById('ReservationEnd');

      // Get the values from the input fields (time format is "HH:mm")
      const startTimeValue = startTimeInput.value;
      const endTimeValue = endTimeInput.value;

      // Create Date objects with a common date (today) and the time values
      const startDate = new Date(`2000-01-01T${startTimeValue}`);
      const endDate = new Date(`2000-01-01T${endTimeValue}`);

      // Compare the Date objects to check if the first time is before the second
      if (startDate < endDate) {
        showsubmit();
      } else if (startDate > endDate) {
        hidesubmit();
      }
      else{
        showsubmit();
      }
}


/* Show reservation submit div */
function showsubmit(){
  document.getElementById("reservationsubmit").style.display = "block";
  document.getElementById("timespanincorrect").innerHTML = "";
}

/* Hide reservation submit div */
function hidesubmit(){
  document.getElementById("reservationsubmit").style.display = "none";
  document.getElementById("timespanincorrect").innerHTML = "Your timespan is incorrect";
}

function submitreservation(){
  /*Check how many reservations date has*/
  /* id und username und datum, id nur für jeden Tag also für jeden tag mehrere ID*/ 
  event.preventDefault(); // Prevent the default form submission behavior
  
  title = document.getElementById("ReservationTitle").value;
  location = document.getElementById("ReservationLocation").value;
  day = document.getElementById("ReservationDate").value;
  timebegin = document.getElementById("ReservationBegin").value;
  timeend = document.getElementById("ReservationEnd").value;
  allday = document.getElementById("ReservationAllday").checked;
  description = document.getElementById("ReservationDescription").value;

  const accountname = localStorage.getItem("registration");
  var request = new XMLHttpRequest();
  request.open("POST","http://dhbw.radicalsimplicity.com/88${accountname}/events");
    request.onreadystatechange = () => {  
    if (request.readyState == XMLHttpRequest.DONE) {
        const status = request.status;
        if (status == 0 || status == 200) {
            tablechange(JSON.parse(request.responseText));
            /* Use json object from text file */
        }
    }
}
request.send()

}


