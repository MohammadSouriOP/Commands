let tasks = [];
let editingTaskIndex = -1;

window.onload = function() {
  loadTasks();
  renderTasks();
}

function loadTasks() {
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
  }
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function openPopup() {
  document.getElementById("taskPopup").style.display = "flex";
  document.getElementById("taskForm").reset();
  document.getElementById("popupTitle").textContent = "Add New Task";
  document.getElementById("submitBtn").textContent = "Add Task";
  editingTaskIndex = -1;
}

function closePopup() {
  document.getElementById("taskPopup").style.display = "none";
}

function addOrEditTask(event) {
  event.preventDefault();

  const title = document.getElementById("taskTitle").value;
  const description = document.getElementById("taskDescription").value;

  if (editingTaskIndex === -1) {
    tasks.push({ title, description, completed: false });
  } else {
    tasks[editingTaskIndex] = { title, description, completed: tasks[editingTaskIndex].completed };
  }

  saveTasks(); 
  closePopup();
  renderTasks();
}

function renderTasks(filter = 'all') {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
  });

  filteredTasks.forEach((task, index) => {
    const taskItem = document.createElement("div");
    taskItem.classList.add("task-item");
    if (task.completed) taskItem.classList.add("completed");

    taskItem.innerHTML = `
      <div>
        <h3>${task.title}</h3>
        <p>${task.description}</p>
      </div>
      <div>
        <button onclick="toggleTaskCompletion(${index})">${task.completed ? 'Undo' : 'Complete'}</button>
        <button onclick="editTask(${index})">Edit</button>
        
        <i class="fa-solid fa-trash" onclick="removeTask(${index})"></i>
      </div>
    `;
    taskList.appendChild(taskItem);
  });
}

function toggleTaskCompletion(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks(); 
  renderTasks();
}

function editTask(index) {
    openPopup();
  document.getElementById("taskTitle").value = tasks[index].title;
  document.getElementById("taskDescription").value = tasks[index].description;
  document.getElementById("popupTitle").textContent = "Edit Task";
  document.getElementById("submitBtn").textContent = "Update Task";
  editingTaskIndex = index;
}

function removeTask(index) {
  tasks.splice(index, 1);
  saveTasks();   
  renderTasks();
}

function filterTasks(status) {
  renderTasks(status);
}