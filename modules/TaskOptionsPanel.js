class TaskOptionsPanel {
  colorClass1 = 'task--background-color-2';
  colorClass2 = 'task--background-color-3';
  colorClass3 = 'task--background-color-4';
  colorClass4 = 'task--background-color-1';
  taskOptionsPanelEl;
  parentTask;

  // Task deletion callbacks.
  deleteTaskCB;
  finishTaskEditCB;

  constructor(parentTask, deleteTaskCB, finishTaskEditCB) {
    this.parentTask = parentTask;
    this.deleteTaskCB = deleteTaskCB;
    this.finishTaskEditCB = finishTaskEditCB;
  }

  render() {
    // Create the Options Panel element.
    this.taskOptionsPanelEl = document.createElement('div');
    this.taskOptionsPanelEl.classList.add('task-options-panel');

    // Position the Options Panel next to the Task Item.
    let parentStyle = window.getComputedStyle(this.parentTask.taskEl);
    let posTop = '-' + parentStyle.getPropertyValue('border-width');
    let posLeft = parentStyle.getPropertyValue('width');
    this.taskOptionsPanelEl.style.top = posTop;
    this.taskOptionsPanelEl.style.left = posLeft;

    // Add color selection buttons.
    for(let i = 0; i < 4; i++) {
      let colorEl = document.createElement('div'); 
      let colorClass = this['colorClass' + (i + 1)];
      colorEl.classList.add('color-select-div', colorClass);
      colorEl.addEventListener(
        'click',
        this.changeTaskColor.bind(this, colorClass)
      );
      this.taskOptionsPanelEl.append(colorEl);
    }

    // Add delete button.
    let deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '<i class="fa fa-trash"></i>';
    deleteBtn.addEventListener('click', this.deleteBtnHandler.bind(this));
    this.taskOptionsPanelEl.append(deleteBtn);

    return this.taskOptionsPanelEl;
  }

  changeTaskColor(newColorClass) {
    this.parentTask.changeBackgroundColor(newColorClass);
  }

  deleteBtnHandler() {
    this.finishTaskEditCB();
    this.deleteTaskCB(this.parentTask.id);
  }

  remove() {
    this.taskOptionsPanelEl.remove();
  }
}

export { TaskOptionsPanel }