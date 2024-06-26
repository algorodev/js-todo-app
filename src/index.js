const todoFormElement = document.getElementById('todo-form')
const todoListElement = document.getElementById('todo-list')
const filters = ['all', 'active', 'completed']
let todoList = []
let lastId = 0
let lastTimestamp = Date.now()
let filter = 'all'

document.addEventListener('DOMContentLoaded', () => loadTodoList())

todoFormElement.addEventListener('submit', (event) => handleFormSubmit(event))

filters.forEach((filter) => {
	document.getElementById(`${filter}-filter`)
		.addEventListener('click', () => handleFilterClick(filter))
})

const loadTodoList = () => {
	const localData = getLocalData()

	if (localData.length) {
		todoList = localData
		sortTodoListPerDate()
		refreshTodoList()
	}
}

const handleFormSubmit = (event) => {
	event.preventDefault()

	const titleInput = document.getElementById('title')
	const title = titleInput.value.trim()

	if (title) {
		addTodo(title)
		titleInput.value = ''
	}
}

const addTodo = (title) => {
	const todoItem = createTodoItem(title)
	todoList.push(todoItem)
	saveLocalData()
	sortTodoListPerDate()
	refreshTodoList()
}

const createTodoItem = (title) => ({
	id: generateTodoId(),
	title,
	completed: false,
	createdAt: new Date().toISOString(),
})

const generateTodoId = () => {
	const timestamp = Date.now()

	if (timestamp === lastTimestamp) {
		lastId++
	} else {
		lastId = 0
		lastTimestamp = timestamp
	}

	return `todo-${timestamp}-${lastId}`
}

const refreshTodoList = () => {
	clearTodoList()

	const filteredTodoList = filterTodoList()
	filteredTodoList.forEach(todo => {
		const listElement = createListElement(todo)
		todoListElement.append(listElement)
	})
}

const createListElement = (todo) => {
	const listElement = document.createElement('li')
	listElement.id = todo.id
	listElement.innerHTML = `
			<article class="todo">
				<h4 class="todo-title ${todo.completed ? 'completed' : ''}">${todo.title}</h4>
				<svg class="todo-action ${todo.completed ? 'completed' : ''}" width="16px" height="16px" viewBox="0 -0.5 21 21" xmlns="http://www.w3.org/2000/svg">
						<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
								<g id="Dribbble-Light-Preview" transform="translate(-179.000000, -360.000000)" fill="#333">
										<g id="icons" transform="translate(56.000000, 160.000000)">
												<path d="M130.35,216 L132.45,216 L132.45,208 L130.35,208 L130.35,216 Z M134.55,216 L136.65,216 L136.65,208 L134.55,208 L134.55,216 Z M128.25,218 L138.75,218 L138.75,206 L128.25,206 L128.25,218 Z M130.35,204 L136.65,204 L136.65,202 L130.35,202 L130.35,204 Z M138.75,204 L138.75,200 L128.25,200 L128.25,204 L123,204 L123,206 L126.15,206 L126.15,220 L140.85,220 L140.85,206 L144,206 L144,204 L138.75,204 Z" id="delete-[#1487]"></path>
										</g>
								</g>
						</g>
				</svg>
			</article>
		`

	listElement.addEventListener('click', () => handleTodoClick(todo.id))

	return listElement
}

const handleTodoClick = (todoId) => {
	const todo = getTodoById(todoId)
	todo.completed ? deleteTodoById(todo) : markTodoAsCompleted(todo)
	saveLocalData()
	refreshTodoList()
}

const clearTodoList = () => {
	todoListElement.innerHTML = ''
}

const saveLocalData = () => {
	localStorage.setItem('todoList', JSON.stringify(todoList))
}

const getLocalData = () => JSON.parse(localStorage.getItem('todoList')) || []

const getTodoById = (id) => todoList.find((todo) => todo.id === id)

const markTodoAsCompleted = (todo) => {
	todo.completed = !todo.completed
}

const deleteTodoById = (todo) => {
	todoList = todoList.filter((item) => item.id !== todo.id)
}

const sortTodoListPerDate = () => {
	todoList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

const handleFilterClick = (filterValue) => {
	filter = filterValue

	filters.forEach((filter) => {
		document.getElementById(`${filter}-filter`)
			.classList.remove('active')
	})

	document.getElementById(`${filterValue}-filter`).classList.add('active')

	refreshTodoList()
}

const filterTodoList = () => {
	switch (filter) {
		case 'active':
			return todoList.filter((todo) => !todo.completed)
		case 'completed':
			return todoList.filter((todo) => todo.completed)
		default:
			return todoList
	}
}
