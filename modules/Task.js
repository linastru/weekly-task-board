import { Backdrop } from './Backdrop.js';
import { TaskOptionsPanel } from './TaskOptionsPanel.js';
import { TaskGhost } from './TaskGhost.js';

class Task {
  id;
  title;
  backgroundColorClass = 'task--background-color-1';
  isCompleted = false;
  isBeingEdited = false;
  taskEl;
  backdrop;
  taskOptionsPanel;
  
  // Drag and drop properties.
  taskGhost;
  isDragged;
  // Named dragHandler function to allow removal of dragOver eventListeners
  // from the html element.
  dragHandlerFunc = this.dragHandler.bind(this);

  // Task deletion callback.
  deleteTaskCB;

  constructor(title, deleteTaskCB) {
    this.title = title;
    this.id = Math.random().toString(16).slice(2);
    this.deleteTaskCB = deleteTaskCB;
  }

  render() {
    this.taskEl = document.createElement('div');
    this.taskEl.id = this.id;
    this.taskEl.classList.add('task', this.backgroundColorClass);
    if(this.isCompleted) {
      this.taskEl.classList.toggle('task--completed');
    }

    // Drag and drop logic.
    this.taskEl.setAttribute('draggable', true);
    this.taskEl.addEventListener('dragstart', this.dragStartHandler.bind(this));
    this.taskEl.addEventListener('dragend', this.dragEndHandler.bind(this));

    // Task title element.
    let taskTitleContainerEl = document.createElement('div');
    taskTitleContainerEl.classList.add('task-title-container');
    let taskTitleEl = document.createElement('p');
    taskTitleEl.textContent = this.title;
    taskTitleContainerEl.append(taskTitleEl);
    this.taskEl.appendChild(taskTitleContainerEl);

    // Task control elements.
    let taskControls = document.createElement('div');
    taskControls.classList.add('task-controls');
    this.taskEl.appendChild(taskControls);

    let completeBtn = document.createElement('button');
    completeBtn.innerHTML = '<i class="fa fa-check"></i>';
    completeBtn.addEventListener('click', this.completeBtnHandler.bind(this));
    taskControls.appendChild(completeBtn);

    let editBtn = document.createElement('button');
    editBtn.innerHTML = '<i class="fa fa-cog"></i>';
    editBtn.addEventListener('click', this.editBtnHandler.bind(this));
    taskControls.appendChild(editBtn);
    
    return this.taskEl;
  }

  dragStartHandler(e) {
    this.isDragged = true;
    let cursorX = e.clientX;
    let cursorY = e.clientY;
    let scrollOffsetX = window.pageXOffset;
    let scrollOffsetY = window.pageYOffset;
    let taskX = this.taskEl.getBoundingClientRect()['left'];
    let taskY = this.taskEl.getBoundingClientRect()['top'];
    let ghostDeltaX = cursorX - taskX;
    let ghostDeltaY = cursorY - taskY;

    this.taskGhost = new TaskGhost(
      this,
      ghostDeltaX,
      ghostDeltaY
    );
    this.taskGhost.render();

    this.taskGhost.taskGhostEl.style.top =
      cursorY - this.taskGhost.deltaY + scrollOffsetY + 'px';
    this.taskGhost.taskGhostEl.style.left =
      cursorX - this.taskGhost.deltaX + scrollOffsetX + 'px';

    document.querySelector('body').append(this.taskGhost.taskGhostEl);
    document.querySelector('html').addEventListener(
      'dragover',
      this.dragHandlerFunc
    );

    this.taskEl.classList.add('task--hidden');
    e.dataTransfer.setDragImage(new Image(), 0, 0);
    e.dataTransfer.setData('text/plain', e.target.id);
  }

  dragEndHandler() {
    this.isDragged = false;
    this.taskGhost.taskGhostEl.remove();
    this.taskGhost = null;
    this.taskEl.classList.remove('task--hidden');
    // Remove dragover eventListener to prevent eventListener accumulation.
    document.querySelector('html').removeEventListener(
      'dragover',
      this.dragHandlerFunc
    );
  }

  dragHandler(e) {
    if (this.isDragged) {
      e = e || window.event;
      let cursorX = e.clientX;
      let cursorY = e.clientY;
      let scrollOffsetX = window.pageXOffset;
      let scrollOffsetY = window.pageYOffset;
      this.taskGhost.taskGhostEl.style.top =
        cursorY - this.taskGhost.deltaY + scrollOffsetY + 'px';
      this.taskGhost.taskGhostEl.style.left =
        cursorX - this.taskGhost.deltaX + scrollOffsetX + 'px';
    }
  }

  completeBtnHandler() {
    this.isCompleted = !this.isCompleted;
    this.taskEl.classList.toggle('task--completed');
  }

  editBtnHandler() {
    if(this.isBeingEdited === false) {
      this.startEdit();
    } else {
      this.finishEdit();
    }
  }

  startEdit() {
    // Replace task title <p> with <textarea>.
    const titlePEl = this.taskEl.querySelector('p');
    const elHeight =
      window.getComputedStyle(titlePEl).getPropertyValue('height');
    titlePEl.remove();

    let titleTextareaEl = document.createElement('textarea');
    titleTextareaEl.style.height = elHeight;
    titleTextareaEl.classList.add('title-textarea');
    titleTextareaEl.value = this.title;
    titleTextareaEl.addEventListener(
      'keyup',
      this.titleInputHandler.bind(this)
    );
    this.taskEl.querySelector('.task-title-container').append(titleTextareaEl);
    titleTextareaEl.select();

    // Create the Task Options Panel.
    this.taskOptionsPanel = new TaskOptionsPanel(
      this,
      this.deleteTaskCB,
      this.finishEdit.bind(this)
    );
    let taskOptionsPanelEl = this.taskOptionsPanel.render();
    this.taskEl.append(taskOptionsPanelEl);

    // Add the backdrop and adjust z-index.
    this.backdrop = new Backdrop(this.finishEdit.bind(this));
    document.querySelector('body').append(this.backdrop.render());
    this.taskEl.classList.add('task--edit-focus');

    // Update control parameters.
    this.isBeingEdited = true;
  }

  finishEdit() {
    // Update task title.
    this.title = this.taskEl.querySelector('textarea').value.trim();
        
    // Replace title <textarea> with <p>.
    this.taskEl.querySelector('textarea').remove();
    let taskTitleEl = document.createElement('p');
    taskTitleEl.textContent = this.title;
    this.taskEl.querySelector('.task-title-container').append(taskTitleEl);

    // Remove the color panel.
    this.taskOptionsPanel.remove();
    this.taskOptionsPanel = null;

    // Remove backdrop and reset z-index.
    this.backdrop.remove();
    this.backdrop = null;
    this.taskEl.classList.remove('task--edit-focus');
    
    // Update control parameters.
    this.isBeingEdited = false;
  }

  titleInputHandler(e) {
    if(e.key === "Enter") {
      this.finishEdit();   
    }    
  }

  changeBackgroundColor(newBackgroundColorClass) {
    this.taskEl.classList.remove(this.backgroundColorClass);
    this.backgroundColorClass = newBackgroundColorClass;
    this.taskEl.classList.add(this.backgroundColorClass);
  }
}

export { Task }