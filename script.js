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
var closeBtn = $(".js-event__close");
var winCreator = $(".js-event__creator");
var today = `${year}-${month}-${day}`;

// Initialize Calendar & Load Events
loadEventsFromLocalStorage();

// Set default events function
function defaultEvents(dataDay, dataName, dataNotes, classTag) {
  var date = $('*[data-day="' + dataDay + '"]');
  date.attr("data-name", dataName);
  date.attr("data-notes", dataNotes);
  date.addClass("event event--" + classTag);
}

// Today Button functionality
todayBtn.on("click", function() {
  if (month !== indexMonth) {
    const step = Math.abs(indexMonth - month);
    month < indexMonth ? movePrev(step, true) : moveNext(step, true);
  }
});

// Mark today's date and select it
dataCel.each(function() {
  if ($(this).data("day") === today) {
    $(this).addClass("isToday");
    fillEventSidebar($(this));
  }
});

// Add event button functionality
addBtn.on("click", function() {
  winCreator.addClass("isVisible");
  $("body").addClass("overlay");
  var selectedDay = $(".isSelected").data("day") || today;
  $("input[name=date]").val(selectedDay);
});

// Close event creator window
closeBtn.on("click", function() {
  winCreator.removeClass("isVisible");
  $("body").removeClass("overlay");
});

// Save new event
saveBtn.on("click", function() {
  var inputName = $("input[name=name]").val();
  var inputDate = $("input[name=date]").val();
  var inputNotes = $("textarea[name=notes]").val();
  var inputTag = $("select[name=tags]").find(":selected").text();

  dataCel.each(function() {
    if ($(this).data("day") === inputDate) {
      if (inputName) $(this).attr("data-name", inputName);
      if (inputNotes) $(this).attr("data-notes", inputNotes);
      $(this).addClass("event event--" + inputTag); // Add classes dynamically
      fillEventSidebar($(this));
    }
  });

  // Close event creator and reset form
  winCreator.removeClass("isVisible");
  $("body").removeClass("overlay");
  $("#addEvent")[0].reset(); // Reset the form

  // Save to localStorage
  saveEventToLocalStorage();
});

// Fill event details in the sidebar
function fillEventSidebar(self) {
  $(".c-aside__event").remove(); // Clear sidebar events
  var eventName = self.attr("data-name");
  var eventNotes = self.attr("data-notes");
  var eventTagClass = self.attr("class").split(' ').find(cls => cls.startsWith('event--'));

  var eventHTML = `<p class='c-aside__event ${eventTagClass}'>${eventName} <span> • ${eventNotes}</span></p>`;
  $(".c-aside__eventList").append(eventHTML);
}

// Highlight selected date and show its details
dataCel.on("click", function() {
  dataCel.removeClass("isSelected");
  $(this).addClass("isSelected");
  
  fillEventSidebar($(this));
  $(".c-aside__num").text($(this).attr("data-day").slice(8));
  $(".c-aside__month").text(monthText[$(this).attr("data-day").slice(5, 7) - 1]);
});

// Move to the next or previous month
function moveNext(steps, increment) {
  for (var i = 0; i < steps; i++) {
    $(".c-main, .c-paginator__month").css({ left: "-=100%" });
    if (increment) indexMonth++;
  }
}

function movePrev(steps, decrement) {
  for (var i = 0; i < steps; i++) {
    $(".c-main, .c-paginator__month").css({ left: "+=100%" });
    if (decrement) indexMonth--;
  }
}

// Buttons for navigation
buttonsPaginator("#next", monthEl, ".c-paginator__month", true, false);
buttonsPaginator("#prev", monthEl, ".c-paginator__month", false, true);

// Paginator button click handler
function buttonsPaginator(buttonId, mainClass, monthClass, next, prev) {
  $(buttonId).on("click", function() {
    if (next && indexMonth <= 11) {
      $(mainClass).css({ left: "-=100%" });
      $(monthClass).css({ left: "-=100%" });
      indexMonth++;
    }
    if (prev && indexMonth >= 2) {
      $(mainClass).css({ left: "+=100%" });
      $(monthClass).css({ left: "+=100%" });
      indexMonth--;
    }
  });
}

// Save events to localStorage
function saveEventToLocalStorage() {
  let events = [];

  dataCel.each(function() {
    if ($(this).hasClass("event")) {
      let event = {
        day: $(this).data("day"),
        name: $(this).data("name"),
        notes: $(this).data("notes"),
        tag: $(this).attr("class").split(' ').find(cls => cls.startsWith('event--'))
      };
      events.push(event);
    }
  });

  localStorage.setItem('calendarEvents', JSON.stringify(events));
}

// Load events from localStorage
function loadEventsFromLocalStorage() {
  let events = JSON.parse(localStorage.getItem('calendarEvents')) || [];
  events.forEach(event => {
    defaultEvents(event.day, event.name, event.notes, event.tag.replace('event--', ''));
  });
}

// Initial display of today's date
$(".c-aside__num").text(day);
$(".c-aside__month").text(monthText[month - 1]);
