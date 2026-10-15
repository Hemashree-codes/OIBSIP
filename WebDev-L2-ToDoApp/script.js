
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priority");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const emptyState = document.getElementById("emptyState");
const clearCompletedBtn = document.getElementById("clearCompleted");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");
const taskSummary = document.getElementById("taskSummary");

const STORAGE_KEY = "taskflow-tasks-v1";

let tasks = loadTasks();
let currentFilter = "all";
let searchText = "";

function loadTasks() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return Array.isArray(saved) ? saved : [];
    } catch {
        return [];
    }
}

function saveTasks() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
        alert("Your browser could not save tasks. Check browser storage settings.");
    }
}

function createId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = taskInput.value.trim();

    if (!name) {
        taskInput.focus();
        return;
    }

    tasks.unshift({
        id: createId(),
        name,
        priority: priorityInput.value,
        completed: false,
        createdAt: new Date().toLocaleDateString()
    });

    saveTasks();
    taskForm.reset();
    priorityInput.value = "Medium";
    taskInput.focus();
    renderTasks();
});

function renderTasks() {
    taskList.replaceChildren();

    const filteredTasks = tasks.filter(task => {
        const matchesFilter =
            currentFilter === "all" ||
            (currentFilter === "pending" && !task.completed) ||
            (currentFilter === "completed" && task.completed);

        const matchesSearch = task.name
            .toLowerCase()
            .includes(searchText.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    filteredTasks.forEach(task => {
        const item = document.createElement("li");
        item.className = `task-item${task.completed ? " completed" : ""}`;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "task-check";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", `Complete ${task.name}`);

        checkbox.addEventListener("change", () => {
            updateTask(task.id, { completed: checkbox.checked });
        });

        const content = document.createElement("div");
        content.className = "task-content";

        const name = document.createElement("p");
        name.className = "task-name";
        name.textContent = task.name;

        const meta = document.createElement("div");
        meta.className = "task-meta";

        const priority = document.createElement("span");
        priority.className = `priority ${task.priority}`;
        priority.textContent = `${task.priority} priority`;

        const date = document.createElement("span");
        date.textContent = task.createdAt;

        meta.append(priority, date);
        content.append(name, meta);

        const actions = document.createElement("div");
        actions.className = "task-actions";

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "action-btn";
        editButton.textContent = "✎";
        editButton.title = "Edit task";
        editButton.setAttribute("aria-label", `Edit ${task.name}`);

        editButton.addEventListener("click", () => editTask(task));

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "action-btn delete";
        deleteButton.textContent = "×";
        deleteButton.title = "Delete task";
        deleteButton.setAttribute("aria-label", `Delete ${task.name}`);

        deleteButton.addEventListener("click", () => {
            deleteTask(task.id);
        });

        actions.append(editButton, deleteButton);
        item.append(checkbox, content, actions);
        taskList.appendChild(item);
    });

    emptyState.hidden = filteredTasks.length > 0;
    taskList.hidden = filteredTasks.length === 0;

    if (tasks.length === 0) {
        emptyState.querySelector("h3").textContent = "No tasks yet";
        emptyState.querySelector("p").textContent =
            "Add your first task to get started!";
    } else if (filteredTasks.length === 0) {
        emptyState.querySelector("h3").textContent = "No matching tasks";
        emptyState.querySelector("p").textContent =
            "Try another filter or search term.";
    }

    updateStats();
}

function updateStats() {
    const completed = tasks.filter(task => task.completed).length;
    const pending = tasks.length - completed;

    totalTasks.textContent = tasks.length;
    completedTasks.textContent = completed;
    pendingTasks.textContent = pending;
    taskSummary.textContent =
        `${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}`;
}

function updateTask(id, changes) {
    tasks = tasks.map(task =>
        task.id === id ? { ...task, ...changes } : task
    );

    saveTasks();
    renderTasks();
}

function editTask(task) {
    const updatedName = prompt("Edit your task:", task.name);

    if (updatedName === null) return;

    const name = updatedName.trim();

    if (!name) {
        alert("Task name cannot be empty.");
        return;
    }

    updateTask(task.id, { name });
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

document.querySelectorAll(".filter").forEach(button => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;

        document.querySelectorAll(".filter").forEach(filterButton => {
            const isActive = filterButton === button;
            filterButton.classList.toggle("active", isActive);
            filterButton.setAttribute("aria-pressed", String(isActive));
        });

        renderTasks();
    });
});

searchInput.addEventListener("input", () => {
    searchText = searchInput.value.trim();
    renderTasks();
});

clearCompletedBtn.addEventListener("click", () => {
    const hasCompleted = tasks.some(task => task.completed);

    if (!hasCompleted) {
        alert("There are no completed tasks to clear.");
        return;
    }

    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
});

renderTasks();

