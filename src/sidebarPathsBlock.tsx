import { useEffect } from "react"
import { DbPath, useMainStore } from "./store"
import { invoke } from "@tauri-apps/api/core"

export default function SidebarPathsBlock() {
  const savedPaths = useMainStore(state => state.savedPaths)
  const setSavedPaths = useMainStore(state => state.setSavedPaths)

  // load in useeffect
  // 10 saved paths
  // think about adding return to previous path logic
  
  // PIPELINE
  // rust returns id and int array, which can be stored in dbPath type, then dbPath can be converted to activePath type
  // to save a path we use activePathToString
  // to delete we update db, then clear the state

  useEffect(() => {
    // getPaths()
  }, [])

  const getPaths = async () => {
    try {
      const res = await invoke<DbPath[]>("get_paths");
      setSavedPaths(res)
    } catch(e) {
      console.log(e)
    }
  }

  return(
    <div id="pathsBar">
      {savedPaths.map(path => (
        <span>{path.id} </span>
      ))}    
    </div>
  )
}

