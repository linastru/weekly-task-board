import { Task } from "./Task.js";

class TaskColumn {
  title;
  tasks = [];
  isCollapsed = false;
  taskColumnEl;

  // Drag and drop callbacks.
  setDragOriginColumnCB;
  dragAndDropHandlerCB;

  constructor(
    title,
    setDragOriginColumnCB,
    dragAndDropHandlerCB
  ) {
    this.title = title;
    this.setDragOriginColumnCB = setDragOriginColumnCB;
    this.dragAndDropHandlerCB = dragAndDropHandlerCB;
  }

  render() {
    this.taskColumnEl = document.createElement('div');
    this.taskColumnEl.classList.add('task-column', 'task-column--expanded');
    
    // Add Task Column header.
    let headerEl = document.createElement('div');
    headerEl.classList.add('task-column-header');
    headerEl.addEventListener('click', this.toggleCollapse.bind(this));
    this.taskColumnEl.append(headerEl);
    
    let columnTitleEl = document.createElement('div');
    columnTitleEl.classList.add('column-title');
    columnTitleEl.textContent = this.title;
    headerEl.append(columnTitleEl);
    
    let addTaskBtnContainerEl = document.createElement('div');
    addTaskBtnContainerEl.classList.add('add-task-btn-container');
    headerEl.append(addTaskBtnContainerEl);

    let addTaskBtnEl = document.createElement('button');
    addTaskBtnEl.innerHTML = '<p class="icon-plus">+</p>';
    addTaskBtnEl.classList.add('add-task-btn');
    addTaskBtnEl.addEventListener('click', this.addNewTask.bind(this));
    addTaskBtnContainerEl.append(addTaskBtnEl);

    // Add drag & drop event listeners.
    this.taskColumnEl.addEventListener('dragenter', this.dragEnterHandler.bind(this));
    this.taskColumnEl.addEventListener('dragover', this.dragOverHandler.bind(this));
    this.taskColumnEl.addEventListener('dragleave', this.dragLeaveHandler.bind(this));
    this.taskColumnEl.addEventListener('drop', this.dropHandler.bind(this));
        
    return this.taskColumnEl;
  }

  dragEnterHandler(e) {
    e.preventDefault();
    this.taskColumnEl.classList.add('task-column--drag-over');
  }

  dragOverHandler(e) {
    e.preventDefault();
    this.taskColumnEl.classList.add('task-column--drag-over');
  }

  dragLeaveHandler(e) {
    this.taskColumnEl.classList.remove('task-column--drag-over');
    this.setDragOriginColumnCB(this);
  }

  dropHandler(e) {
    this.taskColumnEl.classList.remove('task-column--drag-over');
    const taskId = e.dataTransfer.getData('text');
    this.dragAndDropHandlerCB(this, taskId);
  }

  addNewTask(e) {
    e.stopPropagation();
    let task = new Task('New task', this.removeTask.bind(this));
    this.tasks.push(task);
    this.taskColumnEl.append(task.render());
    task.startEdit();
  }

  // ------------------------------------------------------------------------
  // Start of: Add new example task for demo/testing.
  addNewExampleTask(taskTitle, taskColorClass) {
    let task = new Task(taskTitle, this.removeTask.bind(this));
    task.backgroundColorClass = taskColorClass;
    this.tasks.push(task);
    this.taskColumnEl.append(task.render());
  }
  // End of: Add new example task for demo/testing.
  // ------------------------------------------------------------------------

  addExistingTask(task) {
    this.tasks.push(task);
    // Update deleteTaskCB to make sure it is bound to the new task column when
    // a task is moved.
    task.deleteTaskCB = this.removeTask.bind(this);
    this.taskColumnEl.append(task.render());
    if(this.isCollapsed) {
      task.taskEl.style.display = 'none';
    }
  }

  removeTask(taskId) {
    for(const task of this.tasks) {
      if(task.id === taskId) {
        task.taskEl.remove();
        this.tasks.splice(this.tasks.indexOf(task), 1);
      }
    }
  }

  toggleCollapse() {
    this.taskColumnEl.classList.toggle('task-column--expanded');
    this.taskColumnEl.classList.toggle('task-column--collapsed');

    if(this.isCollapsed === false) {
      this.taskColumnEl.querySelector('.column-title').textContent = 
        this.title.charAt(0);
      this.taskColumnEl.querySelectorAll('.task, .add-task-btn-container').forEach(
        element => element.style.display = 'none'
      );
      this.isCollapsed = true;
    } else {
      this.taskColumnEl.querySelector('.column-title').textContent =
        this.title;
      this.taskColumnEl.querySelectorAll('.task, .add-task-btn-container').forEach(
        element => element.style.removeProperty('display')
      );
      this.isCollapsed = false;
    }
  }
}

export { TaskColumn };