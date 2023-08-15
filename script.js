const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const monthsname = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const monthsvalue =["01","02","03","04","05","06","07","08","09","10","11","12"];

const selectyear = document.getElementById('YearDateSelect');
const selectmonth = document.getElementById('MonthDateSelect');
const selectday = document.getElementById('DayDateSelect');
const Lengthofday = 8.64e+7;

console.log(localStorage.getItem("registration"));
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

selectOptionCreateMonth(selectmonth,monthsname,monthsvalue);

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

async function loadview(){
  const calendarDivMonth = document.getElementById('calendartablemonth');
  const calendarDivWeek = document.getElementById('calendartableweek');
  const calendarDivDay = document.getElementById('calendartableday');
  calendarDivMonth.innerHTML = "";
  calendarDivWeek.innerHTML = "";
  calendarDivDay.innerHTML = "";
  calendarDivMonth.style.display = "none";
  calendarDivWeek.style.display = "none";
  calendarDivDay.style.display = "none";
  switch (sessionStorage.getItem('view')) {
    case "month": /*Month*/
      const calendarTable = await createCalendarMonth(sessionStorage.getItem("selectedyear"), sessionStorage.getItem("selectedmonth"));
      calendarDivMonth.appendChild(calendarTable);
      calendarDivMonth.style.display = "block";
      break;
    
    case "week": /*Week*/
      const calendarTable2 = await createCalendarWeek(sessionStorage.getItem("selectedyear"), sessionStorage.getItem("selectedmonth"),sessionStorage.getItem("selectedday"));
      calendarDivWeek.appendChild(calendarTable2);
      calendarDivWeek.style.display = "block";
      break;

    case "day": /*Day*/
    const calendarTable3 = await createCalendarDay(sessionStorage.getItem("selectedyear"), sessionStorage.getItem("selectedmonth"),sessionStorage.getItem("selectedday"));
    calendarDivDay.appendChild(calendarTable3);
    calendarDivDay.style.display = "block";
      break;
    
    default:
      const calendarTable4 = await createCalendarMonth(sessionStorage.getItem("selectedyear"), sessionStorage.getItem("selectedmonth"));
      calendarDivMonth.appendChild(calendarTable4);
      sessionStorage.setItem("view","month");
      calendarDivMonth.style.display = "block";
      break;
  }
}

function getDaysInMonth(year, month) {
  // Return the number of days in a given month (month is 0-indexed)
  return new Date(year, month, 0).getDate();
}

async function createCalendarMonth(year, month) {
  // Create a new Date object with the given year and month (month is 0-indexed)
  const firstDayOfMonth = new Date(year+"-"+month+"-"+"01");

  // Get the first day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const firstDayOfWeek = firstDayOfMonth.getDay();

  const reservations = await getallReservations(); // Await the promise to get the data

  // Create the calendar table
  const table = document.createElement('calendartable');
  table.style.borderCollapse = 'collapse';

  // Create the table header with day names
  const headerRow = document.createElement('tr');
  const daysOfWeek = ['Sun','Mon','Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 0; i < 7; i++) {
      const headerCell = document.createElement('th');
      headerCell.textContent = daysOfWeek[i];
      if (i === 0) {
        headerCell.style.color = "#9c1a1a";
      }
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
              if (col === 0) {
                tableCell.style.color = "#9c1a1a";
              }
              let extra = "";
              if (currentDate < 10) {
                extra = "0"; /* Add '0' if date is single number */
              }
              let currentDatefull =  extra + currentDate;
              let fulldate = year + "-" + month + "-" + currentDatefull;
              /* fulldate variable simply is like the start/end attribute so YYYY-MM-DD */
              currentDate++;
              let count = 0;
              reservations.every(event => {
                if (count === 6) {
                    return false; /* Limit amount of shown events per day to 6 */
                }
                else if (event.start.slice(0,event.start.indexOf('T')) === fulldate) {

                  /* Seems dumb to create an eventContainer for each EventItem, however is necessary to list below each other */
                  const eventContainer = document.createElement("div");
                  eventContainer.className = "reservation-container-month";
                  const eventItem = document.createElement("div");
                  eventItem.className = "event-div-month";
                  if (event.imageurl !== null) {
                    const image = event.imageurl
                    eventItem.style.backgroundColor = "#f3f3f3";
                    eventItem.style.backgroundImage = "url("+image+")";
                    eventItem.style.backgroundSize = "cover"; // Resize the background image to cover the entire div
                    eventItem.style.backgroundPosition = "center"; // Center the background image within the div
                    eventItem.style.backgroundRepeat = "no-repeat"; // Prevent the background image from repeating
                  }
                  eventItem.textContent = event.title;
                  eventItem.addEventListener("click", () => open_current_reservation(event.id));

                  /* Append eventContainer to tableCell */
                  eventContainer.appendChild(eventItem);
                  tableCell.appendChild(eventContainer);
                  count++;
                  return true
                }
                return true;
              });
          }
          tableRow.appendChild(tableCell);
      }

      table.appendChild(tableRow);
  }

  return table;
}

