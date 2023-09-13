import { format, differenceInCalendarDays, formatDistanceToNowStrict, differenceInDays, parse } from 'date-fns';
import './style.css';

const createContent = (() => {
    const content  = document.createElement('div');
    content.setAttribute('id', 'content');
    document.body.appendChild(content);
})();
const content = document.getElementById('content');



//Create dom elements
const createHeader = (() => {
    const header = document.createElement('div');
    header.setAttribute('id', 'header');
    header.setAttribute('class', 'header');
    content.appendChild(header);

        const title = document.createElement('h1');
        title.innerText = "To-Do List";
        header.appendChild(title);
})();

const createMainDiv = (() => {
    const mainDiv = document.createElement('div');
    mainDiv.setAttribute('id', 'mainDiv');
    content.appendChild(mainDiv);

    //track if there is a popup active to prevent multiple popup windows
    const popupActive = false;
    return {popupActive};
})();
const mainDiv = document.getElementById('mainDiv');


//create sidebar div and contents in dom
const sideBar = (() => {
    const sideBar = document.createElement('div');
    sideBar.setAttribute('id', 'sideBar');
    sideBar.setAttribute('class', 'sideBar');
    mainDiv.appendChild(sideBar);

        const newProject = document.createElement('h2');
        newProject.innerText = 'New Project';
        newProject.setAttribute('id', 'newProjBtn');
        sideBar.appendChild(newProject);

        const viewAll = document.createElement('h2');
        viewAll.innerText = 'View All';
        viewAll.setAttribute('id', 'viewAllBtn');
        sideBar.appendChild(viewAll);

        const viewMonth = document.createElement(`h2`);
        viewMonth.innerText = `Month`;
        viewMonth.setAttribute(`id`, `viewMonthBtn`);
        sideBar.appendChild(viewMonth);

        const viewWeek = document.createElement(`h2`);
        viewWeek.innerText = `Week`;
        viewWeek.setAttribute(`id`, `viewWeekBtn`);
        sideBar.appendChild(viewWeek);
})();


//create div in dom that displays projects
const createViewerDiv = (() => {
    const viewerDiv = document.createElement('div');
    viewerDiv.setAttribute('id', 'viewerDiv');
    mainDiv.appendChild(viewerDiv);
})();


//create popup form for inputting new projects
const createProjPopup = (() => {
    const projPopup = document.createElement('div');
    projPopup.setAttribute('class', 'projPopup');
    projPopup.setAttribute('id', 'projPopup');
    mainDiv.appendChild(projPopup);

        const newProjName = document.createElement('input');
        newProjName.setAttribute('type', 'text');
        newProjName.setAttribute('id', 'newProjName');
        newProjName.setAttribute('name', 'newProjName');
        newProjName.setAttribute('placeholder', 'New Project');
        projPopup.appendChild(newProjName);

        const newProjDue = document.createElement('input');
        newProjDue.setAttribute('type', 'date');
        newProjDue.setAttribute('id', 'newProjDue');
        newProjDue.setAttribute('name', 'newProjDue');
        projPopup.appendChild(newProjDue);

        const confirmBtn = document.createElement('div');
        confirmBtn.setAttribute('id', 'confirmBtn');
        projPopup.appendChild(confirmBtn);

            const confirmBtnText = document.createElement('h3');
            confirmBtnText.innerText = `Add Project`;
            confirmBtn.appendChild(confirmBtnText);


})();

//Get elements from DOM
const viewAllBtn = document.getElementById('viewAllBtn');
const newProjPopup = document.getElementById('projPopup');
const projNameInput = document.getElementById('newProjName');
const projDueInput = document.getElementById('newProjDue');
const newProjBtn = document.getElementById('newProjBtn');
const confirmBtn = document.getElementById('confirmBtn');
const projectViewer = document.getElementById('viewerDiv');


//display popup form to add new project
const togglePopup = () => {
        if(newProjPopup.style.display == 'none'){
            newProjPopup.style.display = 'flex'
        } else {newProjPopup.style.display = 'none'};
};
newProjBtn.addEventListener('click', togglePopup);


