const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const listColumns = document.querySelectorAll('.drag-itemlist');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items

let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let currentColumn;
let draggedItem;
let dragging = false;
// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
}


// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
  const arrayNames = ['backlog', 'progress', 'complete', 'onHold']
  listArrays.forEach((list,index)=> {
    localStorage.setItem(`${arrayNames[index]}Items`, JSON.stringify(list));
  });
  
}

// filter arrays to  remove empty items

function filterArray(array) {
  const filteredArray = array.filter(item => item !== null);
  return filteredArray
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute('ondragstart', 'drag(event)');
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`);

  // append
  columnEl.appendChild(listEl);

}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) {
    getSavedColumns();
  }
  // Backlog Column
  backlogList.textContent = '';
  backlogListArray.forEach((backlogItem, index) => {
    createItemEl(backlogList,0, backlogItem, index)
  }) 
  backlogListArray = filterArray(backlogListArray);
  // Progress Column
  progressList.textContent = '';
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList,1, progressItem, index)
  }) 
  progressListArray = filterArray(progressListArray);
  // Complete Column
  completeList.textContent = '';
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList,2, completeItem, index)
  }) 
  completeListArray = filterArray(completeListArray);
  // On Hold Column
  onHoldList.textContent = '';
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList,3, onHoldItem, index)
  }) 
  onHoldListArray = filterArray(onHoldListArray);
  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();

}

// update otem - delete if nesseasary or update array value;

function updateItem(id, column) {
  const selectedArray = listArrays[column];
  console.log('selecyted array: ', selectedArray);
  const selectedCoulumnEl = listColumns[column].children;
  console.log('selectedCoulumnEl: ', selectedCoulumnEl[id].textContent);
  if (!dragging) {
    if(!selectedCoulumnEl[id].textContent) {
      delete selectedArray[id];
      updateDOM();
    } else {
      selectedArray[id] = selectedCoulumnEl[id].textContent;
    }
  
  }
}

//  ass to column list, reset textbox

function addToColumn(column) {
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = '';
  updateDOM();
}




// show add item input box

function showInputBox(column) {
  addBtns[column].style.visibility = 'hidden';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display = 'flex';
}

// hide add item input box

function hideInputBox(column) {
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';
  addToColumn(column);
}
// allow arrays to reflect drag and drop items
function rebuildArrays() {
  backlogListArray =Array.from(backlogList.children).map(i => i.textContent);
  progressListArray = Array.from(progressList.children).map(i => i.textContent);
  completeListArray = Array.from(completeList.children).map(i => i.textContent);
  onHoldListArray = Array.from(onHoldList.children).map( i=> i.textContent);
  updateDOM();
}

// god like


// when starts dragging
function drag(e) {
  draggedItem = e.target;
  dragging = true;
}

// collumn llows for item to drop 
function allowDrop(e) {
  e.preventDefault();

}

// on  drag leave 
function dragLeave(column) {
  listColumns[column].classList.remove('over');
}
// then items enters column area
function dragEnter(column) {
  listColumns[column].classList.add('over');
  currentColumn = column;
  console.log('entered', currentColumn)
}

// dropping item in column
function drop(e) {
  e.preventDefault();
 
  // add iteem to column
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem);
   // remove background color padding
   listColumns[currentColumn].classList.remove('over');
  //  dragging complete
  dragging = false;
  rebuildArrays();
}


// onLOad
updateDOM();