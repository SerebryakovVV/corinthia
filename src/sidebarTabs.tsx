import { useMainStore } from "./store"

export default function SidebarTabs() {
  const setSidebarState = useMainStore(state => state.setSidebarState)
  
  return(
    <div id="sidebarTabs">
      <div className="sidebarTab" onClick={()=>setSidebarState("active_task")}>active</div>
      <div className="sidebarTab" onClick={()=>setSidebarState("add")}>add</div>
      <div className="sidebarTab" onClick={()=>setSidebarState("deadlines")}>deadline</div>
      <div className="sidebarTab" onClick={()=>setSidebarState("timed_tasks")}>timed</div>
      <div className="sidebarTab" onClick={()=>setSidebarState("books")}>books</div>
    </div>
  )
}


