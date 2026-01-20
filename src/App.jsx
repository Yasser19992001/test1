import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
  const [filter, setFilter] = useState('all')
  const [currentTheme, setCurrentTheme] = useState('sun')
  const [inputValue, setInputValue] = useState('')
  const todoListRef = useRef(null)

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos))
    }
  }, [])

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    const text = inputValue.trim()
    if (text) {
      setTodos([...todos, { text, completed: false }])
      setInputValue('')
    }
  }

  const toggleTodo = (index) => {
    const newTodos = [...todos]
    newTodos[index].completed = !newTodos[index].completed
    setTodos(newTodos)
  }

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed))
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const activeCount = todos.filter(todo => !todo.completed).length

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }

  const toggleTheme = () => {
    setCurrentTheme(prevTheme => prevTheme === 'sun' ? 'moon' : 'sun')
  }

  // Drag and drop handlers
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index)
    e.target.style.opacity = '0.5'
  }

  const handleDragEnd = (e) => {
    e.target.style.opacity = ''
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'))
    const targetElement = e.target.closest('li')
    
    if (targetElement) {
      const targetIndex = Array.from(targetElement.parentNode.children).indexOf(targetElement)
      
      if (draggedIndex !== targetIndex) {
        const newTodos = [...todos]
        const [draggedItem] = newTodos.splice(draggedIndex, 1)
        newTodos.splice(targetIndex, 0, draggedItem)
        setTodos(newTodos)
      }
    }
  }

  return (
    <div className="main-container">
      <div 
        className="top-section"
        style={{
          backgroundImage: currentTheme === 'sun' 
            ? 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(\'https://images.unsplash.com/photo-1506744038136-46273834b3fb\')'
            : 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(\'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee\')',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center'
        }}
      >
      </div>
      
      <div 
        className="middle-card"
        style={{
          backgroundColor: currentTheme === 'moon' ? '#333' : 'white',
          color: currentTheme === 'moon' ? 'white' : '#333'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '25px' }}>
          <h1>Todo</h1>
          <button 
            className={`theme-toggle inside-card ${currentTheme === 'moon' ? 'moon' : ''}`}
            onClick={toggleTheme}
            style={{
              background: currentTheme === 'moon' ? 'transparent' : 'rgb(61, 54, 54)',
              color: 'white'
            }}
          >
            {currentTheme === 'sun' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>
        </div>
        
        <div className="input-group">
          <div 
            className="circle" 
            onClick={addTodo}
            style={{
              borderColor: currentTheme === 'moon' ? '#a8a176' : '#ccc',
              backgroundColor: currentTheme === 'moon' ? '#333' : 'transparent'
            }}
          ></div>
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Create a new todo..." 
            style={{
              color: currentTheme === 'moon' ? 'white' : '#333',
              backgroundColor: 'transparent'
            }}
          />
        </div>
        
        <ul 
          id="todo-list" 
          ref={todoListRef}
          onDragOver={handleDragOver}
        >
          {filteredTodos.map((todo, index) => {
            const originalIndex = todos.indexOf(todo)
            return (
              <li 
                key={originalIndex}
                className={todo.completed ? 'completed' : ''}
                draggable
                onDragStart={(e) => handleDragStart(e, originalIndex)}
                onDragEnd={handleDragEnd}
                onDrop={handleDrop}
              >
                <span>{todo.text}</span>
                <div 
                  className="checkmark"
                  onClick={() => toggleTodo(originalIndex)}
                >
                  {todo.completed ? '✓' : ''}
                </div>
              </li>
            )
          })}
        </ul>
        
        <div 
          className={`footer ${currentTheme === 'sun' ? '' : 'sun-theme'}`}
          style={{
            backgroundColor: currentTheme === 'sun' ? '#f8f9fa' : '#333',
            color: currentTheme === 'sun' ? '#333' : 'white'
          }}
        >
          <span id="items-left">{activeCount} items left</span>
          <div className="filters">
            <button 
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'active' : ''}
              style={{
                backgroundColor: filter === 'all' 
                  ? (currentTheme === 'sun' ? '#2b2531' : '#595169')
                  : (currentTheme === 'sun' ? 'rgb(218, 211, 211)' : '#555'),
                color: (filter === 'all' || currentTheme === 'moon') ? 'white' : '#242325'
              }}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('active')}
              className={filter === 'active' ? 'active' : ''}
              style={{
                backgroundColor: filter === 'active' 
                  ? (currentTheme === 'sun' ? '#2b2531' : '#595169')
                  : (currentTheme === 'sun' ? 'rgb(218, 211, 211)' : '#555'),
                color: (filter === 'active' || currentTheme === 'moon') ? 'white' : '#242325'
              }}
            >
              Active
            </button>
            <button 
              onClick={() => setFilter('completed')}
              className={filter === 'completed' ? 'active' : ''}
              style={{
                backgroundColor: filter === 'completed' 
                  ? (currentTheme === 'sun' ? '#2b2531' : '#595169')
                  : (currentTheme === 'sun' ? 'rgb(218, 211, 211)' : '#555'),
                color: (filter === 'completed' || currentTheme === 'moon') ? 'white' : '#242325'
              }}
            >
              Completed
            </button>
            <button 
              onClick={clearCompleted}
              style={{
                backgroundColor: currentTheme === 'sun' ? 'rgb(218, 211, 211)' : '#555',
                color: currentTheme === 'moon' ? 'white' : '#242325'
              }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
      
      <div 
        className={`bottom-section ${currentTheme === 'moon' ? 'dark-theme' : ''}`}
        style={{
          backgroundColor: currentTheme === 'moon' ? '#333' : 'white',
          color: currentTheme === 'moon' ? 'white' : '#333'
        }}
      >
        <div 
          className="drag-note"
          style={{
            backgroundColor: currentTheme === 'moon' ? '#333' : 'white',
            color: currentTheme === 'moon' ? '#ddd' : '#1b1a1a'
          }}
        >
          Drag and drop to reorder list
        </div>
      </div>
    </div>
  )
}

export default App