//"Add" button functionality on new project popup
const confirmNewProj = () => {
    let newName = projNameInput.value;
    let newDue = projDueInput.valueAsNumber;

    createProjCard(newName, newDue);
    
    projectHolder.addProject(projectHolder.createProject(newName, newDue));

    projNameInput.value = '';
    projDueInput.value = '';

    togglePopup();
    updateStorage();

};
confirmBtn.addEventListener('click', confirmNewProj);


//add new project card to dom
const createProjCard = (name, due) => {
    const newProjCard = document.createElement('div');
    newProjCard.setAttribute('class', 'projCard');
    newProjCard.setAttribute(`id`, `${projectHolder.projCounter}`);
    projectViewer.appendChild(newProjCard);

        const newProjTitle = document.createElement('h4');
        newProjTitle.innerText = `${name}`;
        newProjTitle.setAttribute(`class`, `projectTitle`);
        newProjCard.appendChild(newProjTitle);

        const newProjDueDate = document.createElement('h5');
        newProjDueDate.innerText = `${format(due, `MM/dd/yyyy`)}`;
        newProjDueDate.setAttribute(`class`, `projDueDate`);
        newProjCard.appendChild(newProjDueDate);

    newProjCard.addEventListener(`click`, function(e){
        projectHolder.projectArr.find(({projectId}) => projectId == e.target.id).createProjectDetail()
    });

    //change color of the card based on how close the date is to the due date
    let currentDate = Date.now();
    
    let dateDifference = differenceInCalendarDays(due, currentDate);
    console.log(dateDifference);

    if(dateDifference <= 3){
        newProjCard.classList.add(`dueNow`)
    } else if(dateDifference > 3 && dateDifference <= 10){
        newProjCard.classList.add(`dueSoon`)
    } else if(dateDifference > 10){
        newProjCard.classList.add(`dueLater`)
    }

}


//Create new projects and store them in array
const projectHolder = (() => {
    let projectArr = [];
    let projCounter = 0;

    const addProject = (obj) => {
        projectArr.push(obj);
        projectHolder.projCounter++;
        updateStorage();
        console.log(projCounter);
    };

    const createProject = (str, num) => {
        return str = new Project(str, num, projectHolder.projCounter);
    };

    const removeProject = (num) => {
        let removeIndex = projectArr.findIndex(proj => proj.projectId == num);
        projectArr.splice(removeIndex, removeIndex + 1);
        console.log(projectHolder);
    }

    return{projectArr, addProject, projCounter, removeProject, createProject};
})();



class Project {
    constructor(name, dueDate, id) {
        this.name = name;
        this.dueDate = dueDate;
        this.taskList = [];
        this.taskCounter = 0;
        this.projectId = id;
    };

    addTaskToList(taskName) {
        this.taskList.push(taskName);
        this.taskCounter++;
        updateStorage();
    };

    createTask(taskName) {
        return taskName = new Task(taskName, this.projectId, this.taskCounter);
    }

    removeTaskFromList(taskIdNum){
        let removeTaskIndex = this.taskList.findIndex(task => task.taskId == taskIdNum);
        this.taskList.splice(removeTaskIndex, removeTaskIndex + 1);
        updateStorage();
    };

    toggleTask(id){
        let taskToggleIndex = this.taskList.findIndex(task => task.taskId == id);
        this.taskList[taskToggleIndex].toggleTaskCompleted();
        updateStorage();
    };