async function createCalendarWeek(year, month, day) {
  // Create the calendar table
  const table = document.createElement('calendartable');

  const reservations = await getallReservations(); // Await the promise to get the data

  // Create the table header with day names
  const headerRow = document.createElement('tr');
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 0; i < 7; i++) {
    const headerCell = document.createElement('th');
    headerCell.textContent = daysOfWeek[i];
    if (i === 0) {
      headerCell.style.color = "#9c1a1a";
    }
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
    let count = 0;
    if (col === 0) {
      tableCell.style.color = "#9c1a1a";
    }
    reservations.every(event => {
      if (count === 6) {
          return false; /* Limit amount of shown events per day to 6 */
      }
      else if (event.start.slice(0,event.start.indexOf('T')) === new Date(firstdateofweek.valueOf(firstdateofweek) + col * Lengthofday).toISOString().split('T')[0] ) {

        /* Seems dumb to create an eventContainer for each EventItem, however is necessary to list below each other */
        const eventContainer = document.createElement("div");
        eventContainer.className = "reservation-container-week";

        const eventItem = document.createElement("div");
        eventItem.className = "event-div-week";
        eventItem.textContent = event.title;
        if (event.imageurl !== null) {
          const image = event.imageurl
          eventItem.style.backgroundColor = "#f3f3f3";
          eventItem.style.backgroundImage = "url("+image+")";
          eventItem.style.backgroundSize = "cover"; // Resize the background image to cover the entire div
          eventItem.style.backgroundPosition = "center"; // Center the background image within the div
          eventItem.style.backgroundRepeat = "no-repeat"; // Prevent the background image from repeating
        }
        eventItem.addEventListener("click", () => open_current_reservation(event.id));

        /* Append eventContainer to tableCell */
        eventContainer.appendChild(eventItem);
        tableCell.appendChild(eventContainer);
        count++;
        return true
      }
      return true;
    });

    tableRow.appendChild(tableCell);
  }

  table.appendChild(tableRow);
  return table;
}

async function createCalendarDay(year,month,day) {
  // Create the calendar table
  const table = document.createElement('calendartable');

  const reservations = await getallReservations(); // Await the promise to get the data

  const currentdate = new Date(year+"-"+month+"-"+day);
  const headerRow = document.createElement('tr');
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const headerCell = document.createElement('th');
  headerCell.textContent = daysOfWeek[currentdate.getDay()];
  headerRow.appendChild(headerCell);
  table.appendChild(headerRow);

  // Populate the table cells with the dates for the week
  const tableRow = document.createElement('tr');

    const tableCell = document.createElement('td');
    tableCell.textContent = currentdate.getDate();

    let count = 0;
              reservations.every(event => {
                if (count === 6) {
                    return false; /* Limit amount of shown events per day to 6 */
                }
                else if (event.start.slice(0,event.start.indexOf('T')) === currentdate.toISOString().split('T')[0]) {

                  /* Seems dumb to create an eventContainer for each EventItem, however is necessary to list below each other */
                  const eventContainer = document.createElement("div");
                  eventContainer.className = "reservation-container-day";

                  const eventItem = document.createElement("div");
                  eventItem.className = "event-div-day";
                  eventItem.textContent = event.title;
                  if (event.imageurl !== null) {
                    const image = event.imageurl
                    eventItem.style.backgroundColor = "#f3f3f3";
                    eventItem.style.backgroundImage = "url("+image+")";
                    eventItem.style.backgroundSize = "cover"; // Resize the background image to cover the entire div
                    eventItem.style.backgroundPosition = "center"; // Center the background image within the div
                    eventItem.style.backgroundRepeat = "no-repeat"; // Prevent the background image from repeating
                  }
                  eventItem.addEventListener("click", () => open_current_reservation(event.id));

                  /* Append eventContainer to tableCell */
                  eventContainer.appendChild(eventItem);
                  tableCell.appendChild(eventContainer);
                  count++;
                  return true
                }
                return true;
              });

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
  selectOptionCreateMonth(selectmonth,monthsname,monthsvalue);
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
  selectOptionCreateMonth(selectmonth,monthsname,monthsvalue);
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
        document.getElementById("ReservationBegin").required = true;
        document.getElementById("ReservationEnd").required = true;
      } else if (startDate > endDate) {
        hidesubmit();
        document.getElementById("ReservationBegin").required = false;
        document.getElementById("ReservationEnd").required = false;
      }
      else{
        showsubmit();
        document.getElementById("ReservationBegin").required = true;
        document.getElementById("ReservationEnd").required = true;
      }
}

