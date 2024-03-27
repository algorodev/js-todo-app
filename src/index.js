const todoFormElement = document.getElementById('todo-form'),
	todoListElement = document.getElementById('todo-list')
let todoList = []

document.addEventListener('DOMContentLoaded', () => {
	const localData = getLocalData()
	if (localData) todoList.push(...localData)
	if (todoList.length) refreshTodoList()
})

todoFormElement.addEventListener('submit', (event) => {
	event.preventDefault()

	let { value } = document.getElementById('title')

	if (value === '') return

	const item = createTodoItem(value)
	assignTodoItemToList(item)
	saveLocalData()
	refreshTodoList()

	todoFormElement.reset()
})

const createTodoItem = (title) => ({
	id: `todo-${todoList.length + 1}`,
	title,
	completed: false
})

const assignTodoItemToList = (item) => {
	todoList.push(item)
}

const refreshTodoList = () => {
	clearTodoList()
	todoList.forEach(todo => {
		const listElement = createListElement(todo)
		todoListElement.append(listElement)
		assignEventListeners(todo)
	})
}

const createListElement = (todo) => {
	const listElement = document.createElement('li')
	listElement.id = todo.id
	listElement.innerHTML = `
			<article class="todo">
				<h4 id="todo-item-${todo.id}" class="todo-title ${todo.completed ? 'completed' : ''}">${todo.title}</h4>
				<svg id="trash-item-${todo.id}" class="todo-action ${todo.completed ? 'completed' : ''}" width="24px" height="24px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
						<title>delete [#1487]</title>
						<desc>Created with Sketch.</desc>
						<defs></defs>
						<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
								<g id="Dribbble-Light-Preview" transform="translate(-179.000000, -360.000000)" fill="#212121">
										<g id="icons" transform="translate(56.000000, 160.000000)">
												<path d="M130.35,216 L132.45,216 L132.45,208 L130.35,208 L130.35,216 Z M134.55,216 L136.65,216 L136.65,208 L134.55,208 L134.55,216 Z M128.25,218 L138.75,218 L138.75,206 L128.25,206 L128.25,218 Z M130.35,204 L136.65,204 L136.65,202 L130.35,202 L130.35,204 Z M138.75,204 L138.75,200 L128.25,200 L128.25,204 L123,204 L123,206 L126.15,206 L126.15,220 L140.85,220 L140.85,206 L144,206 L144,204 L138.75,204 Z" id="delete-[#1487]"></path>
										</g>
								</g>
						</g>
				</svg>
			</article>
		`

	return listElement
}

const clearTodoList = () => {
	todoListElement.replaceChildren()
}

const saveLocalData = () => {
	localStorage.setItem('list', JSON.stringify(todoList))
}

const getLocalData = () => {
	return JSON.parse(localStorage.getItem('list'))
}

const assignEventListeners = (todo) => {
	const todoElement = document.getElementById(`todo-item-${todo.id}`)
	const trashElement = document.getElementById(`trash-item-${todo.id}`)

	todoElement.addEventListener('click', () => {
		const item = getTodoById(todo.id)
		updateTodoById(item)
		refreshTodoList()
	})

	trashElement.addEventListener('click', () => {
		deleteTodoById(todo)
		refreshTodoList()
	})
}

const getTodoById = (id) => {
	return todoList.find((todo) => todo.id === id)
}

const updateTodoById = (todo) => {
	todo.completed = !todo.completed
	saveLocalData()
}

const deleteTodoById = (todo) => {
	todoList = todoList.filter((item) => item.id !== todo.id)
	saveLocalData()
}