    displayTasks(){
        this.taskList.forEach((task) => {
            const taskBeingAdded = document.createElement(`div`);
            const taskViewer = document.getElementById(`detailTaskViewer`);
            taskViewer.appendChild(taskBeingAdded);

            //get and set id for task being displayed
            taskBeingAdded.setAttribute(`id`, `${task.taskId}`);

            //get and set class of div depending on if it is complete or not
            if(task.taskCompleted === true){
                taskBeingAdded.className = `completeTask`
            } else if(task.taskCompleted === false){
                taskBeingAdded.className = `incompleteTask`
            };

            //add toggle complete function listener to div
            taskBeingAdded.addEventListener(`click`, function(){
                if(taskBeingAdded.className === `incompleteTask`){
                    taskBeingAdded.className = `completeTask`;
                    task.toggleTaskCompleted();
                } else {
                    taskBeingAdded.className =`incompleteTask`;
                    task.toggleTaskCompleted()};

                updateStorage();
            });


                //add <p> containing task name to task div
                const taskName = document.createElement(`p`);
                taskName.innerText = `${task.name}`;
                taskBeingAdded.appendChild(taskName);

                //add div to hold task buttons
                const btnHolder = document.createElement(`div`);
                btnHolder.className = `newTaskBtns`;
                taskBeingAdded.appendChild(btnHolder);

                    //task cancel button
                    const cancelBtn = document.createElement(`h4`);
                    cancelBtn.setAttribute(`id`, `cancelAddTaskBtn${task.taskId}`);
                    cancelBtn.setAttribute(`class`, `newTaskBtn`);
                    cancelBtn.innerText = `X`;
                    btnHolder.appendChild(cancelBtn);

                    //task cancel button function
                    cancelBtn.addEventListener(`click`, function(){
                        //remove task from task viewer in dom
                        const taskInDom = document.getElementById(`${task.taskId}`);
                        taskViewer.removeChild(taskInDom);

                        //remove task from project task array
                        removeTaskFromList(task.taskId);
                    });
        });
    };

