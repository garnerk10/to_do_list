import { format } from 'date-fns';
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

        const viewAll = document.createElement('h2');
        viewAll.innerText = 'View All';
        viewAll.setAttribute('id', 'viewAllBtn');
        sideBar.appendChild(viewAll);

        const newProject = document.createElement('h2');
        newProject.innerText = 'New Project';
        newProject.setAttribute('id', 'newProjBtn');
        sideBar.appendChild(newProject);
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
    let newDue = projDueInput.value;
    
    projectHolder.addProject(projectHolder.createProject(newName, newDue));

    createProjCard(newName, newDue);

    projNameInput.value = '';
    projDueInput.value = '';

    projectHolder.projCounter++;
    console.log(projectHolder);
    togglePopup();

};
confirmBtn.addEventListener('click', confirmNewProj);


//add new project card to dom
const createProjCard = (name, due) => {
    const projCounterValue = projectHolder.projCounter;
    const newProjCard = document.createElement('div');
    newProjCard.setAttribute('class', 'projCard');
    newProjCard.setAttribute(`id`, `${projCounterValue}`);
    projectViewer.appendChild(newProjCard);

        const newProjTitle = document.createElement('h4');
        newProjTitle.innerText = `${name}`;
        newProjTitle.setAttribute(`class`, `projectTitle`);
        newProjCard.appendChild(newProjTitle);

        const newProjDueDate = document.createElement('h5');
        newProjDueDate.innerText = `${due}`;
        newProjDueDate.setAttribute(`class`, `projDueDate`);
        newProjCard.appendChild(newProjDueDate);

    newProjCard.addEventListener(`click`, function(e){
        projectHolder.projectArr.find(({projectId}) => projectId == e.target.id).createProjectDetail()
    })

}


//Create new projects and store them in array
const projectHolder = (() => {
    let projectArr = [];
    let projCounter = 0;

    const addProject = (obj) => {
        projectArr.push(obj);
        console.log(projectHolder);
    };

    const createProject = (str, num) => {
        return str = new Project(str, num);
    };

    const removeProject = (num) => {
        let removeIndex = projectArr.findIndex(proj => proj.projectId == num);
        projectArr.splice(removeIndex, removeIndex + 1);
        console.log(projectHolder);
    }

    return{projectArr, addProject, projCounter, removeProject, createProject};
})();



class Project {
    constructor(name, dueDate) {
        this.name = name;
        this.dueDate = dueDate;
        this.taskList = [];
        this.taskCounter = 0;
        this.projectId = projectHolder.projCounter;
    };

    addTaskToList(taskName) {
        this.taskList.push(taskName);
        this.taskCounter++;
    };

    createTask(taskName) {
        return taskName = new Task(taskName, this.projectId, this.taskCounter);
    }

    removeTaskFromList(taskIdNum){
        this.taskList = this.taskList.filter(task => task.taskId !== taskIdNum);
    };

    toggleTask(id){
        this.taskList.find(({taskId}) => taskId == id).toggleTaskCompleted()
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
                    <h2 class="detailDue">${this.dueDate}</h2>
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

                    //new element to replace the input element
                    const taskReplacer = document.createElement('p');
                    taskReplacer.innerText = `${inputValue}`;

                    //replace input element with p element in dom
                    newTaskName.replaceWith(taskReplacer);

                    //set class of the new div to incompleteTask
                    const newTaskDiv = document.getElementById(`${thisTaskId}`);
                    newTaskDiv.setAttribute(`class`, `incompleteTask`);
                    
                    //Set isInputActive back to false so another input can be created
                    isInputActive = false;

                    confirmTaskBtn.style.display = `none`;
                    confirmTaskBtn.removeEventListener(`click`, confirmTaskBtnFunction);

                    const addListenter = () => {
                        //add ability to change class of div in the dom to show if task is completed or not
                        newTaskDiv.onclick = domTaskToggle;

                        //add ability to change if task is complete/incomplete in the project task array
                        this.toggleTask(thisTaskId);

                        //remove task from project array
                        cancelAddTaskBtn.onclick = projectHolder.projectArr.find(({projectId}) => projectId == this.projectId).removeTaskFromList(this.projectId);
                    }
                    setTimeout(addListenter(this.projectId), 100);
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
        };
}

//Toggle whether a task is completed or not in dom
const domTaskToggle = (e) => {
    const divId = e.target.id;

    if(e.target.className == `incompleteTask`){
        //change class of dom task
        e.target.className = `completeTask`;

    } else if(e.target.className == `completeTask`){
        e.target.className = `incompleteTask`;

    };
};