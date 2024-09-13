// Global variables
var monthEl = $(".c-main");
var dataCel = $(".c-cal__cel");
var dateObj = new Date();
var month = dateObj.getUTCMonth() + 1;
var day = dateObj.getUTCDate();
var year = dateObj.getUTCFullYear();
var monthText = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];
var indexMonth = month;
var todayBtn = $(".c-today__btn");
var addBtn = $(".js-event__add");
var saveBtn = $(".js-event__save");
var editBtn = $(".js-event__edit"); // New button
var deleteBtn = $(".js-event__delete"); // New button
var closeBtn = $(".js-event__close");
var winCreator = $(".js-event__creator");
var winEditor = $(".js-event__editor"); // New editor window
var today = year + "-" + month + "-" + day;
var currentSelectedDate = null; // Track selected date for editing

// Set default events
function defaultEvents(event) {
  var date = $('*[data-day="' + event.date + '"]');
  var eventMarkup = "<p class='c-aside__event'>" + event.name + " • " + event.notes + "</p>";
  date.append(eventMarkup);
  date.addClass("event");
}

// Function to add an event
function addEvent(date, name, notes, tag) {
  let events = JSON.parse(localStorage.getItem('calendarEvents')) || {};
  if (!events[date]) {
    events[date] = [];
  }
  events[date].push({ name, notes, tag });
  localStorage.setItem('calendarEvents', JSON.stringify(events));
  updateCalendarUI();
}

// Function to delete an event
function deleteEvent(date, eventIndex) {
  let events = JSON.parse(localStorage.getItem('calendarEvents')) || {};
  if (events[date]) {
    events[date].splice(eventIndex, 1);
    if (events[date].length === 0) {
      delete events[date];
    }
    localStorage.setItem('calendarEvents', JSON.stringify(events));
    updateCalendarUI();
  }
}

// Function to edit an event
function editEvent(date, eventIndex, newName, newNotes, newTag) {
  let events = JSON.parse(localStorage.getItem('calendarEvents')) || {};
  if (events[date]) {
    events[date][eventIndex] = { name: newName, notes: newNotes, tag: newTag };
    localStorage.setItem('calendarEvents', JSON.stringify(events));
    updateCalendarUI();
  }
}

// Fill the sidebar with events for the selected day
function fillEventSidebar(date) {
  $(".c-aside__eventList").empty();
  let events = JSON.parse(localStorage.getItem('calendarEvents')) || {};
  if (events[date]) {
    events[date].forEach((event, index) => {
      $(".c-aside__eventList").append(
        "<p class='c-aside__event' data-index='" + index + "'>" +
        event.name + " • " + event.notes + " <button class='js-event__edit'>Edit</button> <button class='js-event__delete'>Delete</button>" +
        "</p>"
      );
    });
  }
}

// Update the UI with events from localStorage
function updateCalendarUI() {
  $(".c-cal__cel").removeClass("event").empty(); // Clear all event cells
  let events = JSON.parse(localStorage.getItem('calendarEvents')) || {};
  for (let date in events) {
    events[date].forEach(event => {
      defaultEvents({ date, ...event });
    });
  }
}

// Event handler for adding an event
saveBtn.on("click", function() {
  var inputName = $("input[name=name]").val();
  var inputDate = $("input[name=date]").val();
  var inputNotes = $("textarea[name=notes]").val();
  var inputTag = $("select[name=tags]").find(":selected").text();

  if (inputName && inputDate) {
    addEvent(inputDate, inputName, inputNotes, inputTag);
    winCreator.removeClass("isVisible");
    $("body").removeClass("overlay");
    $("#addEvent")[0].reset();
  }
});

// Event handler for deleting an event
$(document).on("click", ".js-event__delete", function() {
  var eventIndex = $(this).closest(".c-aside__event").data("index");
  deleteEvent(currentSelectedDate, eventIndex);
});

// Event handler for editing an event
$(document).on("click", ".js-event__edit", function() {
  var eventIndex = $(this).closest(".c-aside__event").data("index");
  let events = JSON.parse(localStorage.getItem('calendarEvents'))[currentSelectedDate];
  var event = events[eventIndex];
  
  $("input[name=name]").val(event.name);
  $("input[name=date]").val(currentSelectedDate);
  $("textarea[name=notes]").val(event.notes);
  $("select[name=tags]").val(event.tag);

  saveBtn.off("click").on("click", function() {
    editEvent(currentSelectedDate, eventIndex, $("input[name=name]").val(), $("textarea[name=notes]").val(), $("select[name=tags]").val());
    winCreator.removeClass("isVisible");
    $("body").removeClass("overlay");
    $("#addEvent")[0].reset();
  });

  winCreator.addClass("isVisible");
});

// Event handler for selecting a date
dataCel.on("click", function() {
  var selectedDate = $(this).data("day");
  currentSelectedDate = selectedDate;
  $(".c-aside__num").text(selectedDate.split('-')[2]);
  $(".c-aside__month").text(monthText[selectedDate.split('-')[1] - 1]);

  fillEventSidebar(selectedDate);
  dataCel.removeClass("isSelected");
  $(this).addClass("isSelected");
});

// Initialize the calendar
$(document).ready(function() {
  updateCalendarUI();
});
