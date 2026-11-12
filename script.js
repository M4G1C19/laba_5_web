let addButton = document.querySelector("#button");
let addTextInput = document.querySelector("#input1");
let taskList = document.getElementById("tasks");
let completedSpan = document.getElementById("complited-task");
let uncompletedSpan = document.getElementById("uncomplited-task");

let tasks = [];
let nextId = 1;
let activeEditContainer = null;

function updateCounter() {
    let total = tasks.length;
    let completed = tasks.filter(t => t.completed).length;
    let uncompleted = total - completed;

    if (completedSpan) completedSpan.innerText = completed;
    if (uncompletedSpan) uncompletedSpan.innerText = uncompleted;
}

function addTask() {
    if (addTextInput.value.trim() === "") return;

    let task = {
        id: nextId++,
        text: addTextInput.value.trim(),
        completed: false 
    };
    
    tasks.push(task);
    createTaskText(task);
    addTextInput.value = '';
    updateCounter(); 
}

function createTaskText(task) {
    let taskDiv = document.createElement('div');
    taskDiv.className = "task-item";
    taskList.append(taskDiv);

    let contentMode = document.createElement('div');
    contentMode.className = "task-content";
    taskDiv.append(contentMode);

    let checkMark = document.createElement('input');
    checkMark.type = 'checkbox';
    checkMark.checked = task.completed;
    
    checkMark.addEventListener('change', function() {
        toggleTaskCompletion(task, checkMark, taskText);
    });

    let taskText = document.createElement('p');
    taskText.innerText = task.text;
    if (task.completed) {
        taskText.classList.add('checked');
    }

    contentMode.append(checkMark);
    contentMode.append(taskText);
    
    let buttonsContainer = document.createElement('div');
    buttonsContainer.className = "task-buttons";
    
    let editButton = document.createElement('button');
    editButton.innerText = 'Edit';
    editButton.addEventListener('click', function () {
        if (activeEditContainer !== null) {
            closeActiveEditWindow();
        }

        contentMode.style.display = 'none';
        buttonsContainer.style.display = 'none';
        
        let editMode = createEditWindow(taskDiv, task, contentMode, taskText, buttonsContainer);
        activeEditContainer = editMode;
    });

    let deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.addEventListener('click', function () {
        deleteTask(taskDiv, task);
    });

    buttonsContainer.append(editButton);
    buttonsContainer.append(deleteButton);
    contentMode.append(buttonsContainer);
}

function closeActiveEditWindow() {
    if (activeEditContainer) {
        activeEditContainer.remove();
        activeEditContainer = null;
        
        document.querySelectorAll('.task-content').forEach(el => el.style.display = 'flex');
        document.querySelectorAll('.task-buttons').forEach(el => el.style.display = 'flex');
    }
}

function toggleTaskCompletion(task, checkboxElement, textElement) {
    task.completed = checkboxElement.checked;
    
    if (task.completed) {
        textElement.classList.add('checked');
    } else {
        textElement.classList.remove('checked');
    }
    updateCounter(); 
}

function deleteTask(taskDiv, task) {
    if (activeEditContainer && taskDiv.contains(activeEditContainer)) {
        activeEditContainer = null;
    }
    taskDiv.remove();
    tasks = tasks.filter(el => el.id !== task.id);
    updateCounter(); 
}

function createEditWindow(taskDiv, task, contentMode, taskTextElement, buttonsContainer) {
    let editMode = document.createElement('div');
    editMode.className = "edit-mode";
    taskDiv.append(editMode);

    let editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.value = task.text;
    editMode.append(editInput);

    let saveButton = document.createElement('button');
    saveButton.innerText = 'Save';
    saveButton.addEventListener('click', function () {
        let newText = editInput.value.trim();
        if (newText === "") return;

        task.text = newText;
        taskTextElement.innerText = newText;

        editMode.remove();
        activeEditContainer = null;
        contentMode.style.display = 'flex';
        buttonsContainer.style.display = 'flex';
    });

    let cancelButton = document.createElement('button');
    cancelButton.innerText = 'Cancel';
    cancelButton.addEventListener('click', function () {
        editMode.remove();
        activeEditContainer = null;
        contentMode.style.display = 'flex';
        buttonsContainer.style.display = 'flex';
    });

    editMode.append(saveButton);
    editMode.append(cancelButton);
    
    return editMode;
}

addButton.addEventListener('click', function () {
    addTask();
});


updateCounter();