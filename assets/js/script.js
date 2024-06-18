// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
  return nextId++;
}

// Save tasks and nextId to localStorage
function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(taskList));
  localStorage.setItem("nextId", JSON.stringify(nextId));
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  let cardColor = "";
  const deadline = dayjs(task.deadline);
  const now = dayjs();

  if (now.isAfter(deadline)) {
    cardColor = "bg-danger text-white";
  } else if (now.add(3, "day").isAfter(deadline)) {
    cardColor = "bg-warning";
  }

  return $(`
        <div class="card mb-3 ${cardColor}" data-id="${task.id}">
        <div class="card-body">
            <h5 class="card-title">${task.title}</h5>
            <p class="card-text">${task.description}</p>
            <p class="card-text"><small>Deadline: ${task.deadline}</small></p>
            <button class="btn btn-danger btn-sm delete-task">Delete</button>
        </div>
        </div>
    `);
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  $(".task-cards").empty();
  taskList.forEach((task) => {
    const taskCard = createTaskCard(task);
    $(`#${task.status}-cards`).append(taskCard);
  });
  $(".task-cards .card").draggable({
    revert: "invalid",
    helper: "clone",
  });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();

  const task = {
    id: generateTaskId(),
    title: $("#taskTitle").val(),
    description: $("#taskDescription").val(),
    deadline: $("#taskDeadline").val(),
    status: "todo",
  };

  taskList.push(task);
  saveToLocalStorage();
  renderTaskList();

  $("#formModal").modal("hide");
  $("#taskForm")[0].reset();
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
  const taskId = $(event.target).closest(".card").data("id");
  taskList = taskList.filter((task) => task.id !== taskId);
  saveToLocalStorage();
  renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  const taskId = ui.draggable.data("id");
  const newStatus = $(this).attr("id").replace("-cards", "");
  const task = taskList.find((task) => task.id === taskId);
  task.status = newStatus;
  saveToLocalStorage();
  renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker

renderTaskList();

$(".task-cards").droppable({
  accept: ".card",
  drop: handleDrop,
});

$(".card").draggable({
  revert: "invalid",
  helper: "clone",
});

$("#taskForm").on("submit", handleAddTask);
$(".task-cards").on("click", ".delete-task", handleDeleteTask);

$("#taskDeadline").attr("type", "date");
