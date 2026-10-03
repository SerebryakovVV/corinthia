// check the scrolls
// 2 tabs for sidebar
// saved paths status bar at the bottom of the sidebar with colored dots
// add the backend functions for timed tasks and for getting the ancestry of a task
// hover for add task button, and move it to the bottom
// look into adding a field to the store for the parent id currently beind added to 
// new logic for loading tasks with loading only new columns
// drag and drop
// hotkeys
// check if get_task function is needed at all
// todo: add another component for a timed task
// check the display logic after task deletion
// when adding a task get the id back and set it as active, also mutate the main array on front side

import "./App.css";

import Sidebar from "./sidebar";
import ColumnsScreen from "./columnsScreen";

function App() {
  return (
    <>
      <ColumnsScreen/>
      <Sidebar/>
    </>
  );
}

export default App;






