import { TaskColumn } from './modules/TaskColumn.js'

class App {
  columns = [];
  columnNames = [
    'Backlog',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];
  dragOriginColumn = null;
  dragDestinationColumn = null;

  constructor() {
    this.columnNames.forEach(columnName => {
      this.columns.push(new TaskColumn(
        columnName,
        this.setDragOriginColumn.bind(this),
        this.dragAndDropHandler.bind(this)
      ));
    })

    this.columns.forEach(column => {
      document.querySelector('.column-container').append(column.render());
    });

    // Apply header border colors to Backhlog, Saturday and Sunday columns.
    this.columns[0].taskColumnEl.querySelector('.task-column-header')
      .classList.add('backlog');
    this.columns[6].taskColumnEl.querySelector('.task-column-header')
      .classList.add('weekend');
    this.columns[7].taskColumnEl.querySelector('.task-column-header')
      .classList.add('weekend');
  }

  setDragOriginColumn(dragOriginColumn) {
    if(!this.dragOriginColumn) {
      this.dragOriginColumn = dragOriginColumn;
    }
  }

  resetDragOriginColumn() {
    this.dragOriginColumn = null;
  }
  
  setDragDestinationColumn(dragDestinationColumn) {
    this.dragDestinationColumn = dragDestinationColumn;
  }

  resetDragDestinationColumn() {
    this.dragDestinationColumn = null;
  }

  moveTask(taskId, originColumn, destinationColumn) {
    let movedTask;
    for(const task of originColumn.tasks) {
      if(task.id === taskId) {
        movedTask = task;
        break;
      }
    }    
    originColumn.removeTask(taskId);
    destinationColumn.addExistingTask(movedTask);
  }

  dragAndDropHandler(destinationColumn, movedTaskId) {
    if(!this.dragOriginColumn) {
      this.setDragOriginColumn(destinationColumn);
    }
    this.setDragDestinationColumn(destinationColumn);
    this.moveTask(movedTaskId, this.dragOriginColumn, destinationColumn);
    this.resetDragOriginColumn();
    this.resetDragDestinationColumn();
  }
}

const app = new App();

// ------------------------------------------------------------------------
// Start of: Default example tasks for demo/testing.
const exampleTasks = [
  {column: 2, description: "Buy groceries", colorClass: "task--background-color-1"},
  {column: 2, description: "Work out", colorClass: "task--background-color-2"},
  {column: 2, description: "Read a book", colorClass: "task--background-color-3"},
  {column: 2, description: "Pay bills", colorClass: "task--background-color-1"},
  {column: 3, description: "Do laundry", colorClass: "task--background-color-1"},
  {column: 3, description: "Work out", colorClass: "task--background-color-2"},
  {column: 3, description: "Call Steve", colorClass: "task--background-color-4"},
  {column: 3, description: "Book a table for Saturday", colorClass: "task--background-color-1"},
  {column: 3, description: "Read a book", colorClass: "task--background-color-3"},
  {column: 4, description: "Lunch with Emily", colorClass: "task--background-color-4"},
  {column: 4, description: "Clean the garage", colorClass: "task--background-color-1"},
  {column: 4, description: "Take out recyclables", colorClass: "task--background-color-1"}
];

function testInit() {
  exampleTasks.forEach( exampleTask => {
    app.columns[exampleTask.column]
      .addNewExampleTask(exampleTask.description, exampleTask.colorClass);
  })
}

testInit();
// End of: Default example tasks for demo/testing.
// ------------------------------------------------------------------------