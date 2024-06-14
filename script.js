let taskInput = document.getElementById('task');
const searchInput = document.getElementById('search');
const errorText = document.getElementById('error');
const addTaskButton = document.querySelector('.add-task');
const searchButton1 = document.getElementById('search1');
const searchButton2 = document.getElementById('search2');
const pendingContainer = document.querySelector('.pending-task');
const completedContainer = document.querySelector('.completed-task');
const rejectedContainer = document.querySelector('.rejected-task');
const updateButton = document.querySelector('.update-task');
const clearButton = document.querySelector('.clear-task');

document.addEventListener("DOMContentLoaded", function() {
    let taskArray = JSON.parse(localStorage.getItem("tasks")) || [];
    let currentTaskId = null;

    function addTask() {
        taskInput.focus();
        searchInput.style.display = 'none';
        taskInput.placeholder = 'Add a new task...';
        if (!taskInput.value.trim()) {
            errorText.style.display = 'block';
            errorText.textContent = "Please enter a task";
        } else {
            errorText.style.display = 'none';
            let task = { id: Date.now(), content: taskInput.value, status: 'pending' };
            taskArray.push(task);
            createTask(task);
            taskInput.value = '';

            saveTasksToLocalStorage();
            clearButton.style.display = 'block';
        }
    }

    function updateTask() {
        if (currentTaskId !== null) {
            let task = taskArray.find(t => t.id === currentTaskId);
            task.content = taskInput.value;
            updateTaskDisplay(task);
            taskInput.value = '';

            updateButton.style.display = 'none';
            addTaskButton.style.display = 'inline-block';

            currentTaskId = null;
            saveTasksToLocalStorage();
        }
    }

    taskInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            if (currentTaskId !== null) {
                updateTask();
            } else {
                addTask();
            }
        }
    });

    function createTask(task) {
        const taskButtonsDiv = document.createElement('ul');
        taskButtonsDiv.classList.add('task-buttons');

        const taskItem = document.createElement('li');
        taskItem.textContent = task.content;
        taskItem.dataset.id = task.id;

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('hold-buttons');

        const editBtn = document.createElement('button');
        editBtn.classList.add('edit-btn');
        editBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
        editBtn.addEventListener('click', () => editTask(task.id));

        const completeBtn = document.createElement('button');
        completeBtn.classList.add('complete-btn');
        completeBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
        completeBtn.addEventListener('click', () => completeTask(task.id));

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.innerHTML = '<i class="fa-solid fa-circle-xmark"></i>';
        deleteBtn.addEventListener('click', () => rejectTask(task.id));

        taskButtonsDiv.appendChild(taskItem);
        taskButtonsDiv.appendChild(buttonContainer);
        buttonContainer.appendChild(editBtn);
        buttonContainer.appendChild(completeBtn);
        buttonContainer.appendChild(deleteBtn);

        if (task.status === 'pending') {
            pendingContainer.appendChild(taskButtonsDiv);
        } else if (task.status === 'completed') {
            completedContainer.appendChild(taskButtonsDiv);
            removeButtons(taskButtonsDiv);
        } else if (task.status === 'rejected') {
            rejectedContainer.appendChild(taskButtonsDiv);
            removeButtons(taskButtonsDiv);
        }

        displayContainers();
    }

    function editTask(taskId) {
        let task = taskArray.find(t => t.id === taskId);
        taskInput.value = task.content;
        taskInput.focus();
        updateButton.style.display = 'inline-block';
        addTaskButton.style.display = 'none';
        currentTaskId = taskId;
        displayContainers();
    }

    function completeTask(taskId) {
        let task = taskArray.find(t => t.id === taskId);
        task.status = 'completed';
        updateTaskDisplay(task);
        saveTasksToLocalStorage();
        displayContainers();
    }

    function rejectTask(taskId) {
        let task = taskArray.find(t => t.id === taskId);
        task.status = 'rejected';
        updateTaskDisplay(task);
        saveTasksToLocalStorage();
        displayContainers();
    }

    function updateTaskDisplay(task) {
        const taskItem = document.querySelector(`li[data-id='${task.id}']`);
        if (taskItem) {
            taskItem.parentElement.remove();
        }

        createTask(task);
    }

    function removeButtons(taskElement) {
        const buttons = taskElement.querySelectorAll('.complete-btn, .delete-btn, .edit-btn');
        buttons.forEach(button => button.remove());
    }

    clearButton.addEventListener('click', () => {
        if (taskArray.length > 0) {
            taskArray = [];
            saveTasksToLocalStorage();
            pendingContainer.innerHTML = '';
            completedContainer.innerHTML = '';
            rejectedContainer.innerHTML = '';
            displayContainers();
            clearButton.style.display = 'none';
        }
    });

    function toggleSearch() {
        searchInput.classList.toggle('search-active');
        if (searchInput.classList.contains('search-active')) {
            searchInput.style.display = 'block';
            searchInput.focus();
            searchInput.addEventListener('input', searchTask);
        } else {
            taskInput.focus();
            searchInput.style.display = 'none';
            searchInput.value = '';
            searchInput.removeEventListener('input', searchTask);
            displayContainers();
        }
    }

    function searchTask() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const allTasks = document.querySelectorAll('li');
        allTasks.forEach(task => {
            let taskContent = task.textContent.toLowerCase();
            if (taskContent.includes(searchTerm)) {
                task.parentElement.style.display = 'flex';
            } else {
                task.parentElement.style.display = 'none';
            }
        });

        displayContainers();
    }

    function displayContainers() {
        pendingContainer.style.display = taskArray.some(task => task.status === 'pending') ? 'block' : 'none';
        completedContainer.style.display = taskArray.some(task => task.status === 'completed') ? 'block' : 'none';
        rejectedContainer.style.display = taskArray.some(task => task.status === 'rejected') ? 'block' : 'none';
        clearButton.style.display = taskArray.length > 0 ? 'block' : 'none';
    }

    function saveTasksToLocalStorage() {
        localStorage.setItem("tasks", JSON.stringify(taskArray));
    }

    function loadTasksFromLocalStorage() {
        taskArray.forEach(task => {
            createTask(task);
        });

        displayContainers();
        clearButton.style.display = taskArray.length === 0 ? 'none' : 'block'; 
    }

    loadTasksFromLocalStorage();

    addTaskButton.addEventListener('click', addTask);
    updateButton.addEventListener('click', updateTask);
    searchButton1.addEventListener('click', toggleSearch);
    searchButton2.addEventListener('click', toggleSearch);
});

// JavaScript

// Example of adding smooth task addition
function addTaskSmoothly(task) {
    const taskButtonsDiv = document.createElement('ul');
    taskButtonsDiv.classList.add('task-buttons');
    taskButtonsDiv.classList.add('fade-in'); // Add fade-in animation class

    // ... Other code to create task elements

    if (task.status === 'pending') {
        pendingContainer.appendChild(taskButtonsDiv);
    } else if (task.status === 'completed') {
        completedContainer.appendChild(taskButtonsDiv);
        removeButtons(taskButtonsDiv);
    } else if (task.status === 'rejected') {
        rejectedContainer.appendChild(taskButtonsDiv);
        removeButtons(taskButtonsDiv);
    }

    displayContainers();
}


// Example of smooth task removal
function removeTaskSmoothly(taskElement) {
    taskElement.classList.add('fade-out'); // Add fade-out animation class
    setTimeout(() => {
        taskElement.parentElement.remove();
        displayContainers();
    }, 300); // Wait for the animation to finish before removing the element
}
