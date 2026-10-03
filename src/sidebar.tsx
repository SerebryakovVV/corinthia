import ActiveTaskScreen from "./activeTaskScreen";
import AddTaskScreen from "./addTaskScreen";
import BooksScreen from "./booksScreen";
import DeadlinesScreen from "./deadlinesScreen";
import SearchScreen from "./searchScreen";
import SidebarPathsBlock from "./sidebarPathsBlock";
import SidebarTabs from "./sidebarTabs";
import { useMainStore } from "./store";



const sidebarScreens = {
  active_task: <ActiveTaskScreen/>,     // active task, can be null
  add: <AddTaskScreen/>,                // if not set throuh column-add-button the parent is last item in the active path
  deadlines: <DeadlinesScreen/>,        // sorted deadlined tasks
  books: <BooksScreen/>,                // the list of book type tasks, with progress
  search: <SearchScreen/>               // search
}


export default function Sidebar() {
  const sidebarState = useMainStore(state => state.sidebarState)
  return(
    <div id="sidebar">
      <SidebarTabs/>
      { sidebarScreens[sidebarState] }  
      <SidebarPathsBlock/>
    </div>
  )
}