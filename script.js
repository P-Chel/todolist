let tasks = [
    { 
        id: 1, 
        text: "Complete BPM project", 
        description: "Finish the introduction and the conclusion.",
        status: "todo" 
    },
    { 
        id: 2, 
        text: "Make logical erd for final project", 
        description: "Finish on thursday May 29, 2025.",
        status: "inprogress" 
    },
    { 
        id: 3, 
        text: "Do subnetting assignment", 
        description: "Ask classmate for reference. Deadline: May 31, 2025.",
        status: "todo" 
    },
    { 
        id: 4, 
        text: "Conduct interview BPM final project", 
        description: "Interview AJ Dental Clinic for the business analyzation.",
        status: "done" 
    },
    { 
        id: 5, 
        text: "Write TCW activities", 
        description: "Email all activities to the professor.",
        status: "inprogress" 
    },
    { 
        id: 6, 
        text: "Make infographics PEE", 
        description: "Deadline: May 30, 2025",
        status: "todo" 
    },
    { 
        id: 7, 
        text: "Meeting to assign parts in IM final project", 
        description: "Meeting date and time: May 23, 2025 - 2:00 PM",
        status: "done" 
    }
];

let taskIdCounter = 8;
let currentEditId = null;
let currentAction = null;

function updateCounters() {
    const todoCount = tasks.filter(t => t.status === 'todo').length;
    const inprogressCount = tasks.filter(t => t.status === 'inprogress').length;
    const doneCount = tasks.filter(t => t.status === 'done').length;
    const totalTasks = tasks.length;
    
    document.getElementById('todoCount').textContent = todoCount;
    document.getElementById('inprogressCount').textContent = inprogressCount;
    document.getElementById('doneCount').textContent = doneCount;
    
    const progressText = totalTasks === 0 ? "No tasks yet" : 
        `${doneCount}/${totalTasks} - ${doneCount} task${doneCount !== 1 ? 's' : ''} ${doneCount === 1 ? 'is' : 'are'} done`;
    document.getElementById('progressInfo').textContent = progressText;
    
    document.getElementById('counterFraction').textContent = `${doneCount}/${totalTasks}`;
    
    const progressCircle = document.getElementById('progressCircle');
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const progress = totalTasks === 0 ? 0 : (doneCount / totalTasks);
    const strokeDashoffset = circumference - (progress * circumference);
    
    progressCircle.style.strokeDasharray = circumference;
    progressCircle.style.strokeDashoffset = strokeDashoffset;
}

function renderTasks() {
    const todoContainer = document.getElementById('todoTasks');
    const inprogressContainer = document.getElementById('inprogressTasks');
    const doneContainer = document.getElementById('doneTasks');

    const todoTasks = tasks.filter(t => t.status === 'todo');
    const inprogressTasks = tasks.filter(t => t.status === 'inprogress');
    const doneTasks = tasks.filter(t => t.status === 'done');

    todoContainer.innerHTML = renderTasksForStatus(todoTasks, 'todo');
    inprogressContainer.innerHTML = renderTasksForStatus(inprogressTasks, 'inprogress');
    doneContainer.innerHTML = renderTasksForStatus(doneTasks, 'done');

    updateCounters();
}

function renderTasksForStatus(tasks, status) {
    if (tasks.length === 0) {
        const emptyMessages = {
            todo: { title: "No tasks to do", subtitle: "Add a new task to get started!" },
            inprogress: { title: "Nothing in progress", subtitle: "Move a task here to start working" },
            done: { title: "No completed tasks", subtitle: "Complete tasks will appear here" }
        };

        return `
            <div class="empty-section">
                <h4>${emptyMessages[status].title}</h4>
                <p>${emptyMessages[status].subtitle}</p>
            </div>
        `;
    }

    return tasks.map(task => `
        <div class="task-card ${task.status}">
            <div class="task-header">
                <div class="task-text">${task.text}</div>
                <div class="task-actions">
                    <button class="action-btn edit-btn" onclick="editTask(${task.id})" title="Edit">
                        ✏️
                    </button>
                    ${task.status !== 'done' ? `
                        <button class="action-btn status-btn" onclick="progressTask(${task.id})" title="Next Status">
                            ➡️
                        </button>
                    ` : ''}
                    ${task.status !== 'todo' ? `
                        <button class="action-btn undo-btn" onclick="undoTask(${task.id})" title="Previous Status">
                            ↩️
                        </button>
                    ` : ''}
                    <button class="action-btn delete-btn" onclick="deleteTask(${task.id})" title="Delete">
                        🗑️
                    </button>
                </div>
            </div>
            ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
        </div>
    `).join('');
}

function addTask() {
    const titleInput = document.getElementById('taskInput');
    const descriptionInput = document.getElementById('descriptionInput');
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();

    if (title === '') return;

    tasks.push({
        id: taskIdCounter++,
        text: title,
        description: description,
        status: 'todo'
    });

    titleInput.value = '';
    descriptionInput.value = '';
    renderTasks();
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    currentEditId = id;
    document.getElementById('editInput').value = task.text;
    document.getElementById('editDescriptionInput').value = task.description || '';
    document.getElementById('editModal').style.display = 'block';
}

function saveEdit() {
    const newText = document.getElementById('editInput').value.trim();
    const newDescription = document.getElementById('editDescriptionInput').value.trim();
    
    if (newText === '') return;

    const task = tasks.find(t => t.id === currentEditId);
    if (task) {
        task.text = newText;
        task.description = newDescription;
        renderTasks();
    }

    closeEditModal();
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
    currentEditId = null;
}

function progressTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    if (task.status === 'todo') {
        task.status = 'inprogress';
    } else if (task.status === 'inprogress') {
        task.status = 'done';
    }

    renderTasks();
}

function undoTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    if (task.status === 'done') {
        task.status = 'inprogress';
    } else if (task.status === 'inprogress') {
        task.status = 'todo';
    }

    renderTasks();
}

function deleteTask(id) {
    currentAction = () => {
        tasks = tasks.filter(t => t.id !== id);
        renderTasks();
    };

    showConfirmModal('Are you sure you want to delete this task?');
}

function clearDoneTasks() {
    const doneTasks = tasks.filter(t => t.status === 'done');
    if (doneTasks.length === 0) return;

    currentAction = () => {
        tasks = tasks.filter(t => t.status !== 'done');
        renderTasks();
    };

    showConfirmModal(`Are you sure you want to clear ${doneTasks.length} completed task${doneTasks.length > 1 ? 's' : ''}?`);
}

function showConfirmModal(message) {
    document.getElementById('modalMessage').textContent = message;
    document.getElementById('confirmModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('confirmModal').style.display = 'none';
    currentAction = null;
}

function confirmAction() {
    if (currentAction) {
        currentAction();
    }
    closeModal();
}

document.getElementById('addBtn').addEventListener('click', addTask);
document.getElementById('taskInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        addTask();
    }
});
document.getElementById('descriptionInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        addTask();
    }
});
document.getElementById('confirmBtn').addEventListener('click', confirmAction);
document.getElementById('saveEditBtn').addEventListener('click', saveEdit);
document.getElementById('editInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        saveEdit();
    }
});

window.addEventListener('click', (e) => {
    if (e.target === document.getElementById('confirmModal')) {
        closeModal();
    }
    if (e.target === document.getElementById('editModal')) {
        closeEditModal();
    }
});

renderTasks();