    //show project detail when project card is clicked
    createProjectDetail(){
        if(createMainDiv.popupActive === false){
            createMainDiv.popupActive = true;

            const projDetailPopup = document.createElement('div');
            projDetailPopup.setAttribute('id', 'projDetailPopup');
            projDetailPopup.setAttribute('class', 'projDetailPopup');
            mainDiv.appendChild(projDetailPopup);

                projDetailPopup.innerHTML = `
                <div id="detailHeader">
                    <h2 class="detailTitle">${this.name}</h2>
                    <h2 class="detailDue">${format(this.dueDate, `MM/dd/yyyy`)}</h2>
                    <h5 id="closeBtn">X</h5>
                </div>

                <div id="detailTaskViewer"></div>

                <div id="detailFooter">
                    <h3 id="addTaskBtn">Add Task</h3>
                    <h3 id="deleteProjBtn">Delete Project</h3>
                </div>`;

            //Close button at top right of project detail popup and ensure multiple popups don't appear
            const closeBtn = document.getElementById('closeBtn');
            closeBtn.onclick = () => {
                projDetailPopup.remove();
                createMainDiv.popupActive = false;
            };

            //Functions within project detail popup
            const taskViewer = document.getElementById('detailTaskViewer');
            const addTaskBtn = document.getElementById('addTaskBtn');
            const deleteProjBtn = document.getElementById('deleteProjBtn');

            const createTaskInput = () => {
                let thisTaskId = `${this.projectId}.${this.taskCounter}`;

                if(isInputActive === false){
                    isInputActive = true;

                    //new task input container
                    const newTaskInput = document.createElement('div');
                    newTaskInput.setAttribute(`id`, `${thisTaskId}`);
                    newTaskInput.setAttribute(`class`, `newTaskInput`);
                    taskViewer.appendChild(newTaskInput);

                        //new task input feild
                        const taskInputEle = document.createElement('input');
                        taskInputEle.setAttribute(`id`, `taskName${thisTaskId}`);
                        taskInputEle.setAttribute(`placeholder`, `New Task`);
                        taskInputEle.setAttribute(`name`, `taskName${thisTaskId}`);
                        newTaskInput.appendChild(taskInputEle);

                        //new task buttons container
                        const newTaskBtnsDiv = document.createElement('div');
                        newTaskBtnsDiv.setAttribute(`class`, `newTaskBtns`);

                            //confirm new task button
                            const confirmBtnEle = document.createElement('h4');
                            confirmBtnEle.setAttribute(`id`, `confirmTaskBtn${thisTaskId}`);
                            confirmBtnEle.setAttribute(`class`, `newTaskBtn`);
                            confirmBtnEle.innerText = `+`;

                            //cancel task button
                            const cancelAddTaskBtnEle = document.createElement(`h4`);
                            cancelAddTaskBtnEle.setAttribute(`id`, `cancelAddTaskBtn${thisTaskId}`);
                            cancelAddTaskBtnEle.setAttribute(`class`, `newTaskBtn`);
                            cancelAddTaskBtnEle.innerText = `X`;

                            newTaskBtnsDiv.appendChild(confirmBtnEle);
                            newTaskBtnsDiv.appendChild(cancelAddTaskBtnEle);
                        newTaskInput.appendChild(newTaskBtnsDiv);
                };

                const confirmTaskBtn = document.getElementById(`confirmTaskBtn${thisTaskId}`);

                const cancelAddTaskBtn = document.getElementById(`cancelAddTaskBtn${thisTaskId}`);

                //"+" button after new task name has been entered
                const confirmTaskBtnFunction = () => {
                    const newTaskName = document.getElementById(`taskName${thisTaskId}`);

                    //get input value from new task input
                    const inputValue = newTaskName.value;

                    //add task to task array of project
                    this.addTaskToList(this.createTask(inputValue));
                    console.log(this);

                    //identify and set task to make it accessable to other functions
                    let newTaskIndex = this.taskList.findIndex(task => task.taskId == thisTaskId);
                    let thisTask = this.taskList[newTaskIndex];

                    //new element to replace the text input element for the task name
                    const taskReplacer = document.createElement('p');
                    taskReplacer.innerText = `${inputValue}`;

                    //replace input element with p element in dom
                    newTaskName.replaceWith(taskReplacer);

                    //set class of the new div to incompleteTask
                    const newTaskDiv = document.getElementById(`${thisTaskId}`);
                    newTaskDiv.setAttribute(`class`, `incompleteTask`);
                    
                    //Set isInputActive back to false so another input can be created
                    isInputActive = false;


                    const addListener = () => {
                        newTaskDiv.onclick = function(){
                            if(newTaskDiv.className == `incompleteTask`){
                                //change class of dom task
                                newTaskDiv.className = `completeTask`;
                                thisTask.toggleTaskCompleted()
                        
                            } else if(newTaskDiv.className == `completeTask`){
                                newTaskDiv.className = `incompleteTask`;
                                thisTask.toggleTaskCompleted();
                                
                            };

                            updateStorage();
                        };
                    };
                    setTimeout(addListener, 100);

                    //toggle task complete/incomplete in task array
                    

                    confirmTaskBtn.style.display = `none`;
                    confirmTaskBtn.removeEventListener(`click`, confirmTaskBtnFunction);

                    updateStorage();
                        
                };
                confirmTaskBtn.addEventListener(`click`, confirmTaskBtnFunction);


                //Remove task button "X", to remove task from project task array and dom
                const cancelTaskFunc = () => {

                    //remove task from task viewer in dom
                    const taskInDom = document.getElementById(`${thisTaskId}`);
                    taskViewer.removeChild(taskInDom);

                    //remove task from project task array
                    this.removeTaskFromList(thisTaskId)

                };
                cancelAddTaskBtn.addEventListener(`click`, cancelTaskFunc);
            };
            addTaskBtn.addEventListener('click', createTaskInput);

            //Remove project from dom and project array
            const removeProjectFunction = () => {
                if(confirm(`Delete this project?`) == true){
                    //remove project from dom
                    const projToRemoveDom = document.getElementById(`${this.projectId}`);
                    projectViewer.removeChild(projToRemoveDom);
        
                    //remove project from project array
                    projectHolder.removeProject(this.projectId);
        
                    //close project detail popup
                    projDetailPopup.remove();
                    createMainDiv.popupActive = false;

                    updateStorage();
                };
            };
            deleteProjBtn.addEventListener('click', removeProjectFunction);
        
            this.displayTasks();
        };
    };
};

//only allow 1 new task input to be active at once
let isInputActive = false;

