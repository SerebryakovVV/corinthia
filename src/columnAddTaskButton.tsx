import { useMainStore } from "./store"



export default function ColumnAddTaskButton({columnIndex}: {columnIndex: number}) {
  const setSidebarState = useMainStore(state => state.setSidebarState)
  const setNewTaskParentId = useMainStore(state => state.setNewTaskParentId)
  const activePath = useMainStore(state => state.activePath)


  const handleClick = () => {
    setSidebarState("add");
    setNewTaskParentId(activePath[columnIndex]);
  }

  return(
    <div  
    className="columnAddTaskButton"
      onClick={() => handleClick()}>
      +
    </div>
  )
}


