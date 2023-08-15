let greetings = document.querySelector("#greetings");
let liveTime = new Date().getHours();
let greeting = liveTime >= 5 && liveTime < 12 ? "Hello, Good Morning!" : 
liveTime >= 12 && liveTime < 18 ? "Hello Arpit, Good Afternoon!" :
liveTime >= 18 && liveTime < 21 ? "Hello Arpit, Good Evening!" : "Good Night!";

greetings.innerHTML = greeting;
function liveClock(){
    var liveDate = new Date();
    var showDay = liveDate.getDay(),
        showMonth = liveDate.getMonth(),
        showDate = liveDate.getDate(),
        showYear = liveDate.getFullYear(),
        showHours = liveDate.getHours(),
        showMinutes = liveDate.getMinutes(),
        showSeconds = liveDate.getSeconds(),
        showPeriod = "AM";

        if(showHours == 0){
            showHours = 12;
        }
        if(showHours > 12){
            showHours = showHours - 12;
            showPeriod = "PM";
        }

        Number.prototype.pad = function(digits){
            for(var n = this.toString(); n.length < digits; n = 0 + n);
            return n;
        }


        var months = ["January", "February", "March", "April", "May", "June", "July",
                       "Augest", "September", "October", "November", "December"];
        var week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        var idNames = ["day", "month", "date", "year", "hour", "minutes", 
                       "seconds", "period"];
        
        var valueNames = [week[showDay], months[showMonth], showDate.pad(2), showYear, showHours.pad(2), showMinutes.pad(2), 
                       showSeconds.pad(2), showPeriod];

        for(var i = 0; i < idNames.length; i++)
        document.getElementById(idNames[i]).firstChild.nodeValue = valueNames[i];  
        
        setInterval("liveClock()", 1);
}

liveClock(); 
const newTaskInput = document.querySelector("#create_task input");
const tasksDiv = document.querySelector("#todo_list");
const deleteAll = document.querySelector("#delete_all");
let deleteTasks, editTasks, tasks;
let updateNote = "";
let count;

window.onload = () => {
  updateNote = "";
  count = Object.keys(localStorage).length;
  displayTasks();
};

const displayTasks = () => {
  if (Object.keys(localStorage).length > 0) {
    tasksDiv.style.display = "inline-block";
  } else {
    tasksDiv.style.display = "none";
  }

  if (Object.keys(localStorage).length > 1) {
    deleteAll.style.display = "block";
  } else {
    deleteAll.style.display = "none";
  }

  tasksDiv.innerHTML = "";
  let tasks = Object.keys(localStorage);
  tasks = tasks.sort();

  for (let key of tasks) {
    let classValue = "";
    let value = localStorage.getItem(key);
    let taskInnerDiv = document.createElement("div");
    taskInnerDiv.classList.add("task_list");
    taskInnerDiv.setAttribute("id", key);
    taskInnerDiv.innerHTML = `<span id="taskname">${key.split("_")[1]}</span>`;
    let editButton = document.createElement("button");
    editButton.classList.add("edit_task");
    editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
    if (!JSON.parse(value)) {
      editButton.style.visibility = "visible";
    } else {
      editButton.style.visibility = "hidden";
      taskInnerDiv.classList.add("task_completed");
    }
    taskInnerDiv.appendChild(editButton);
    taskInnerDiv.innerHTML += `<button class="delete_task"><i class="fa-solid fa-trash"></i></button>`;
    tasksDiv.appendChild(taskInnerDiv);
  }

  tasks = document.querySelectorAll(".task_list");
  tasks.forEach((element, index) => {
    element.onclick = () => {
      if (element.classList.contains("task_completed")) {
        updateStorage(element.id.split("_")[0], element.innerText, false);
      } else {
        updateStorage(element.id.split("_")[0], element.innerText, true);
      }
    };
  });

  editTasks = document.getElementsByClassName("edit_task");
  Array.from(editTasks).forEach((element, index) => {
    element.addEventListener("click", (e) => {
      e.stopPropagation();
      disableButtons(true);
      let parent = element.parentElement;
      newTaskInput.value = parent.querySelector("#taskname").innerText;
      updateNote = parent.id;
      parent.remove();
    });
  });
  
  deleteTasks = document.getElementsByClassName("delete_task");
  Array.from(deleteTasks).forEach((element, index) => {
    element.addEventListener("click", (e) => {
      e.stopPropagation();
      let parent = element.parentElement;
      removeTask(parent.id);
      parent.remove();
      count -= 1;
    });
  });
};


const disableButtons = (bool) => {
  let editButtons = document.getElementsByClassName("edit_task");
  Array.from(editButtons).forEach((element) => {
    element.disabled = bool;
  });
};


const removeTask = (taskValue) => {
  localStorage.removeItem(taskValue);
  displayTasks();
};

document.querySelector("#delete_all").addEventListener("click", () => {
  localStorage.clear();
  displayTasks();
});  

const updateStorage = (index, taskValue, completed) => {
  localStorage.setItem(`${index}_${taskValue}`, completed);
  displayTasks();
};
document.querySelector("#add_task").addEventListener("click", () => {
  disableButtons(false);
  if (newTaskInput.value.length == 0) {
    alert("Please Add A Task");
  } else {
    if (updateNote == "") {
      updateStorage(count, newTaskInput.value, false);
    } else {
      let existingCount = updateNote.split("_")[0];
      removeTask(updateNote);
      updateStorage(existingCount, newTaskInput.value, false);
      updateNote = "";
    }
    count += 1;
    newTaskInput.value = "";
  }
});