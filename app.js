let stopwatchInterval;
let elapsedTime = 0; // in seconds
let alarms = [];
let endAlarm;
let isPaused = false;

// Load the sound
let alarmSound = new Audio('alarm.mp3');

// Function to play the alarm sound
function playAlarm() {
  alarmSound.play();
}


// Load alarms from localStorage
alarms = JSON.parse(localStorage.getItem('alarms') || '[]');
alarms.forEach(alarm => {
  let li = document.createElement('li');
  li.textContent = formatTime(alarm);
  document.getElementById('alarmsList').appendChild(li);
});

// Load end alarm from localStorage
endAlarm = parseInt(localStorage.getItem('endAlarm'));

if (endAlarm) {
  document.getElementById('endAlarmInput').value = formatTime(endAlarm);
}

// Load logs from localStorage and group by date
let savedLogs = JSON.parse(localStorage.getItem('logs') || '{}');

for (let date in savedLogs) {
  if (Array.isArray(savedLogs[date])) {
    let totalForDate = savedLogs[date].reduce((acc, curr) => acc + curr, 0);

    let dateLi = document.createElement('li');
    dateLi.textContent = `${date} - Total: ${formatTime(totalForDate)}`;
    document.getElementById('logs').appendChild(dateLi);

    savedLogs[date].forEach(log => {
      let li = document.createElement('li');
      li.textContent = `   ${formatTime(log)}`;
      document.getElementById('logs').appendChild(li);
    });
  }
}



function pauseStopwatch() {
  if (!isPaused) {
    clearInterval(stopwatchInterval);
    isPaused = true;
  } else {
    startStopwatch();
    isPaused = false;
  }
}

function stopStopwatch() {
  clearInterval(stopwatchInterval);
  logTime();
  resetStopwatch();
}

function startStopwatch() {
  stopwatchInterval = setInterval(() => {
    elapsedTime++;
    document.getElementById('stopwatch').textContent = formatTime(elapsedTime);

    // Check alarms
    for (let alarm of alarms) {
      if (elapsedTime == alarm) {
        playAlarm();  // <-- Play the alarm sound

        clearInterval(stopwatchInterval);
        if (confirm('Alarm! Do you want to continue?')) {
          startStopwatch();
        } else {
          logTime();
          resetStopwatch();
          return;
        }
      }
    }

// Check end alarm
    if (elapsedTime == endAlarm) {
      playAlarm();  // <-- Play the alarm sound

      clearInterval(stopwatchInterval);
      logTime();
      resetStopwatch();
      alert('End Alarm! Stopped.');
    }
  }, 1000);
}

function formatTime(seconds) {
  let mins = Math.floor(seconds / 60);
  let secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function addAlarm() {
  let timeInput = document.getElementById('alarmInput').value.split(':');
  let timeInSeconds = parseInt(timeInput[0]) * 60 + parseInt(timeInput[1]);
  alarms.push(timeInSeconds);

  let li = document.createElement('li');
  li.textContent = formatTime(timeInSeconds);
  document.getElementById('alarmsList').appendChild(li);

  // Save to localStorage
  localStorage.setItem('alarms', JSON.stringify(alarms));
}

function logTime() {
  let li = document.createElement('li');
  li.textContent = formatTime(elapsedTime);
 if (elapsedTime > 0) {
   document.getElementById('logs').appendChild(li);

   // Save to localStorage with date
   let currentDate = new Date().toISOString().split('T')[0]; // format: YYYY-MM-DD
   let logs = JSON.parse(localStorage.getItem('logs') || '{}');

   if (!logs[currentDate]) {
     logs[currentDate] = [];
   }

   logs[currentDate].push(elapsedTime);
   localStorage.setItem('logs', JSON.stringify(logs));
 } else {
   console.log('No time to log')
 }
}

function resetStopwatch() {
  elapsedTime = 0;
  document.getElementById('stopwatch').textContent = '00:00:00';
}

document.getElementById('endAlarmInput').addEventListener('change', function() {
  let timeInput = this.value.split(':');
  endAlarm = parseInt(timeInput[0]) * 60 + parseInt(timeInput[1]);

  // Save to localStorage
  localStorage.setItem('endAlarm', endAlarm.toString());
});
