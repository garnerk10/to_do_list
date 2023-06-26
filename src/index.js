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
    console.log(projectHolder.projectArr);
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

    newProjCard.onclick = (e) => {createProjDetail(projectHolder.projectArr.find(ele => ele.id == e.target.id))};

}


//Create new projects and store them in array
const projectHolder = (() => {
    const projectArr = [];
    let projCounter = 0;

    const addProject = (obj) => {
        projectArr.push(obj);
    };

    return{projectArr, addProject, projCounter};
})();

//project constructor
const createProject = (name, dueDate) => {
    const id = projectHolder.projCounter;
    let taskList = [];
    let taskCounter = 0;

    const createTask = (task) => {
        const taskId = taskCounter;
        return {task, taskId}
    };

    const addTaskToList = (task) => {
        taskList.push(createTask(task));
        taskCounter++;
    };

    return {name, dueDate, id, taskList, addTaskToList, taskCounter};
};


//Project Detail Popup
//create project detail popup
const createProjDetail = (proj) => {

    if(createMainDiv.popupActive === false){
        createMainDiv.popupActive = true;

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
                <h3 id="deleteTaskBtn">Delete Task</h3>
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
        const deleteTaskBtn = document.getElementById('deleteTaskBtn');
        const deleteProjBtn = document.getElementById('deleteProjBtn');

        //Create task entry inputs
        const createTaskInput = () => {
            let thisTaskId = proj.taskCounter;

            if(isInputActive === false){
                isInputActive = true;

                const newTaskInput = document.createElement('div');
                newTaskInput.setAttribute(`id`, `newTaskInput${thisTaskId}`);
                newTaskInput.setAttribute(`class`, `newTaskInput`);
                taskViewer.appendChild(newTaskInput);

                    const taskInputEle = document.createElement('input');
                    taskInputEle.setAttribute(`id`, `taskName${thisTaskId}`);
                    taskInputEle.setAttribute(`placeholder`, `New Task`);
                    taskInputEle.setAttribute(`name`, `taskName${thisTaskId}`);
                    newTaskInput.appendChild(taskInputEle);

                    const newTaskBtnsDiv = document.createElement('div');
                    newTaskBtnsDiv.setAttribute(`id`, `newTaskBtns`);

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

                isInputActive = false;
                confirmTaskBtn.removeEventListener(`click`, confirmTaskBtnFunc);
            };
            confirmTaskBtn.addEventListener(`click`, confirmTaskBtnFunc);


            //Remove task button to remove task from project task array and dom
            const cancelTaskFunc = (e) => {

                //remove task from task viewer in dom
                const taskInDom = document.getElementById(`newTaskInput${thisTaskId}`);
                taskViewer.removeChild(taskInDom);

                //remove task from project task array
                proj.taskList = proj.taskList.filter(task => task.taskId !== thisTaskId);

            };
            cancelAddTaskBtn.addEventListener(`click`, cancelTaskFunc);
        };
        addTaskBtn.addEventListener('click', createTaskInput);
        

    }
}