const ws = new WebSocket("ws://localhost:8080");

ws.onopen = () => {
    ws.send(JSON.stringify({ message: "subscribe" }))
}

ws.onmessage = (message) => {
    const newData = JSON.parse(message.data.toString())
    if (newData.message === "taskFunction") {
        $("#taskList").html("")
        if (newData.task === "createTask") {
            console.log(newData.task)
            Toastify({
                text: "Task created!",
                className: "rounded-full",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
            }).showToast();
        } else if (newData.task === "deleteTask") {
            console.log(newData.task)
            Toastify({
                text: "Task deleted!",
                duration: 3000,
                className: "rounded-full",
                gravity: "top",
                position: "right",
                backgroundColor: "linear-gradient(to right, #9e0514, #de071c)",
            }).showToast();
        } else if (newData.task === "completeTask") {
            console.log(newData.task)
            Toastify({
                text: "Task completed!",
                duration: 3000,
                className: "rounded-full",
                gravity: "top",
                position: "right",
                backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
            }).showToast();
        }
        newData.tasks.forEach(task => {
            if (task.deleted === 1) return;
            $("#taskList").append(`<tr><td class="px-6 py-4">${task.id}</td><td class="px-6 py-4">${task.title}</td><td class="px-6 py-4">${task.description}</td><td class="px-6 py-4">${task.completed === 0 ? "No" : "Yes"}</td><td class="px-6 py-4"><button class="bg-green-400 text-white px-4 py-2 mr-2 rounded-full" onclick="taskFunction('complete', '${task.id}')">Complete</button><button class="bg-red-400 text-white px-4 py-2 rounded-full" onclick="taskFunction('delete', '${task.id}')">Delete</button></td></tr>`)
            //<button class="bg-blue-400 text-white px-4 py-2 ml-2 mr-2 rounded-full">Edit</button>
        })
    }
}

$("#createTask").click(() => {
    if ($("#taskTitle").val().length > 0 && $("#taskDescription").val().length > 0) {
        ws.send(JSON.stringify({ message: "createTask", task: { title: $("#taskDescription").val(), description: $("#taskDescription").val() } }))
    } else {
        $("#taskTitle").attr("style", "display: inline; width: 0;")
        $("#taskTitle").attr("style", "width: auto;")
    }
})

$("#taskTitle").on("input", () => {
    const taskTitle = $("#taskTitle").val()
    const taskDescription = $("#taskTitle").val()
    if (taskTitle.length > 0 && taskDescription.length > 0) {
        $("#taskTitle").attr("style", "width: auto;")
        $("#taskDescription").attr("style", "display: inline;")
    } else {
        setTimeout(() => {
            if ($("#taskTitle").val().length === 0) {
                $("#taskTitle").attr("style", "width: 0; display: none;")
                $("#taskDescription").attr("style", "width: 0; display: none;")
            }
        }, 2000)
    }
})

$("#taskDescription").on("input", () => {
    const taskDescription = $("#taskDescription").val()
    const taskTitle = $("#taskTitle").val()
    if (taskDescription.length > 0 && taskTitle.length > 0) {
        $("#taskTitle").attr("style", "width: auto;")
    } else {
        setTimeout(() => {
            if ($("#taskDescription").val().length === 0) {
                $("#taskDescription").attr("style", "width: 0; display: none;")
            }
        }, 2000)
    }
})

async function taskFunction(task, id) {
    return ws.send(JSON.stringify({ message: "taskFunction", task: task, id: id }))
}