function Task(name, projectId, projectTaskCounter) {
        this.taskId = `${projectId}.${projectTaskCounter}`,
        this.owningProject = projectId,
        this.taskCompleted = false,
        this.name = name,
    
        this.toggleTaskCompleted = function() {
            if(this.taskCompleted === false){
                this.taskCompleted = true;
            } else if(this.taskCompleted === true){this.taskCompleted = false};
            updateStorage();
        };
}



//local storage functions

const updateStorage = () => {
    localStorage.setItem(`projectArray`, JSON.stringify(projectHolder.projectArr));
};

const getStoredProjectArray = () => {
    let getProjectArray = localStorage.getItem(`projectArray`);
    let parsedObject = JSON.parse(getProjectArray);
    return parsedObject
}

window.addEventListener(`load`, function(){
    if(localStorage.length > 0){
    const getProjectArray = this.localStorage.getItem(`projectArray`);
    
    let parsedObject = JSON.parse(getProjectArray);

    //create each individual project from local storage
    parsedObject.forEach((project) => {
        
        //first create the project
        let savedProject = projectHolder.createProject(project.name, project.dueDate, project.id);

        //create the saved tasks and add them to the new task list
        project.taskList.forEach((task) => {
            const savedTask = savedProject.createTask(task.name);

            if(task.taskCompleted === true){
                savedTask.taskCompleted = true;
            };

            savedProject.addTaskToList(savedTask);
        });

        //create a project card in the dom
        createProjCard(project.name, project.dueDate);

        //add the final savedProject to the projectHolder
        projectHolder.addProject(savedProject);
        
    })

    }
});

//Sorting functions
const sortBy = (range) => {
    projectViewer.innerHTML = ``;

    let currentDate = Date.now();

    if(localStorage.length > 0){
        let projArray = getStoredProjectArray();

        projArray.forEach((project) => {
            let dateDifference = differenceInCalendarDays(project.dueDate, currentDate);

            if(dateDifference <= range){
                redoExistingProjCard(project.name, project.dueDate, project.projectId);
            }
        })
    }
};

const viewMonthBtn = document.getElementById(`viewMonthBtn`);
viewMonthBtn.onclick = function(){sortBy(30)};

const viewWeekBtn = document.getElementById(`viewWeekBtn`);
viewWeekBtn.onclick = function(){sortBy(7)};

viewAllBtn.onclick = function(){
    projectViewer.innerHTML = ``;

    let projArray = getStoredProjectArray();
    projArray.forEach((project) => {
        redoExistingProjCard(project.name, project.dueDate, project.projectId)
    })
};


//function to create project cards for any given project
const redoExistingProjCard = (name, due, id) => {
    const newProjCard = document.createElement('div');
        newProjCard.setAttribute('class', 'projCard');
        newProjCard.setAttribute(`id`, `${id}`);
        projectViewer.appendChild(newProjCard);

            const newProjTitle = document.createElement('h4');
            newProjTitle.innerText = `${name}`;
            newProjTitle.setAttribute(`class`, `projectTitle`);
            newProjCard.appendChild(newProjTitle);

            const newProjDueDate = document.createElement('h5');
            newProjDueDate.innerText = `${format(due, `MM/dd/yyyy`)}`;
            newProjDueDate.setAttribute(`class`, `projDueDate`);
            newProjCard.appendChild(newProjDueDate);

        newProjCard.addEventListener(`click`, function(e){
            projectHolder.projectArr.find(({projectId}) => projectId == e.target.id).createProjectDetail()
        });

        //change color of the card based on how close the date is to the due date
        let currentDate = Date.now();
        
        let dateDifference = differenceInCalendarDays(due, currentDate);
        console.log(dateDifference);

        if(dateDifference <= 3){
            newProjCard.classList.add(`dueNow`)
        } else if(dateDifference > 3 && dateDifference <= 10){
            newProjCard.classList.add(`dueSoon`)
        } else if(dateDifference > 10){
            newProjCard.classList.add(`dueLater`)
        }
}