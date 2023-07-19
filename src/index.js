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
    const newProject = createProject(newName, newDue);

    projectHolder.addProject(newProject);

    createProjCard(newName, newDue);

    projNameInput.value = '';
    projDueInput.value = '';

    projectHolder.projCounter++;
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

    newProjCard.onclick = (e) => {createProjDetail(projectHolder.projectArr.find(({projectId}) => projectId == e.target.id))};

}


//Create new projects and store them in array
const projectHolder = (() => {
    let projectArr = [];
    let projCounter = 0;

    const addProject = (obj) => {
        projectArr.push(obj);
    };

    const removeProject = (num) => {
        projectArr = projectArr.filter(proj => proj.id !== num);
    }

    return{projectArr, addProject, projCounter, removeProject};
})();


//Set active project being viewed in dom so it can be accessed by other functions
const activeProjectController = (() => {
    let isProjDetailActive = false;
    let activeProject = {};
    const setActiveProject = (num) => {
        if(isProjDetailActive === false){
            activeProjectController.activeProject = projectHolder.projectArr.find(({projectId}) => projectId == num);
        };
        console.log(activeProjectController.activeProject);
    };
    return{isProjDetailActive, activeProject, setActiveProject};
})();


//project factory function
const createProject = (name, dueDate) => {
    const projectId = projectHolder.projCounter;
    let taskList = [];
    let taskCounter = 0;

    class Task {
        constructor(name) {
            this.taskId = `${projectId}.${taskCounter}`,
            this.owningProject = projectId,
            this.taskCompleted = false,
            this.name = name,

            this.toggleTaskCompleted = function(){
                if(this.taskCompleted === false){
                    this.taskCompleted = true;
                } else if(this.taskCompleted === true){this.taskCompleted = false};
            }
        }
    }

    const createTask = (str) => {
        return str = new Task(str);
    }

    function addTaskToList(task) {
            taskList.push(createTask(task));
            taskCounter++;
            console.log(taskList);
        }

    //display tasks from taskList in project detail
    const displayTasks = () => {
        taskList.forEach((task) => {
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

                const taskName = document.createElement(`p`);
                taskName.innerText = `${task.name}`;
                taskBeingAdded.appendChild(taskName);

                const btnHolder = document.createElement(`div`);
                btnHolder.className = `newTaskBtns`;
                taskBeingAdded.appendChild(btnHolder);
                
                    const cancelBtn = document.createElement(`h4`);
                    cancelBtn.setAttribute(`id`, `cancelAddTaskBtn${task.taskId}`);
                    cancelBtn.setAttribute(`class`, `newTaskBtn`);
                    cancelBtn.innerText = `X`;
                    btnHolder.appendChild(cancelBtn);

                    cancelBtn.addEventListener(`click`, function(){
                        //remove task from task viewer in dom
                        const taskInDom = document.getElementById(`${task.taskId}`);
                        taskViewer.removeChild(taskInDom);

                        //remove task from project task array
                        taskList = taskList.filter(each => each.taskId !== task.taskId);
                    })

        })
    }

    return {name, dueDate, projectId, taskList, addTaskToList, taskCounter, displayTasks};
};

//Toggle whether a task is completed or not in dom
const domTaskToggle = (e) => {
    const divId = e.target.id;

    if(e.target.className == `incompleteTask`){
        e.target.className = `completeTask`;

        //Access the projectHolder array, match the proj ID to the activeProject, match the taskId to the id of the target div
        //projectHolder.projectArr.find((proj) => proj.id == activeProjectController.activeProject.id).taskList.find((tsk) => tsk.id == divId).toggleTaskCompleted();

        let thisProject = activeProjectController.activeProject;
        console.log(activeProjectController.activeProject);
        let thisTaskList = thisProject.taskList;
        console.log(thisTaskList);
        let thisTask = thisTaskList.find(({taskId}) => taskId == divId);
        console.log(thisTask);
        thisTask.toggleTaskCompleted();
    } else if(e.target.className == `completeTask`){
        e.target.className = `incompleteTask`;

        //projectHolder.projectArr.find((proj) => proj.id === activeProjectController.activeProject.id).taskList.find((tsk) => tsk.id === divId).toggleTaskCompleted();
        let thisProject = activeProjectController.activeProject;
        let thisTaskList = thisProject.taskList;
        let thisTask = thisTaskList.find(({taskId}) => taskId == divId);
        thisTask.toggleTaskCompleted();
        
    };

    console.log(projectHolder.projectArr);
};

