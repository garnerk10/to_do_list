import { format } from 'date-fns';
import './style.css';

const createContent = (() => {
    const content  = document.createElement('div');
    content.setAttribute('id', 'content');
    document.body.appendChild(content);
})();
const content = document.getElementById('content');

const projectHolder = (() => {
    const projectArr = [];

    return{projectArr};
})();

const createProject = (name, dueDate) => {
    this.name = name,
    this.dueDate = dueDate,
    this.id = projectHolder.projectArr.length,
}


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