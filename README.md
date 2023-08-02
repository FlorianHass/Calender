# Calender
Calender for Webengineering Course

1. `selectOptionCreateMonth(selectElement, stringArray, datearray)`: This function populates the month selection dropdown with options from the `months` array. If a selected month is stored in the session, it sets the dropdown's value accordingly.

2. Event listener for `selectmonth`: When the month selection is changed, it triggers the `reloadDaysFromMonth` function to update the days in the day selection dropdown based on the selected month.

3. `reloadDaysFromMonth(selectedMonth)`: This function populates the day selection dropdown based on the number of days in the selected month.

4. Event listener for `selectday`: Saves the selected day value in the session when the day selection is changed.

5. `selectOptionCreateYear()`: This function populates the year selection dropdown with options for the past 50 years and the next 50 years. If a selected year is stored in the session, it sets the dropdown's value accordingly.

6. Event listener for `selectyear`: Saves the selected year value in the session when the year selection is changed.

7. `returndate()`: This function returns the selected date from the session if available; otherwise, it returns the current date.

8. `handleSubmit(event)`: This function handles the form submission and updates the global `date` variable based on the selected year, month, and day. It also reloads the page after form submission.

9. Event listener for the form submission (`dateForm`): Triggers the `handleSubmit` function when the form is submitted.

10. `loadview()`: This function is responsible for displaying the appropriate view based on the `view` stored in the session.

11. `getDaysInMonth(year, month)`: Returns the number of days in a given month (accounting for leap years).

12. `createCalendarMonth(year, month)`: Generates a calendar table for the selected month, displaying the days of the month in a grid format.

13. `createCalendarWeek(year, month, day)`: Generates a calendar table for a week starting from the provided `year`, `month`, and `day`. It displays the dates of the week in a single row.

14. `createCalendarDay(year, month, day)`: Generates a calendar table for a day based on the provided `year`, `month`, and `day`. It displays only the selected date.

15. `setmonthview()`, `setweekview()`, `setdayview()`: These functions are used to set the `view` in the session and then call `loadview()` to display the appropriate view.

16. `loadview()`: Initially loads the appropriate view based on the `view` stored in the session or defaults to the month view.

The script uses these functions to create a dynamic date selection calendar that allows the user to choose a date from a year, month, and day dropdown. The selected date is displayed in a table with different views based on the selected option (`month`, `week`, or `day`).