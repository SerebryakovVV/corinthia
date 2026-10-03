import { useEffect } from "react"
import { Task, useMainStore } from "./store"
import { invoke } from "@tauri-apps/api/core"
import Column from "./column"

export default function ColumnsScreen() {
  const tasks = useMainStore(state => state.tasks)
  const setTasks = useMainStore(state => state.setTasks)
  const activePath = useMainStore(state => state.activePath)
  const tasksChangeBeenHandled = useMainStore(state => state.tasksChangeBeenHandled)
  const setTasksChangeBeenHandled = useMainStore(state => state.setTasksChangeBeenHandled)

  useEffect(() => {
    loadTasks();
  }, [activePath])

  useEffect(() => {
    if (!tasksChangeBeenHandled) {
      loadTasks()
      setTasksChangeBeenHandled(true)
    }
  }, [tasksChangeBeenHandled])

  const loadTasks = async () => {
    try {
      const res = await Promise.all(
        activePath.map(parentId => invoke<Task[]>('get_tasks_by_parent_id', { parentId })))
      setTasks(res)
      } catch (e) {
        console.log(e);
      }
  }

  return (
    <div id="columnsScreen">
      {tasks.map((_, index: number) => (
        <Column key={index} columnIndex={index}/>
      ))} 
    </div>
  )
}