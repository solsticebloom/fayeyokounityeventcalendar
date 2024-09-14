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
var inputDate = $(this).data();
var today = year + "-" + month + "-" + day;

// Set default events
function defaultEvents(dataDay, dataName, dataNotes, classTag) {
  var date = $('*[data-day="' + dataDay + '"]');
  date.attr("data-name", dataName);
  date.attr("data-notes", dataNotes);
  date.addClass("event");
  date.addClass("event--" + classTag);
}

// Functions control
todayBtn.on("click", function() {
  if (month < indexMonth) {
    var step = indexMonth % month;
    movePrev(step, true);
  } else if (month > indexMonth) {
    var step = month - indexMonth;
    moveNext(step, true);
  }
});

dataCel.each(function() {
  if ($(this).data("day") === today) {
    $(this).addClass("isToday");
    fillEventSidebar($(this));
  }
});

addBtn.on("click", function() {
  winCreator.addClass("isVisible");
  $("body").addClass("overlay");
  dataCel.each(function() {
    if ($(this).hasClass("isSelected")) {
      today = $(this).data("day");
      $("input[name=date]").val(today);
    } else {
      $("input[name=date]").val(today);
    }
  });
});

closeBtn.on("click", function() {
  winCreator.removeClass("isVisible");
  $("body").removeClass("overlay");
});

saveBtn.on("click", function() {
  var inputName = $("input[name=name]").val();
  var inputDate = $("input[name=date]").val();
  var inputNotes = $("textarea[name=notes]").val();
  var inputTag = $("select[name=tags]").find(":selected").text();

  dataCel.each(function() {
    if ($(this).data("day") === inputDate) {
      if (inputName != null) {
        $(this).attr("data-name", inputName);
      }
      if (inputNotes != null) {
        $(this).attr("data-notes", inputNotes);
      }
      $(this).addClass("event"); // Add event class
      if (inputTag != null) {
        $(this).addClass("event--" + inputTag); // Add specific event tag class
      }
      fillEventSidebar($(this));
    }
  });

  winCreator.removeClass("isVisible");
  $("body").removeClass("overlay");
  $("#addEvent")[0].reset();
});


  winCreator.removeClass("isVisible");
  $("body").removeClass("overlay");
  $("#addEvent")[0].reset();
});

function fillEventSidebar(self) {
  $(".c-aside__event").remove();
  var thisName = self.attr("data-name");
  var thisNotes = self.attr("data-notes");
  var thisImportant = self.hasClass("event--important");
  var thisBirthday = self.hasClass("event--birthday");
  var thisFestivity = self.hasClass("event--festivity");
  var thisEvent = self.hasClass("event");

  switch (true) {
    case thisImportant:
      $(".c-aside__eventList").append(
        "<p class='c-aside__event c-aside__event--important'>" +
        thisName + " <span> • " + thisNotes + "</span></p>"
      );
      break;
    case thisBirthday:
      $(".c-aside__eventList").append(
        "<p class='c-aside__event c-aside__event--birthday'>" +
        thisName + " <span> • " + thisNotes + "</span></p>"
      );
      break;
    case thisFestivity:
      $(".c-aside__eventList").append(
        "<p class='c-aside__event c-aside__event--festivity'>" +
        thisName + " <span> • " + thisNotes + "</span></p>"
      );
      break;
    case thisEvent:
      $(".c-aside__eventList").append(
        "<p class='c-aside__event'>" +
        thisName + " <span> • " + thisNotes + "</span></p>"
      );
      break;
  }
}

dataCel.on("click", function() {
  var thisEl = $(this);
  var thisDay = $(this).attr("data-day").slice(8);
  var thisMonth = $(this).attr("data-day").slice(5, 7);

  fillEventSidebar($(this));

  $(".c-aside__num").text(thisDay);
  $(".c-aside__month").text(monthText[thisMonth - 1]);

  dataCel.removeClass("isSelected");
  thisEl.addClass("isSelected");
});

function moveNext(fakeClick, indexNext) {
  for (var i = 0; i < fakeClick; i++) {
    $(".c-main").css({ left: "-=100%" });
    $(".c-paginator__month").css({ left: "-=100%" });
    if (indexNext) {
      indexMonth += 1;
    }
  }
}

function movePrev(fakeClick, indexPrev) {
  for (var i = 0; i < fakeClick; i++) {
    $(".c-main").css({ left: "+=100%" });
    $(".c-paginator__month").css({ left: "+=100%" });
    if (indexPrev) {
      indexMonth -= 1;
    }
  }
}

function buttonsPaginator(buttonId, mainClass, monthClass, next, prev) {
  if (next) {
    $(buttonId).on("click", function() {
      if (indexMonth >= 2) {
        $(mainClass).css({ left: "+=100%" });
        $(monthClass).css({ left: "+=100%" });
        indexMonth -= 1;
      }
    });
  }
  if (prev) {
    $(buttonId).on("click", function() {
      if (indexMonth <= 11) {
        $(mainClass).css({ left: "-=100%" });
        $(monthClass).css({ left: "-=100%" });
        indexMonth += 1;
      }
    });
  }
}

buttonsPaginator("#next", monthEl, ".c-paginator__month", false, true);
buttonsPaginator("#prev", monthEl, ".c-paginator__month", true, false);

moveNext(indexMonth - 1, false);

$(".c-aside__num").text(day);
$(".c-aside__month").text(monthText[month - 1]);

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

saveBtn.on("click", function() {
  // Your existing code for saving an event...
  saveEventToLocalStorage();
});

function loadEventsFromLocalStorage() {
  let events = JSON.parse(localStorage.getItem('calendarEvents')) || [];

  events.forEach(event => {
    defaultEvents(event.day, event.name, event.notes, event.tag.replace('event--', ''));
  });
}

// Call this function when initializing the calendar
loadEventsFromLocalStorage();
