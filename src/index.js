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
})();
const mainDiv = document.getElementById('mainDiv');


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

        /*const projectsSideDiv = document.createElement('div');
        projectsSideDiv.setAttribute('id', 'projectsSideDiv');
        sideBar.appendChild(projectsSideDiv);

            const projectsSideLabel = document.createElement('h3');
            projectsSideLabel.innerText = "Projects";
            projectsSideDiv.appendChild(projectsSideLabel);

            const projectsSideHolder = document.createElement('div');
            projectsSideHolder.setAttribute('id', 'projectsSideHolder');
            projectsSideHolder.setAttribute('class', 'projectsSideHolder');
            sideBar.appendChild(projectsSideHolder);*/
})();

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
    } else {newProjPopup.style.display = 'none'}
}
newProjBtn.addEventListener('click', togglePopup);


//"Add" button functionality on new project popup
const confirmNewProj = () => {
    let newName = projNameInput.value;
    let newDue = projDueInput.value;
    const newProject = createProject(newName, newDue);

    projectHolder.addProject(newProject);
    
    console.log(projectHolder.projectArr);

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

    newProjCard.onclick = () => {createProjDetail(projectHolder.projectArr[projCounterValue])};

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

const createProject = (name, dueDate) => {
    let id = projectHolder.projCounter;
    let taskList = [];

    return {name, dueDate, id, taskList}
};


const createProjDetail = (proj) => {
    const projDetailPopup = document.createElement('div');
    projDetailPopup.setAttribute('id', 'projDetailPopup');
    projDetailPopup.setAttribute('class', 'projDetailPopup');
    mainDiv.appendChild(projDetailPopup);
    
        projDetailPopup.innerHTML = `
        <div id="detailHeader">
            <h2 id="detailTitle">${proj.name}</h2>
            <h2 id="detailDue">${proj.dueDate}</h2>
            <h5 id="closeBtn">X</h5>
        </div>

        <div id="detailTaskViewer"></div>

        <div id="detailFooter">
            <h3 id="addTaskBtn">Add Task</h3>
            <h3 id="deleteTaskBtn">Delete Task</h3>
            <h3 id="deleteProjBtn">Delete Project</h3>
        </div>`;
}