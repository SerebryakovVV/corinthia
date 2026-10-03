import ColumnAddTaskButton from "./columnAddTaskButton"
import ColumnTask from "./columnTask"
import { useMainStore } from "./store"


export default function Column({columnIndex}:{columnIndex: number}) {
  const siblingTasks = useMainStore(state => state.tasks[columnIndex])
  return (
    <div className="column">
       <div>
        {siblingTasks.map((task, taskIndex) =>(
          <ColumnTask 
            key={task.id} 
            id={task.id}
            name={task.name}
            parentId={task.parentId}
            isDone={task.isDone}
            columnIndex={columnIndex}
            taskIndex={taskIndex}
            />
        ))}  
      </div>
     <ColumnAddTaskButton columnIndex={columnIndex}/>
    </div>
  )
}





