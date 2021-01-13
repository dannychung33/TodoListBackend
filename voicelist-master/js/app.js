const clear = document.querySelector(".clear");
const dateElement = document.getElementById("date");
const list = document.getElementById("list");
const input = document.getElementById("input");

const CHECK = "fa-check-circle";
const UNCHECK = "fa-circle-thin";
const LINE_THROUGH = "lineThrough";

let LIST, id;

let data = localStorage.getItem("TODO");

if(data){
    LIST = JSON.parse(data);
    id = LIST.length;
    loadList(LIST);
}
else{
    LIST = [];
    id = 0;
}

function loadList(array){
    array.forEach(function(item){
        addToDo(item.name, item.id, item.done, item.trash);
    })
}

clear.addEventListener("click", function(){
    localStorage.clear();
    location.reload();
})

const options = {weekday: "long", month: "short", day: "numeric"};
const today = new Date();
dateElement.innerHTML = today.toLocaleDateString("en-US", options);

function addToDo(toDo, id, done, trash){
    if(trash){return; }

    const DONE = done ? CHECK : UNCHECK;
    const LINE = done ? LINE_THROUGH : "";
    const item = `
        <li class="item">
        <i class="fa ${DONE} co" job="complete" id="${id}"></i>
        <button class ="btn btn-format" style="font-size:24px">edit<!--<i class = "fa fa-pencil edit" job = "edit" id = "${id}"></i>--></button>
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
        if(toDo){
            addToDo(toDo, id, false, false);
            LIST.push({
                name: toDo,
                id: id,
                done: false,
                trash: false
            });
            localStorage.setItem("TODO", JSON.stringify(LIST));
            id++;
        }
        input.value = "";
    }
});

function completeToDo(element){
    element.classList.toggle(CHECK);
    element.classList.toggle(UNCHECK);
    element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);

    LIST[element.id].done = LIST[element.id].done ? false : true;
}

function removeToDo(element){
    element.parentNode.parentNode.removeChild(element.parentNode);

    LIST[element.id].trash = true;
}

function editToDo(element){

    console.log("it works!");
    

    const editItem = `
        <li class="item">
        <input job = "edit-box" type="text" id="edit-input" placeholder="Edit to-do" />
        </li>
    `;
    const position = "beforeend";
    list.insertAdjacentHTML(position, editItem);
    
    let editBox = document.querySelector('#edit-input');
    editBox.addEventListener('keyup', () => {
        if(event.keyCode == 13){
            const toDo = editBox.value;
            console.log(toDo);
            LIST[element.name] = toDo;
        }
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
        completeToDo(element);
    }

    
    const editBtn = event.target;
    console.log(editBtn);
    
    
        
    if(editBtn.getAttribute("class") === 'btn') {
        if(editBtn.textContent === 'edit')
        {
            console.log("test btn");
            const para = editBtn.parentNode.lastElementChild;
            const li = editBtn.parentNode.parentNode;
            console.log(para);
            console.log(li);
            console.log(para.textContent);
            const input = document.createElement('input');
            input.id = "edit-input";
            input.type = 'text';
            input.value = para.textContent;
            console.log("start");
            li.firstElementChild.insertBefore(input, para);
            val = input;
            console.log(input.value);
            li.firstElementChild.removeChild(para);
            console.log("finish");
            editBtn.textContent = 'save';
            console.log("done");
        } 
        else if(editBtn.textContent === 'save') {
            console.log("running");
            const li = editBtn.parentNode;
            const input = val;
            console.log(val);
            const para2 = document.createElement('p');
            para2.textContent = input.value;
            para2.id = "edit-input";
            li.insertBefore(para2, input);
            li.removeChild(input);
            editBtn.textContent = 'edit';

        }
    }
  
      
    else if(elementJob == "delete"){
        removeToDo(element);
    }
    localStorage.setItem("TODO", JSON.stringify(LIST));
});