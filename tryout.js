// script.js
const calendarBody = document.getElementById("calendar-body");
const events = [
  { id: 1, date: "2023-08-15", title: "Event 1" },
  { id: 2, date: "2023-08-15", title: "Event 2" },
  { id: 15, date: "2023-08-15", title: "Event 15" },
  { id: 3, date: "2023-08-17", title: "Event 3" },
  // Add more events
];

function openEvent(id) {
  console.log(`Opening event with ID ${id}`);
  // Add your logic to handle opening the event details here
}

function populateCalendar() {
  for (let i = 1; i <= 31; i++) {
    const dayCell = document.createElement("td");
    const eventContainer = document.createElement("div");
    eventContainer.className = "event-container";

    events.forEach(event => {
      if (event.date === `2023-08-${i.toString().padStart(2, '0')}`) {
        const eventItem = document.createElement("div");
        eventItem.className = "event";
        eventItem.textContent = event.title;
        eventItem.addEventListener("click", () => openEvent(event.id));
        eventContainer.appendChild(eventItem);
      }
    });

    dayCell.textContent = i;
    dayCell.appendChild(eventContainer);
    calendarBody.appendChild(dayCell);
  }
}

populateCalendar();
