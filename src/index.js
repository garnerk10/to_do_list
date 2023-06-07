import { format } from 'date-fns';
import './style.css';

const createContent = (() => {
    const content  = document.createElement('div');
    content.setAttribute('id', 'content');
    document.body.appendChild(content);
})();



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
        sideBar.appendChild(viewAll);

        const projectsSideDiv = document.createElement('div');
        projectsSideDiv.setAttribute('id', 'projectsSideDiv');
        sideBar.appendChild(projectsSideDiv);

            const projectsSideLabel = document.createElement('h3');
            projectsSideLabel.innerText = "Projects";
            projectsSideDiv.appendChild(projectsSideLabel);

            const projectsSideHolder = document.createElement('div');
            projectsSideHolder.setAttribute('id', 'projectsSideHolder');
            projectsSideHolder.setAttribute('class', 'projectsSideHolder');
            sideBar.appendChild(projectsSideHolder);
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
    projPopup.style.display = none;
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

        const addBtn = document.createElement('div');
        addBtn.setAttribute('id', 'addBtn');
        projPopup.appendChild(addBtn);

            const addBtnText = document.createElement('h3');
            addBtnText.innerText = `Add Project`;
            addBtn.appendChild(addBtnText);


})();

//Get elements from DOM
const viewAllBtn = document.getElementById('viewAllBtn');
const newProjPopup = document.getElementById('projPopup');
const projNameInput = document.getElementById('newProjName');
const projDueInput = document.getElementById('newProjDue');
const newProjBtn = document.getElementById('newProjBtn');
const mainDiv = document.getElementById('mainDiv');
const content = document.getElementById('content');




//Create new projects and store them in array
const projectHolder = (() => {
    const projectArr = [];

    const addProject = (obj) => {
        projectArr.push(obj);
    };

    return{projectArr, addProject};
})();

const createProject = (name, dueDate) => {
    let id = projectHolder.projectArr.length;
    let taskList = [];

    return {name, dueDate, id, taskList}
};
