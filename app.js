const API_URL = "https://gxb1hg8soc.execute-api.ap-south-1.amazonaws.com/prod/todos";

async function addTask() {

    const task = document.getElementById("task").value;

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            task: task
        })
    });

    const data = await response.json();

    alert("Task Added");
    loadTasks();
}

async function loadTasks() {

    const response = await fetch(API_URL);
    const data = await response.json();

    const list = document.getElementById("taskList");

    list.innerHTML = "";

    data.forEach(item => {

        const li = document.createElement("li");

        li.innerHTML = item.task;

        list.appendChild(li);
    });
}

function logout() {
    localStorage.removeItem("login");
    window.location.href = "login.html";
}

loadTasks();