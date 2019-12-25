class Model {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || []
    }

    addTodo(todoText) {
        const todo = {
            id: this.todos.length > 0 ? this.todos[this.todos.length - 1].id + 1 : 1,
            todo: todoText,
            isComplete: false,
        }

        this.todos.push(todo)

        this._commit(this.todos)
    }

    editTodo(id, updateTodo) {
        this.todos = this.todos.map(todo => todo.id === id ? {id: todo.id, todo: updateTodo, isComplete: todo.isComplete} : todo );

        this._commit(this.todos)
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);

        this._commit(this.todos)
    }

    toggleTodo(id) {
        this.todos = this.todos.map(todo => todo.id === id ? {id: todo.id, todo: todo.todo, isComplete: !todo.isComplete} : todo );

        this._commit(this.todos)
    }

    removeAllTodo() {
        this.todos = this.todos.filter(todo => todo.isComplete !== true);

        this._commit(this.todos)
    }

    toggleAllTodo() {
        let flag = false;
        for (let i=0; i < this.todos.length; i++) {
            if (!this.todos[i].isComplete) {
                flag = true;
                break;
            }
        }
        this.todos = (flag) ? this.todos.map(todo => todo = {id: todo.id, todo: todo.todo, isComplete: true}) :
                            this.todos.map(todo => todo = {id: todo.id, todo: todo.todo, isComplete: false})
        this._commit(this.todos)
    }

    bindTodoListChanged(callback) {
        this.onTodoListChanged = callback
    }

    _commit(todos) {
        this.onTodoListChanged(todos)
        localStorage.setItem('todos', JSON.stringify(todos))
    }
}

class View {
    constructor() {
        this.app = this.getElement('#root')

        this.header = this.createElement('header', 'text-center')
        this.h1 = this.createElement('h1', 'title')
        this.h1.textContent = 'todos'
        this.form = this.createElement('form', 'add')
        this.form.classList.add = ('text-center')
        this.btnSubmit = this.createElement('button', 'btn-add')
        this.btnSubmit.type = 'button'
        this.iconbtn = this.createElement('i', 'fas')
        this.iconbtn.classList.add('fa-chevron-down')
        this.input = this.createElement('input', 'input-add')
        this.input.type = 'text'
        this.input.name = 'add'
        this.input.placeholder = 'What needs to be done?'
        this.btnSubmit.append(this.iconbtn)
        this.form.append(this.btnSubmit, this.input)
        this.header.append(this.h1, this.form)

        this.main = this.createElement('main')
        this.todoList = this.createElement('ul', 'todos')
        this.todoList.classList.add('list-group', 'mx-auto')
        this.main.append(this.todoList)

        this.footer = this.createElement('footer')
        this.ul = this.createElement('ul', 'action')
        this.ul.classList.add('d-flex', 'justify-content-between', 'align-items-center')
        this.li = this.createElement('li')
        this.liAction = this.createElement('li', 'action__main')
        this.all = this.createElement('a')
        this.all.href = '#'
        this.all.textContent = 'All'
        this.active = this.createElement('a')
        this.active.href = '#active'
        this.active.textContent = 'Active'
        this.completed = this.createElement('a')
        this.completed.href = '#completed'
        this.completed.textContent = 'Completed'
        this.liClear = this.createElement('li')
        this.delete = this.createElement('button', 'delete')
        this.delete.type = 'button'
        this.delete.textContent = 'Clear completed'
        this.liClear.append(this.delete)
        this.liAction.append(this.all, this.active, this.completed)
        this.ul.append(this.li, this.liAction, this.liClear)
        this.footer.append(this.ul)

        this.app.append(this.header, this.main, this.footer)

        this._temporaryTodoText
    }

    createElement(tag, className) {
        const element = document.createElement(tag)
        if (className) element.classList.add(className)

        return element;
    }

    getElement(selector) {
        const element = document.querySelector(selector)
        
        return element;
    }