/* Validate Image Input for Reservation */
function validateImage() {
    var fileInput = document.getElementById('ReservationImageNew');
  
    var file = fileInput.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
      } else {
        hidesubmit();
      }
    }
  }

/* Show reservation submit div */
function showsubmit(){
  document.getElementById("reservationsubmit").style.display = "block";
  document.getElementById("timespanincorrect").innerHTML = "";
}

/* Hide reservation submit div */

async function getparameterforcreate(){

  if (document.getElementById("ReservationAllday").checked) {
    return{

      title : document.getElementById("ReservationTitle").value,
      location : document.getElementById("ReservationLocation").value,
      organizer : "inf22125@lehre.dhbw-stuttgart.de",
      start : document.getElementById("ReservationDate").value + "T" + "00:00",
      end : document.getElementById("ReservationDate").value + "T" + "23:59",
      status : "Busy",
      allday : true,
      webpage : "nowebpage.com",
      imagedata: null,
      categories : [],
      extra : document.getElementById("ReservationDescription").value
    }
  }
  else{
    const timebegin = document.getElementById("ReservationBegin").value;
    const timeend = document.getElementById("ReservationEnd").value;

    return{
      title : document.getElementById("ReservationTitle").value,
      location : document.getElementById("ReservationLocation").value,
      organizer : "inf22125@lehre.dhbw-stuttgart.de",
      start : document.getElementById("ReservationDate").value + 'T' + timebegin,
      end : document.getElementById("ReservationDate").value + 'T' + timeend,
      status : "Busy",
      allday : false,
      webpage : "nowebpage.com",
      imagedata: null,
      categories : [],
      extra : document.getElementById("ReservationDescription").value
    }
  }
}

/* Convert image into url for backend using canvas */
function convertimage(number) {
  return new Promise((resolve, reject) => {
      let input = document.getElementById("ReservationImageNew");
      if (number === 1) {
        input = document.getElementById("ReservationImage");
      }
      if (input.files && input.files[0]) {
          const file = input.files[0];
          
          if (file.type.match('image.*')) {
              const reader = new FileReader();
              
              reader.onload = function(e) {
                  const img = new Image();
                  img.src = e.target.result;
                  
                  img.onload = function() {
                      const canvas = document.createElement("canvas");
                      const ctx = canvas.getContext("2d");
                      
                      canvas.width = img.width;
                      canvas.height = img.height;
                      
                      ctx.drawImage(img, 0, 0);
                      
                      const base64Image = canvas.toDataURL("image/jpeg"); // You can change the format if needed
                      resolve(base64Image);
                  };
              };
              
              reader.readAsDataURL(file);
          } else {
              reject("Selected file is not an image.");
          }
      }
  });
}



function hidesubmit(){
  document.getElementById("reservationsubmit").style.display = "none";
  document.getElementById("timespanincorrect").innerHTML = "Your timespan is incorrect";
}

  async function submitreservation(event){
    /*Check how many reservations date has*/
    /* id und username und datum, id nur für jeden Tag also für jeden tag mehrere ID*/ 
    event.preventDefault(); // Prevent the default form submission behavior
    
    parameter = await getparameterforcreate();
    cancelreservation();
    accountname = localStorage.getItem("registration");

    try{
      const request = await fetch(`http://dhbw.radicalsimplicity.com/calendar/88${accountname}/events`,{
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parameter)
      });
      console.log(request);
      if (request.status !== 200) {
        throw new Error(request.status);
      }
    }catch (error){
      console.log(error);
    }
      
}
// Event listener to handle form submission
document.getElementById("reservationform").addEventListener('submit', submitreservation);

async function AddImageToEvent(){

  const image = await AddImageToEventHelper();
  const accountname = localStorage.getItem("registration");
  const id = sessionStorage.getItem("current_event_id");

    try{
      const request = await fetch(`http://dhbw.radicalsimplicity.com/calendar/88${accountname}/images/${id}`,{
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(image)
      });
      console.log(request);
      loadview();
      if (request.status !== 200) {
        throw new Error(request.status);
      }
    }catch (error){
      console.log(error);
    }

}

async function AddImageToEventHelper(){

  image = await convertimage(0);

  return{
    imagedata : image
  }
}

