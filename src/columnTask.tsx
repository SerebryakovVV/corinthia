import { useMainStore } from "./store"


type ColumnTaskType = {
  id: number, 
  name: string, 
  parentId: number | null,
  isDone: boolean,
  columnIndex: number,
  taskIndex: number
}


export default function ColumnTask({id, name, parentId, isDone, columnIndex, taskIndex}: ColumnTaskType) {
  const tasks = useMainStore(state => state.tasks)
  const activePath = useMainStore(state => state.activePath)
  const setActivePath = useMainStore(state => state.setActivePath)
  const setActiveTask = useMainStore(state => state.setActiveTask)
  const setSidebarState = useMainStore(state => state.setSidebarState)
  
  const handleSelect = async () => {
    try {
      setActiveTask(tasks[columnIndex][taskIndex]);
      setActivePath([...activePath.slice(0, columnIndex+1), id]);
      setSidebarState("active_task");
    } catch(e) {
      console.log(e);
    }
  }

  return (
    <div 
      style={{backgroundColor: activePath.includes(id) ? "lightBlue" : "white"}}
      onClick={()=>handleSelect()}>
        {id}: {name}
    </div>
  )
}

