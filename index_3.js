
//CONTROL DOM**********************************************************************************
window.addEventListener("load", (ev) =>{
    let container = document.querySelector("#root ul");
    
    document.querySelector("#mainForm").addEventListener("submit",(ev)=>{
        ev.preventDefault();
        const form = ev.target; 
        
        const textarea = form.querySelector("textarea");
        
        const button = form.querySelector("[type='submit']");
        button.disabled = true;

        let todo = new Todo({title: textarea.value});
        todo.save().then(()=>{
            textarea.value="";
            button.disabled=false;

            let li = buildDOMElement(todo);
            container.prepend(li);
        })

        return false;
    })

    //retorna los "todos" del servicio web
    Todo.all().then(todos=>{
        //iteramos los elementos
        todos.forEach(todo => {
            //construimos un nodo del DOM coon la funcion buildDOMElement
            let node = buildDOMElement(todo);
            //insertamos el nodo en el contenedor
            container.prepend(node);
        })
    });
    let buildDOMElement = (todo)=>{
        let li = document.createElement("li");
        li.innerHTML=`
        <h1>${todo.title}</h1>
        <button class="close">X</button>`;

        li.querySelector(".close").addEventListener("click", (ev)=>{
            todo.destroy();
            li.remove();
        })
        editInPlace(li.querySelector("h1"), todo);
        MostrarDetalles(li.querySelector("h1"), todo);
        return li;
    }

    let MostrarDetalles = (node, todo)=>{
        node.addEventListener("contextmenu", (ev)=>{
            ev.preventDefault();
           //Muestra los detalles de Todo
            alert(`
            id:           ${todo.id}
            title:        ${todo.title}
            Completed: ${todo.completed}
            `)
        })
    }
    let editInPlace = (node, todo)=>{
        node.addEventListener("click", (ev)=>{
            //reemplaza el nodo por un campo de texto, para luego editar
            console.log('Doble Click');
            let inputText = document.createElement("textarea");
             inputText.value = node.innerHTML;
             inputText.autofocus = true;

             node.replaceWith(inputText);

             inputText.addEventListener("change", (ev)=>{
                 inputText.replaceWith(node);
                 todo.title = inputText.value;

                 node.innerHTML = todo.title;

                 todo.save().then(r=>console.log(r));

             })
            //al finalizar la edición reemplazar el campo de texto por un nodo de vuelta
        })
    }
})
// FIN CONTROL DOM*****************************************************************************


//Consultar vía objeto y métodos
class Todo {
    static async all(){ //metodo All que será llamado en index.js
        let todos = await request({
            type: "listAll"
        });
        return todos.map( todosJSON => new Todo(todosJSON))
    }
    constructor(args){
       this.userId = args.userId;
       this.title = args.title; 
       this.completed = args.completed; 
       this.id = args.id; 
    }

    save = async() => {//utilizamos la arrow funtion para que no cambie el contexto
        if(this.id) return this.update();
        
        this.create();
    }
    create = async() => {
        let response = await request({
            type:"create",
            payload:{
                title: this.title
            }
        }).then(data=>this.id = data.id);
        return response;
    }
    update = async() => {
       let response = await request({
           type:"update",
           payload:{
               id:this.id,
               title: this.title
           }
       });
       return response;
    }
    destroy = async()=>{
        let response = await request({
            type:"destroy",
            payload:{
                id:this.id,
               
            }
        });
        return response; 
    }
}


//MODULO REQUEST peticiones ajax

const path = "todos" //para la url de la consulta
const endpoint = 'https://jsonplaceholder.typicode.com'

//recibe un objeto Json -action- que va a contener el type de acción a realizar ej: "update"
//también contendrá los elementos a enviar ej:title
/*{type: 'update'
payload: {title:'nuevo titulo'}
}*/
function request(action){
    let options = {
        method:getMethod(action)
    }
    return fetch(endpoint + getPath(action), options)
    .then(r=>r.json());
}

//va a recibir las opciones del request, lo que quiere el usuario realizar
//aplica el método a realizar
let getMethod = (action)=>{
    switch(action.type){
        case "create":
            return "POST"
        case "update":
            return "PUT"
        case "destroy":
            return "DELETE"
        case "list":
            return "GET" 
        case "listAll":
            return "GET"    
    }
}
//Dependiendo de la acción que se va a realizar la URL va a cambiar
let getPath = (action)=>{ 
    switch(action.type){
        case "create":
            return `/${path}`
        case "update":
            return `/${path}/${action.payload.id}`
        case "destroy":
            return `/${path}/${action.payload.id}`
        case "list":
            return `/${path}/${action.payload.id}`
        case "listAll":
            return `/${path}`  
    }
}
//FIN MODULO REQUEST peticiones ajax