// pomodoro timer
var POMODORO = "POMODORO";
var BREAK = "BREAK";
var alarm = new Audio("https://www.shockwave-sound.com/sound-effects/windchimes-sounds/bluebird.wav");
var pomTimer = {
  mode: POMODORO,
  duration: 0,
  interval: null,
  pomodoros: 0,
  set: function() {
    if (this.mode === POMODORO) {
      this.duration = 25;
    } else if (this.mode === BREAK) {
      this.duration = 5;
    }
    timerText(this.duration, 0);
    return this;
  },
  start: function() {
    var startTime = new Date().getTime();
    function timer() {
      var elapsedSecs = Math.floor((new Date().getTime() - startTime) / 1000);
      var remainingMins = this.duration - Math.ceil(elapsedSecs / 60);
      var remainingSecs = 60 - elapsedSecs % 60;
      timerText(remainingMins, remainingSecs);
      if (remainingMins <= 0 && remainingSecs <= 0) {
        this.stop().onEnd();
      }
    }
    this.interval = setInterval(timer.bind(this), 200);
    return this;
  },
  stop: function() {
    clearInterval(this.interval);
    this.interval = null;
    return this;
  },
  reset: function() {
    timerText(this.duration, 0);
    return this;
  },
  onEnd: function() {
    if (this.mode === POMODORO) {
      this.pomodoros++;
      this.mode = BREAK;
    } else if (this.mode === BREAK) {
      this.mode = POMODORO;
    }  
    alarm.play();
    updateButtonText();
  }
};

function timerText(min, sec) {
  function timeNumToString(n) {
    var string = '';
    if (n < 10) {
      string += '0' + n;
    } else {
      string += n;
    }
    if (string === "60") {
      string = "00";
    }
    return string;
  }
  document.getElementById("pomodoro-timer-min").innerText = timeNumToString(
    min
  );
  document.getElementById("pomodoro-timer-sec").innerText = timeNumToString(
    sec
  );
}

function updateButtonText() {
  var text = "";
  if (!pomTimer.interval) {
    text += "start ";
  } else {
    text += "reset ";
  }
  text += pomTimer.mode;
  document.getElementById("pomodoro-button").innerText = text;
}

function onButtonPress() {
  if (!pomTimer.interval) {
    pomTimer.set().start();
  } else {
    pomTimer.stop().reset();
  }
  updateButtonText();
}
document
  .getElementById("pomodoro-button")
  .addEventListener("click", onButtonPress);

// to-do-list
var clear = document.querySelector(".clear");
var list = document.getElementById("list");
var input = document.getElementById("input");
var CHECK = "fa-check-circle";
var UNCHECK = "tomato";
var LINE_THROUGH = "lineThrough";
var LIST, id;
var data = localStorage.getItem("TODO");

clear.addEventListener("click", function() {
  localStorage.clear();
  location.reload();
});

function addTask(toDo, id, done, trash) {    
  if (trash) {
    return;
  }
  var DONE;
  if (done) {
    DONE = CHECK;
  } else {
    DONE = UNCHECK;
  }
  var LINE;
  if (done) {
    LINE = LINE_THROUGH;
  } else {
    LINE = '';
  }
  var item = `<li class="item">
                <img class="fa ${DONE} co" src="image/tomato.svg" job="complete" id="${id}"></i>
                <p class="text ${LINE}">${toDo}</p>
                <i class="fa fa-times-circle de" job="delete" id="${id}"></i>
              </li>
            `;
  var position = "beforeend";
  list.insertAdjacentHTML(position, item);
}

function display(array) {
  array.forEach(function(item) {
    addTask(item.name, item.id, item.done, item.trash);
  });
}

if (data) {
  LIST = JSON.parse(data);
  id = LIST.length;
  display(LIST);
} else {
  LIST = [];
  id = 0;
}

document.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    var toDo = input.value;    
    if (toDo) {
      addTask(toDo, id, false, false);
      LIST.push({
        name: toDo,
        id: id,
        done: false,
        trash: false,
      });
      localStorage.setItem("TODO", JSON.stringify(LIST));
      id++;
    }
    input.value = "";
  }
});

function completeTask(element) {
  element.classList.toggle(CHECK);
  element.classList.toggle(UNCHECK);
  element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);  
  if (LIST[element.id].done) {
    LIST[element.id].done = false;
  } else {
    LIST[element.id].done = true;
  }
}

function removeTask(element) {
  element.parentNode.parentNode.removeChild(element.parentNode);
  LIST[element.id].trash = true;
}

list.addEventListener("click", function (event) {
  var element = event.target;
  var elementJob = element.attributes.job.value;
  if (elementJob === "complete") {
    completeTask(element);
  } else if (elementJob === "delete") {
    removeTask(element);
  }
  localStorage.setItem("TODO", JSON.stringify(LIST));
});