    displayTodos(todos) {
        while (this.todoList.firstChild) {
            this.todoList.removeChild(this.todoList.firstChild)
        }

        if (todos.length === 0) {
            this.li.textContent = '0 item left';
        } else {
            this.li.textContent = todos.length + ' items left';
            todos.forEach(todo => {
                const li = this.createElement('li', 'todolist');
                li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
                li.id = todo.id;

                const divcheckbox = this.createElement('div', 'round');
                divcheckbox.id = todo.id
                const inputcheckbox = this.createElement('input');
                inputcheckbox.type = 'checkbox';
                inputcheckbox.id = todo.id + 'id';
                inputcheckbox.checked = todo.isComplete;

                const labelcheckbox = this.createElement('label');
                labelcheckbox.htmlFor = todo.id + 'id';
                divcheckbox.append(inputcheckbox, labelcheckbox);

                const title = this.createElement('span', 'todos__content');
                title.classList.add('edittable');
                title.textContent = todo.todo;
                title.contentEditable = true;

                const btndelete = this.createElement('i', 'delete');
                btndelete.classList.add('fa-times', 'fas');

                if (todo.isComplete) {
                    const s = this.createElement('s');
                    s.textContent = todo.todo;
                    title.textContent = '';
                    title.append(s);
                } else  {
                    title.textContent = todo.todo;
                }

                li.append(divcheckbox, title, btndelete);

                this.todoList.append(li);
            })
        }
    }

    eventAddTodo(handler) {
        this.form.addEventListener('submit', event => {
            event.preventDefault()
            if (this.input.value) {
                handler(this.input.value)
                this.input.value = ''
            }
        })
    }

    eventToggleTodo(handler) {
        this.todoList.addEventListener('change', event => {
            if (event.target.type === 'checkbox') {
                const id = parseInt(event.target.parentElement.id)

                handler(id)
            }
        })
    }

    eventDeleteTodo(handler) {
        this.todoList.addEventListener('click' , event => {
            if (event.target.classList[0] === 'delete') {
                const id = parseInt(event.target.parentElement.id)

                handler(id)
            }
        })
    }

    eventEditTodo(handler) {
        this.todoList.addEventListener('focusout', event => {
            this._temporaryTodoText = event.target.textContent
            if (this._temporaryTodoText != '') {
                const id = parseInt(event.target.parentElement.id)

                handler(id, this._temporaryTodoText)
                this._temporaryTodoText = ''
            }
        })
    }

    eventHideTodo(todos) {
        this.liAction.addEventListener('click', event => {
            todos.filter(todo => {
                switch(event.target.innerText) {
                    case 'Active':
                        if (todo.isComplete) {
                            document.getElementById(`${todo.id}`).className = 'd-none';
                        } else {
                            document.getElementById(`${todo.id}`).className = 'todolist list-group-item d-flex justify-content-between align-items-center';
                        };
                        break;
                    case 'Completed':
                        if (!todo.isComplete) {
                            document.getElementById(`${todo.id}`).className = 'd-none';
                        } else {
                            document.getElementById(`${todo.id}`).className = 'todolist list-group-item d-flex justify-content-between align-items-center';
                        };
                        break;
                    case 'All':
                        document.getElementById(`${todo.id}`).className = 'todolist list-group-item d-flex justify-content-between align-items-center';
                        break;
                }
            })
        })
    }

    eventRemoveAllTodo(handler) {
        this.liClear.addEventListener('click', handler)
    }


    toggleAllTodo(handler) {
        this.btnSubmit.addEventListener('click', () => {
            handler();
        })
    }
}

class Controller {
    constructor(model, view) {
        this.model = model
        this.view = view

        this.view.eventAddTodo(this.handlerAddTodo)
        this.view.eventToggleTodo(this.handlerToggleTodo)
        this.view.eventDeleteTodo(this.handlerDeleteTodo)
        this.view.eventEditTodo(this.handlerEditTodo)
        this.view.eventRemoveAllTodo(this.handlerRemoveAllTodo)
        this.view.toggleAllTodo(this.handlerToggleAllTodo)
        this.model.bindTodoListChanged(this.onTodoListChanged)
        this.onTodoListChanged(this.model.todos)
    }

    onTodoListChanged = todos => {
        this.view.displayTodos(todos)
        this.view.eventHideTodo(todos)
    }

    handlerAddTodo = todo => {
        this.model.addTodo(todo)
    }

    handlerEditTodo = (id, todo) => {
        this.model.editTodo(id, todo)
    }

    handlerDeleteTodo = id => {
        this.model.deleteTodo(id)
    }

    handlerToggleTodo = id => {
        this.model.toggleTodo(id)
    }

    handlerRemoveAllTodo = () => {
        this.model.removeAllTodo()
    }

    handlerToggleAllTodo = () => {
        this.model.toggleAllTodo()
    }
}

const app = new Controller(new Model(), new View())