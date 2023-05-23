import React, {useState, useEffect} from 'react';
import AddTaskForm from './Components/AddTaskForm.jsx';
import UpdateForm from "./Components/UpdateForm.jsx"; 
import ToDo from "./Components/ToDo.jsx";

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {


  const [toDo, setToDo] = useState([]); 

  const [newTask, setNewTask] = useState('');
  const [updateData, setUpdateData] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTasks()
  }, [])


  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

 
  const filteredTasks = toDo.filter((toDo) =>
    toDo.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

   
  const fetchTasks = async () => {
    if(localStorage.getItem('todos')){
      console.log("not fetching")
    }else{
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=6');
        const data = await response.json();
        setToDo(data);
        // alert('Tasks fetched successfully!');
      } catch (error) {
        console.error('Error fetching tasks:', error);
    }
    }
  };

  const addTask = () => {
    if(newTask) {
      let num = toDo.length + 1;
      let newEntry =  { id :num, title: newTask,  completed: false }
      setToDo([...toDo, newEntry])
      setNewTask('')
    }
  }

  useEffect(() => {
    if (localStorage.getItem('todos')) {
      const toDo = JSON.parse(localStorage.getItem('todos'));
      console.log('Replacing local storage', toDo);
      if (toDo) {
        setToDo(toDo);
      }
    }
  }, []);

  useEffect(() => {
    if(toDo?.length) {
      localStorage.setItem('todos', JSON.stringify(toDo));
    }
  }, [toDo]);

  const deleteTask = (id) => {
    let newTasks = toDo.filter( task => task.id !== id)
    setToDo(newTasks)
    localStorage.setItem('todos', JSON.stringify(newTasks));
  }

  const markDone = (id ) => {
    let newTasks = toDo.map( task => {
      if( task.id === id ){
      return({ ...task, status: !task.status })
    }
    return task;
    })
    setToDo(newTasks)
  }

  const cancelUpdate = () => {
    setUpdateData('')
  }
 
  const changeTask = (e) => {
    let newEntry = {
      id: updateData.id,
      title: e.target.value,
      status: updateData.status ? true : false
    }
    setUpdateData(newEntry); 
  }

  const updateTask = () => {
    let filterRecords = [...toDo].filter( task => task.id !== updateData.id);
    let updatedObject = [...filterRecords, updateData]
    setToDo(updatedObject);
    setUpdateData('');
  }

 

  return (
    <div className="container App"> 
      <br></br>
      <h2>To Do App</h2>
      <br></br>

      
      {updateData ? (
        <UpdateForm
        updateData={updateData}
        changeTask={changeTask}
        updateTask={updateTask}
        cancelUpdate={cancelUpdate}
        />
      ) : (
      <AddTaskForm
      newTask={newTask}
      setNewTask={setNewTask}
      addTask={addTask}
      />  
      )}  
       
       <input className='col search'
      type="text"
      placeholder="Search tasks..."
      value={searchQuery}
      onChange={handleSearchQueryChange}
      
    />

        
    {toDo && toDo.length ? '' : 'No Task...'}
    <ToDo
    toDo={toDo, filteredTasks }
    markDone={markDone}
    setUpdateData={setUpdateData}
    deleteTask={deleteTask}
    
    />

    
    </div>
  );
}

export default App;
 