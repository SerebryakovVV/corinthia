
    // name: String,
    // description: Option<String>,
    // parent_id: Option<i64>,
    // deadline: Option<i64>

import { invoke } from "@tauri-apps/api/core";
import { useState } from "react"
import { useMainStore } from "./store";

export default function AddTaskScreen() {

  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");

  const newTaskParentId = useMainStore(state => state.newTaskParentId)
  const setSidebarState = useMainStore(state => state.setSidebarState)
  const setTasksChangeBeenHandled = useMainStore(state => state.setTasksChangeBeenHandled)

  const handleAdd = async () => {
    try {
      invoke("add_task", {
        name: formName, 
        description: formDescription, 
        parentId: newTaskParentId,
        deadline: null})
      setSidebarState("active_task")
      setTasksChangeBeenHandled(false)
    } catch (e) {
      console.log(e)
    }
  }

  return(
    <div>
      <div>ParentId: {newTaskParentId}</div>
      <div>// make it so clicking on a task sets the newTaskParentId</div>
      <input
        type="text" 
        placeholder="Name"
        value={formName}
        onChange={(e)=>setFormName(e.target.value)} />
      <input   
        type="text" 
        placeholder="Description"
        value={formDescription}
        onChange={(e)=>setFormDescription(e.target.value)} />
      <br />
      <button onClick={handleAdd}>add</button>
    </div>
  )
}