async function DeleteImageFromEvent(){

  const accountname = localStorage.getItem("registration");
  const id = sessionStorage.getItem("current_event_id");

    try{
      const request = await fetch(`http://dhbw.radicalsimplicity.com/calendar/88${accountname}/images/${id}`,{
        method: "DELETE",

        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(request);
      loadview();
      if (request.status !== 200) {
        throw new Error(request.status);
      }
    }catch (error){
      console.log(error);
    }
    
}
/* Async function to get array of json as events*/
async function getallReservations() {
  
  const accountname = localStorage.getItem("registration");

  try {
      const response = await fetch(`http://dhbw.radicalsimplicity.com/calendar/88${accountname}/events`, {
          method: "GET", // Use GET method for retrieving data

          headers: {
              "Content-Type": "application/json",
          },
          // Note: GET requests typically don't have a request body
      });

      if (!response.ok) {
          throw new Error(`Request failed with status: ${response.status}`);
      }

      const data = await response.json();
      return data
  } catch (error) {
      console.error(error);
  }
}

/* Called to delete all Reservations based on the events getter */
async function deleteallHelper(data){

  const accountname = localStorage.getItem("registration");
  alert("All reservations deleted");

  for (let i = 0; i < data.length; i++){
    const event = data[i];
    const event_id = event.id;
    try {
      const response = await fetch(`http://dhbw.radicalsimplicity.com/calendar/88${accountname}/events/${event_id}`, {
          method: "DELETE", // Use DELETE method for retrieving data

          headers: {
              "Content-Type": "application/json",
          },
      });

      if (!response.ok) {
          throw new Error(`Request failed with status: ${response.status}`);
      }
  } catch (error) {
      console.error(error);
  }
  }
}

/* Called when DeleteAll Button is called */
async function deleteAllReservations(){
  const reservations = await getallReservations(); // Await the promise to get the data
  deleteallHelper(reservations);
  loadview();
}

/* Delete event by sessionstorage id, changed when clicking on event */
async function deletereservation(){
  const accountname = localStorage.getItem("registration");
  alert("reservation deleted");

  const id = sessionStorage.getItem("current_event_id");
    try {
      const response = await fetch(`http://dhbw.radicalsimplicity.com/calendar/88${accountname}/events/${id}`, {
          method: "DELETE", // Use DELETE method for retrieving data

          headers: {
              "Content-Type": "application/json",
          },
      });

      if (!response.ok) {
          throw new Error(`Request failed with status: ${response.status}`);
      }
      loadview();
      closereservationdiv();
  } catch (error) {
      console.error(error);
  }
  }

/* Open interface that shows details for current opened event */
async function open_current_reservation(id){

  data = await getreservationbyId(id);
  
  document.getElementById("openreservation-day").innerHTML = data.start.split('T')[0] + "  " + data.start.substring(data.start.indexOf('T') + 1) + "--" + data.end.substring(data.end.indexOf('T') + 1);
  document.getElementById("openreservation-title").innerHTML = data.title;
  document.getElementById("openreservation-location").innerHTML = data.location;
  document.getElementById("openreservation-description").innerHTML = data.extra;

  document.getElementById("openreservation").style.display = "block";
  sessionStorage.setItem("current_event_id",id);
}

/* GET current reservation with request */
async function getreservationbyId(id){

  const accountname = localStorage.getItem("registration");

  try {
      const response = await fetch(`http://dhbw.radicalsimplicity.com/calendar/88${accountname}/events/${id}`, {
          method: "GET", // Use GET method for retrieving data

          headers: {
              "Content-Type": "application/json",
          },
          // Note: GET requests typically don't have a request body
      });

      if (!response.ok) {
          throw new Error(`Request failed with status: ${response.status}`);
      }

      const data = await response.json();
      return data
  } catch (error) {
      console.error(error);
  }
}

/* Close the interface that shows details for current opened reservation */
function closereservationdiv(){
  document.getElementById("openreservation").style.display = "none";

  document.getElementById("openreservation-day").innerHTML = "";
  document.getElementById("openreservation-title").innerHTML = "";
  document.getElementById("openreservation-location").innerHTML = "";
  document.getElementById("openreservation-description").innerHTML = "";
  closemap();
}

let map = null; // Initialize the map variable

/* Opens Map by Leaflet based on Location entered with event */
async function openmap() {
  if (!map) {
    // If the map is not already open, create it
    document.getElementById("map").style.display = "block";
    const data = await getreservationbyId(sessionStorage.getItem("current_event_id"));
    const address = data.location;

    // Initialize the map
    map = L.map('map').setView([0, 0], 8);

    // Add an OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Use a geocoding service to convert the address to coordinates
    fetch(`https://nominatim.openstreetmap.org/search?q=${address}&format=json`)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          const location = data[0];
          const marker = L.marker([location.lat, location.lon]).addTo(map);
          marker.bindPopup(`<b>${address}</b>`).openPopup();
          map.setView([location.lat, location.lon], 12);
        } else {
          console.error("Address not found.");
        }
      })
      .catch(error => {
        console.error("Error:", error);
      });
  } else {
    // If the map is already open, just display the map container
    document.getElementById("map").style.display = "block";
  }
}

/* Close opened map */
function closemap() {
  if (map) {
    document.getElementById("map").style.display = "none";
    map.remove(); // Destroy the map instance
    map = null; // Reset the map variable
  }
}

