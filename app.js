
const API_URL = "https://gxb1hg8soc.execute-api.ap-south-1.amazonaws.com/prod/todos";

const taskInput = document.getElementById("task");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const taskSummary = document.getElementById("taskSummary");
const emptyState = document.getElementById("emptyState");
const message = document.getElementById("message");
const taskForm = document.getElementById("taskForm");

function showMessage(text, isError = false) {
    message.textContent = text;
    message.classList.toggle("error", isError);
}

function updateDate() {
    const dateElement = document.getElementById("todayLabel");

    if (dateElement) {
        dateElement.textContent = new Intl.DateTimeFormat("en", {
            weekday: "short",
            month: "short",
            day: "numeric"
        }).format(new Date());
    }
}

async function addTask(event) {
    event.preventDefault();

    const task = taskInput.value.trim();

    if (!task) {
        showMessage("Write a task before adding it.", true);
        taskInput.focus();
        return;
    }

    const addButton = taskForm.querySelector("button");
    addButton.disabled = true;
    addButton.textContent = "Adding...";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ task })
        });

        if (!response.ok) {
            throw new Error("The server could not add your task.");
        }

        taskInput.value = "";
        showMessage("Task added successfully.");
        await loadTasks();
    } catch (error) {
        console.error("Add task failed:", error);
        showMessage("Couldn't add the task. Please try again.", true);
    } finally {
        addButton.disabled = false;
        addButton.innerHTML = 'Add task <span>↗</span>';
    }
}

async function loadTasks() {
    taskList.innerHTML = "";
    emptyState.hidden = true;
    taskList.setAttribute("aria-busy", "true");

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("The server could not load your tasks.");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("Unexpected response from the server.");
        }

        data.forEach(item => {
            const li = document.createElement("li");
            li.className = "task-item";

            const marker = document.createElement("span");
            marker.className = "task-marker";
            marker.setAttribute("aria-hidden", "true");
            marker.textContent = "✓";

            const text = document.createElement("span");
            text.className = "task-text";
            text.textContent = item.task ?? "";

            li.append(marker, text);
            taskList.appendChild(li);
        });

        taskCount.textContent = data.length;
        taskSummary.textContent = data.length === 1
            ? "One step at a time."
            : data.length === 0
                ? "A fresh start, anytime."
                : "Keep going, you're doing great.";

        emptyState.hidden = data.length !== 0;
    } catch (error) {
        console.error("Load tasks failed:", error);
        showMessage("Couldn't load your tasks. Check your connection and try again.", true);
    } finally {
        taskList.setAttribute("aria-busy", "false");
    }
}

function logout() {
    localStorage.removeItem("login");
    window.location.href = "login.html";
}

taskForm.addEventListener("submit", addTask);

updateDate();
loadTasks();
