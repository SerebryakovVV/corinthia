import { create } from "zustand";


export type Task = {
  id: number,
  name: string,
  description: string | null,
  parentId: number | null,
  deadline: number | null,
  isDone: boolean,
  createdAt: number,
  position: number
}


type ActivePath = (number | null)[]

type SidebarStates = "active_task" | "add" | "deadlines" | "books" | "search"

export type DbPath = {
  id: number,
  value: number[]
}


type mainStoreType = {
  activeTask: Task | null,
  tasks: Task[][],
  activePath: ActivePath,   
  savedPaths: DbPath[],
  sidebarState: SidebarStates,
  newTaskParentId: number | null,
  tasksChangeBeenHandled: boolean,
  setTasks: (tasks: Task[][]) => void,
  setActivePath: (activePath: ActivePath) => void,
  setSavedPaths: (savedPaths: DbPath[]) => void,
  updateActiveTask: (updates: Partial<Task>) => void,
  setActiveTask: (activeTask: Task | null) => void,
  setSidebarState: (sidebarState: SidebarStates) => void
  setNewTaskParentId: (newTaskParentId: number | null) => void
  setTasksChangeBeenHandled: (tasksChangeBeenHandled: boolean) => void,
}


export const useMainStore = create<mainStoreType>((set) => ({
  activeTask: null,
  tasks: [[]],
  activePath: [null],
  savedPaths: [],
  sidebarState: "active_task",
  newTaskParentId: null,
  tasksChangeBeenHandled: true,
  setTasks: tasks => set({tasks}),
  setActivePath: activePath => set({activePath}),
  setSavedPaths: savedPaths => set({savedPaths}),
  updateActiveTask: updates =>
    set(state => ({
        activeTask: state.activeTask
            ? { ...state.activeTask, ...updates }
            : null
    })),
  setActiveTask: activeTask => set({activeTask}),
  setSidebarState: sidebarState => set({sidebarState}),
  setNewTaskParentId: newTaskParentId => set({newTaskParentId}),
  setTasksChangeBeenHandled: tasksChangeBeenHandled => set({tasksChangeBeenHandled}),
}))





export function activePathToString(path: ActivePath): string {
  return path.slice(1).join(" ");
}

export function dbPathExtractConvertToActivePath(dbPath: DbPath): ActivePath {
  return [null, ...dbPath.value]
}