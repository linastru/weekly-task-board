class TaskGhost {
  parentTask;
  taskGhostEl;
  deltaX; // Delta to cursor X position.
  deltaY; // Delta to cursor Y position.

  constructor(parentTask, deltaX, deltaY) {
    this.parentTask = parentTask;
    this.deltaX = deltaX;
    this.deltaY = deltaY;
  }

  render() {
    this.taskGhostEl = this.parentTask.taskEl.cloneNode(true);
    this.taskGhostEl.classList.add('task-ghost');    
    return this.taskGhostEl;
  }
}

export { TaskGhost };