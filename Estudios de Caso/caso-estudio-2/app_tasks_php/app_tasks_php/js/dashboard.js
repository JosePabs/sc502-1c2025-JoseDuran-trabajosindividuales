document.addEventListener('DOMContentLoaded', function () {
    let tasks = [];

    async function fetchTasks() {
        const res = await fetch('api/tasks.php');
        if (res.ok) {
            tasks = await res.json();
            loadTasks();
        } else {
            console.error('Error al cargar tareas');
        }
    }

    function loadTasks() {
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = '';

        if (tasks.length === 0) {
            const noTasksMessage = document.createElement('div');
            noTasksMessage.className = 'alert alert-info w-100 text-center';
            noTasksMessage.textContent = 'No hay tareas disponibles.';
            taskList.appendChild(noTasksMessage);
            return;
        }

        tasks.forEach(function (task) {
            const taskCard = document.createElement('div');
            taskCard.className = 'col-md-4 mb-3';

            taskCard.innerHTML = `
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${task.title}</h5>
                        <p class="card-text">${task.description}</p>
                        <p class="card-text"><small class="text-muted">Due: ${task.due_date}</small></p>
                        <h6>Comentarios</h6>
                        <ul class="list-group mb-3" id="comments-${task.id}">
                            <li class="list-group-item text-muted">Cargando comentarios...</li>
                        </ul>
                        <div class="input-group mb-3">
                            <input type="text" class="form-control" id="comment-input-${task.id}" placeholder="Añadir un comentario">
                            <div class="input-group-append">
                                <button class="btn btn-primary add-comment" data-id="${task.id}">+</button>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-secondary btn-sm edit-task" data-id="${task.id}">Editar</button>
                        <button class="btn btn-danger btn-sm delete-task" data-id="${task.id}">Eliminar</button>
                    </div>
                </div>`;
            taskList.appendChild(taskCard);

            
            loadComments(task.id);
        });

        document.querySelectorAll('.add-comment').forEach(button => button.addEventListener('click', handleAddComment));
        document.querySelectorAll('.delete-task').forEach(button => button.addEventListener('click', handleDeleteTask));
    }

    async function loadComments(taskId) {
        console.log(`Cargando comentarios para la tarea ${taskId}`); 
        const commentList = document.getElementById(`comments-${taskId}`);
        try {
            const response = await fetch(`api/comments.php?task_id=${taskId}`);
            if (response.ok) {
                const comments = await response.json();
                if (comments.length > 0) {
                    commentList.innerHTML = comments.map(comment => `
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            ${comment.text}
                            <button class="btn btn-sm btn-outline-danger delete-comment" data-id="${comment.id}" data-task-id="${taskId}">&times;</button>
                        </li>
                    `).join('');
                    document.querySelectorAll('.delete-comment').forEach(button => button.addEventListener('click', handleDeleteComment));
                } else {
                    commentList.innerHTML = `<li class="list-group-item text-muted">No hay comentarios</li>`;
                }
            } else {
                const errorText = await response.text();
                console.error('Error al cargar comentarios:', errorText); 
                commentList.innerHTML = `<li class="list-group-item text-danger">Error al cargar comentarios</li>`;
            }
        } catch (error) {
            console.error('Error de red al cargar comentarios:', error); 
            commentList.innerHTML = `<li class="list-group-item text-danger">Error de red al cargar comentarios</li>`;
        }
    }

    async function createComment(taskId, comment) {
        console.log('Enviando comentario:', { task_id: taskId, text: comment }); 
        try {
            const response = await fetch('api/comments.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ task_id: taskId, text: comment })
            });

            if (response.ok) {
                console.log('Comentario añadido correctamente'); 
                await loadComments(taskId); 
            } else {
                const errorText = await response.text();
                console.error('Error al crear comentario:', errorText); 
            }
        } catch (error) {
            console.error('Error de red al crear comentario:', error); 
        }
    } 

    async function createTask(title, description, dueDate) {
        const response = await fetch('api/tasks.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, due_date: dueDate })
        });

        if (response.ok) {
            await fetchTasks();
        } else {
            console.error('Error al crear tarea');
        }
    }

    function handleAddComment(e) {
        const taskId = parseInt(e.target.dataset.id);
        const input = document.getElementById(`comment-input-${taskId}`);
        const value = input.value.trim();

        if (value) {
            console.log('Añadiendo comentario:', value); 
            createComment(taskId, value);
            input.value = '';
        } else {
            console.warn('El comentario está vacío'); 
        }
    }

    function handleAddTask(e) {
        e.preventDefault();
        const title = document.getElementById('task-title').value.trim();
        const description = document.getElementById('task-desc').value.trim();
        const dueDate = document.getElementById('due-date').value;

        if (title && description && dueDate) {
            createTask(title, description, dueDate);
            document.getElementById('task-form').reset();
            const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
            modal.hide();
        }
    }

    function handleDeleteComment(e) {
        const commentId = parseInt(e.target.dataset.id);
        const taskId = parseInt(e.target.dataset.taskId);
        deleteComment(commentId, taskId);
    }

    async function handleDeleteTask(e) {
        const taskId = parseInt(e.target.dataset.id);
        await fetch('api/tasks.php', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: taskId })
        });
        await fetchTasks();
    }

    document.getElementById('task-form').addEventListener('submit', handleAddTask);
    fetchTasks();
});