//Project Detail Popup
//create project detail popup
const createProjDetail = (proj) => {

    if(createMainDiv.popupActive === false){
        createMainDiv.popupActive = true;

        const detailId = proj.projectId;
        activeProjectController.setActiveProject(detailId);
        console.log(activeProjectController.activeProject);


        //only allow 1 input active at once
        let isInputActive = false;

        const projDetailPopup = document.createElement('div');
        projDetailPopup.setAttribute('id', 'projDetailPopup');
        projDetailPopup.setAttribute('class', 'projDetailPopup');
        mainDiv.appendChild(projDetailPopup);
        
            projDetailPopup.innerHTML = `
            <div id="detailHeader">
                <h2 class="detailTitle">${proj.name}</h2>
                <h2 class="detailDue">${proj.dueDate}</h2>
                <h5 id="closeBtn">X</h5>
            </div>

            <div id="detailTaskViewer"></div>

            <div id="detailFooter">
                <h3 id="addTaskBtn">Add Task</h3>
                <h3 id="deleteProjBtn">Delete Project</h3>
            </div>`;

        //Close button and ensure multiple popups don't appear
        const closeBtn = document.getElementById('closeBtn');
        closeBtn.onclick = () => {
            projDetailPopup.remove();
            createMainDiv.popupActive = false;
        };

        //Functions within project detail popup
        const taskViewer = document.getElementById('detailTaskViewer');
        const addTaskBtn = document.getElementById('addTaskBtn');
        const deleteProjBtn = document.getElementById('deleteProjBtn');

        //Create task entry inputs that will become task holders
        const createTaskInput = () => {
            let thisTaskId = `${proj.projectId}.${proj.taskCounter}`;

            if(isInputActive === false){
                isInputActive = true;

                const newTaskInput = document.createElement('div');
                newTaskInput.setAttribute(`id`, `${thisTaskId}`);
                newTaskInput.setAttribute(`class`, `newTaskInput`);
                taskViewer.appendChild(newTaskInput);

                    const taskInputEle = document.createElement('input');
                    taskInputEle.setAttribute(`id`, `taskName${thisTaskId}`);
                    taskInputEle.setAttribute(`placeholder`, `New Task`);
                    taskInputEle.setAttribute(`name`, `taskName${thisTaskId}`);
                    newTaskInput.appendChild(taskInputEle);

                    const newTaskBtnsDiv = document.createElement('div');
                    newTaskBtnsDiv.setAttribute(`class`, `newTaskBtns`);

                        const confirmBtnEle = document.createElement('h4');
                        confirmBtnEle.setAttribute(`id`, `confirmTaskBtn${thisTaskId}`);
                        confirmBtnEle.setAttribute(`class`, `newTaskBtn`);
                        confirmBtnEle.innerText = `+`;

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
            const newTaskDiv = document.getElementById(`${thisTaskId}`)

            //"+" button after new task name has been entered
            const confirmTaskBtnFunc = () => {

                const newTaskName = document.getElementById(`taskName${thisTaskId}`);

                //get input value from new task input
                const inputValue = newTaskName.value;

                //add task to task array of project
                proj.addTaskToList(inputValue);
                proj.taskCounter++;

                //new element to replace the input element
                const taskReplacer = document.createElement('p');
                taskReplacer.innerText = `${inputValue}`;

                //replace input element with p element in dom
                newTaskName.replaceWith(taskReplacer);

                //set class of the new div to incompleteTask
                newTaskDiv.setAttribute(`class`, `incompleteTask`);
                
                //Set isInputActive back to false so another input can be created
                isInputActive = false;

                confirmTaskBtn.style.display = `none`;
                confirmTaskBtn.removeEventListener(`click`, confirmTaskBtnFunc);

                const addListenter = () => {
                    newTaskDiv.onclick = domTaskToggle;
                }
                setTimeout(addListenter, 100);
                
            };
            confirmTaskBtn.addEventListener(`click`, confirmTaskBtnFunc);



            //Remove task button "X", to remove task from project task array and dom
            const cancelTaskFunc = () => {

                //remove task from task viewer in dom
                const taskInDom = document.getElementById(`${thisTaskId}`);
                taskViewer.removeChild(taskInDom);

                //remove task from project task array
                proj.taskList = proj.taskList.filter(task => task.taskId !== thisTaskId);

            };
            cancelAddTaskBtn.addEventListener(`click`, cancelTaskFunc);

        };
        addTaskBtn.addEventListener('click', createTaskInput);

        //Remove project from dom and project array
        const removeProjFunc = () => {
            
            if(confirm(`Delete this project?`) == true){
            //remove project from dom
            const projToRemoveDom = document.getElementById(`${detailId}`);
            projectViewer.removeChild(projToRemoveDom);

            //remove project from project array
            projectHolder.removeProject(detailId);

            //close project detail popup
            projDetailPopup.remove();
            createMainDiv.popupActive = false;
            };
        };
        deleteProjBtn.addEventListener(`click`, removeProjFunc);
        

    };

    proj.displayTasks();
}