const clear = document.querySelector(".clear");
const dateElement = document.getElementById("date");
const list = document.getElementById("list");
const input = document.getElementById("input");

const CHECK = "fa-check-circle";
const UNCHECK = "fa-circle-thin";
const LINE_THROUGH = "lineThrough";

let LIST = [];
let id;

async function getDatabaseItems(){
    const response = await fetch('http://localhost:8080/items');
    const json = await response.json();
    console.log(json);
    return json;
    
}

const data = getDatabaseItems().then((data) => {
    if(data){
        LIST = data;
        //id = LIST.length;
        console.log(id);
        console.log(LIST);
        loadList(LIST);
    }
   
});

function loadList(array){
    let idList = [];
    let i = 0;
    array.forEach(function(item){
        addToDo(item.title, LIST[i].id, item.done);
        idList[i] = item.id;
        i++;
    })
    console.log(idList)
    return idList;
}

clear.addEventListener("click", function(event){
    const refreshIcon = event.target;
    const ul = refreshIcon.parentNode.parentNode.parentNode.children[1].children[0];
    console.log(ul);
    /*
    for(let i = 1; i < LIST.length+1; i++){
        removeToDo()
    }
    */
    //location.reload();
})

const options = {weekday: "long", month: "short", day: "numeric"};
const today = new Date();
dateElement.innerHTML = today.toLocaleDateString("en-US", options);

function addToDo(toDo, id, done){
    if(done == 0){
        done = false;
    }
    else{
        done = true;
    }
    const DONE = done ? CHECK : UNCHECK;
    const LINE = done ? LINE_THROUGH : "";
    const item = `
        <li class="item">
        <i class="fa ${DONE} co" job="complete" id="${id}"></i>
        <button class ="btn btn-format" style="font-size:24px" id="${id}">edit</button>
        <i class="fa fa-trash-o de" job="delete" id="${id}"></i>
        <p class="text ${LINE}">${toDo}</p> 
        </li>
    `;
    const position = "beforeend";
    list.insertAdjacentHTML(position, item);
}


document.addEventListener("keyup", function(event){
    
    if(event.keyCode == 13){
        const toDo = input.value;
        const done = 0;
        if(toDo){
            todoItem = {
                title: toDo,
                done: done,
                
            }
            postData("http://localhost:8080/items", todoItem)
            addToDo(toDo, LIST.length+1, done);
        }
        input.value = "";
    }
});

async function postData(url, data) {
    await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    
}
  

function completeToDo(element){
    
    element.classList.toggle(CHECK);
    element.classList.toggle(UNCHECK);
    console.log(element.parentNode);
    element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);
    console.log(element.getAttribute("class"))
    let done = 0;
    if(element.getAttribute("class") === "fa co " + CHECK){
        done = 1;
    }
    
    console.log(element.parentNode.lastElementChild.textContent);
    const title = element.parentNode.lastElementChild.textContent;
    dataObj = {
        title: title,
        done: done
    }
    console.log(dataObj.done)
    editData(`http://localhost:8080/items/${element.id}`, dataObj)
}

async function removeToDo(element){
    element.parentNode.parentNode.removeChild(element.parentNode);
    deleteData(`http://localhost:8080/items/${element.id}`);
    //location.reload();
}
async function deleteData(url) {
    await fetch(url, {
      method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
      
    });
    
}


let val = 0;
list.addEventListener("click", function(event){
    const element = event.target;
    console.log(element);
    let elementJob;

    if(element.getAttribute("Job") === 'undefined')
    {
        elementJob = "edit";
    }
    else if (element.getAttribute("Job"))
    {
        elementJob = element.attributes.job.value;
    }

    if(elementJob == "complete"){
        completeToDo(element, event);
    }

    
    const editBtn = event.target;
    console.log(editBtn);
        
    if(editBtn.getAttribute("class") === 'btn btn-format') {

        if(editBtn.textContent === 'edit')
        {
            para = editBtn.parentNode.lastElementChild;
            console.log("test btn");
            const li = editBtn.parentNode.parentNode;
            console.log(para);
            console.log(li);
            console.log(para.textContent);
            const elementIndex = (element.id-1);
            const input = document.createElement('input');
            input.id = "edit-input";
            input.type = 'text';
            input.value = para.textContent;
            console.log("start");
            console.log(elementIndex);
            li.children[elementIndex].insertBefore(input, para);
            val = input;
            console.log(input.value);
            li.children[elementIndex].removeChild(para);
            console.log("finish");
            editBtn.textContent = 'save';
            console.log("done");
            
        } 
        else if(editBtn.textContent === 'save') {
            console.log("running");
            const li = editBtn.parentNode;
            const input = val;
            console.log(val);
            
            para.textContent = input.value;
            let done = false;
            if(LIST[element.id] == 1){
                done = true;
            }
            
            const LINE = done ? LINE_THROUGH : "";
            para.class = "text " + LINE;
            li.insertBefore(para, input);
            li.removeChild(input);
            editBtn.textContent = 'edit';
            console.log(element.id);
            const data = {
                title: input.value,
                done: LIST[element.id-1].done
            }
            console.log(data.title)
            console.log(LIST[element.id-1].done)
            editData(`http://localhost:8080/items/${element.id}`, data)

        }
    }
  
      
    else if(elementJob == "delete"){
        removeToDo(element);
    }

});

async function editData(url, data) {
    await fetch(url, {
      method: 'PUT', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    
}