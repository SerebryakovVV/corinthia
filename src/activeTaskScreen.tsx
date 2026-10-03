import { invoke } from "@tauri-apps/api/core";
import { useMainStore } from "./store"

export default function ActiveTaskScreen() {
  const activeTask = useMainStore(state => state.activeTask)
  const setActiveTask = useMainStore(state => state.setActiveTask)
  const activePath = useMainStore(state => state.activePath)
  const setActivePath = useMainStore(state => state.setActivePath)

  // task_id: i64,
  //   parent_id: i64,
  //   position: i64

  const handleDelete = async () => {
    try {
      invoke(
        "delete_task", {
          taskId: activeTask?.id,
          parentId: activeTask?.parentId,
          position: activeTask?.position})
      setActiveTask(null);
      setActivePath(activePath.slice(0, -1))
    } catch (e) {
      console.log(e);
    }
  }

  return(
    <div>
      { activeTask
      ? <div>
          <div>Name: {activeTask.name}</div>
          <div>Description: {activeTask.description}</div>
          <div>Deadline: {activeTask.deadline}</div>
          <div>IsDone: {activeTask.isDone}</div>
          <div>createdAt: {activeTask.createdAt}</div>
          <div>id: {activeTask.id}</div>
          <div>parentId: {activeTask.parentId}</div>
          <div>position: {activeTask.position}</div>
          
          <button onClick={handleDelete}>delete</button>
        </div>
      : <div>No task selected</div>
      }
    </div>
  )
}