

// !!!!!!!!!!!
// columns - clear, just columns, hover adds add button at the bottom of the column and buttons on a task, tasks have is_done value
// sidebar - bottom is for saved tasks, top has two tabs - current tasks and deadlined tasks
// think of adding names to the main path array elements, the saved paths will need to have them(?)





use rusqlite;
use std::sync::Mutex;
use tauri;
use serde::Serialize;


pub struct DbConnection(pub Mutex<rusqlite::Connection>);


#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Task {
    pub id: i64,
    pub name: String,
    pub description: Option<String>,
    pub parent_id: Option<i64>,
    pub deadline: Option<i64>,
    pub is_done: bool,
    pub created_at: i64,
    pub position: i64
}


#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Path {
    pub id: i64,
    pub value: Vec<i64>
}









// Connection
// query_row — execute SQL and return one row.
// query_one — execute SQL and require exactly one row.
// query_row_and_then — query_row with a custom error type.
// execute — execute SQL without returning rows.
// prepare — create a Statement.
// prepare_cached — create/reuse a cached Statement.
// last_insert_rowid — get the last inserted row ID.

// Statement
// query_row — return one row; ignores additional rows.
// query_one — return exactly one row.
// query_row_and_then — one row with custom error handling.
// query_map — iterate over rows and map each to a Rust type.
// query_and_then — iterate over rows with custom error handling.
// query — manually iterate over returned rows.
// exists — check whether the query returns any rows.
// execute — execute INSERT/UPDATE/DELETE; return affected-row count.
// insert — execute a single INSERT and return its ROWID.



















#[tauri::command]
pub fn move_task(
    db: tauri::State<DbConnection>,
    task_id: i64,
    new_parent_id: Option<i64>,
    old_parent_id: Option<i64>,
    new_position: i64,
    old_position: i64
) -> Result<(), String>
{
    let mut connection = db.0.lock().unwrap();
    let tx = connection.transaction().map_err(|e| e.to_string())?;
    if old_parent_id == new_parent_id {
        if new_position > old_position {
            tx.execute(
                "update tasks 
                 set position = position - 1 
                 where parent_id is ?1 and position > ?2 and position <= ?3",
                rusqlite::params![old_parent_id, old_position, new_position])
            .map_err(|e| e.to_string())?;
        } else {
            tx.execute(
                "update tasks 
                 set position = position + 1 
                 where parent_id is ?1 and position < ?2 and position >= ?3",
                rusqlite::params![old_parent_id, old_position, new_position])
            .map_err(|e| e.to_string())?;
        }
    } else {
        tx.execute(
            "update tasks
             set position = position - 1
             where parent_id is ?1 and position > ?2", 
            rusqlite::params![old_parent_id, old_position])
        .map_err(|e| e.to_string())?;
        tx.execute(
            "update tasks
             set position = position + 1
             where parent_id is ?1 and position >= ?2", 
            rusqlite::params![new_parent_id, new_position])
        .map_err(|e| e.to_string())?;
    }
    tx.execute(
        "update tasks 
         set parent_id = ?1, position = ?2 
         where id = ?3",
        rusqlite::params![new_parent_id, new_position, task_id])
    .map_err(|e| e.to_string())?;
    tx.commit().map_err(|e| e.to_string())?;
    Ok(())
}


#[tauri::command]
pub fn delete_task(
    db: tauri::State<DbConnection>, 
    task_id: i64,
    parent_id: i64,
    position: i64
) -> Result<(), String> 
{
    let mut connection = db.0.lock().unwrap();
    let tx = connection.transaction().map_err(|e| e.to_string())?;
    tx.execute(
        "update tasks 
         set position = position - 1 
         where parent_id = ?1 and position > ?2",
        [parent_id, position])
        .map_err(|e| e.to_string())?;
    tx.execute(
        "delete from tasks 
         where id = ?1",
        [task_id])
        .map_err(|e| e.to_string())?;
    tx.commit().map_err(|e| e.to_string())?;
    Ok(())
}


#[tauri::command]
pub fn get_tasks_by_parent_id(
    db: tauri::State<DbConnection>, 
    parent_id: Option<i64>
) -> Result<Vec<Task>, String> 
{
    let connection = db.0.lock().unwrap();
    let sql_string = 
        "select id, name, description, parent_id, deadline, is_done, created_at, position
         from tasks 
         where parent_id is ?1
         order by position";
    let mut statement = 
        connection
        .prepare(sql_string)
        .map_err(|e| e.to_string())?;
    let tasks = statement.query_map([parent_id], |row| {
         Ok(Task {
                id: row.get(0)?,
                name: row.get(1)?,
                description: row.get(2)?,
                parent_id: row.get(3)?,
                deadline: row.get(4)?,
                is_done: row.get(5)?,
                created_at: row.get(6)?,
                position: row.get(7)?,
            })
    }).map_err(|e| e.to_string())?
      .collect::<rusqlite::Result<Vec<Task>>>()
      .map_err(|e| e.to_string())?;
    Ok(tasks)
}


#[tauri::command]
pub fn add_task(
    db: tauri::State<DbConnection>, 
    name: String,
    description: Option<String>,
    parent_id: Option<i64>,
    deadline: Option<i64>
) -> Result<usize, String>
{
    let connection = db.0.lock().unwrap();
    let position = connection.query_row(
        "select count(*) from tasks where parent_id is ?1", 
        [parent_id], 
        |row| {let count: i64 = row.get(0)?; Ok(count)})
    .map_err(|e| e.to_string())?;
    connection.execute(
        "insert into tasks (name, description, parent_id, deadline, is_done, position)
         values (?1, ?2, ?3, ?4, ?5, ?6)", 
        rusqlite::params![name, description, parent_id, deadline, 0, position]
    ).map_err(|e| e.to_string())
}


#[tauri::command]
pub fn get_task(
    db: tauri::State<DbConnection>,
    id: i64
) -> Result<Task, String> 
{
    let connection = db.0.lock().unwrap();
    let get_task_sql_string = 
        "select id, name, description, parent_id, deadline, is_done, created_at, position 
         from tasks where id = ?1";
    let mut statement = connection.prepare(get_task_sql_string).map_err(|e| e.to_string())?;
    let task = statement
        .query_row([id], |row| {
            Ok(Task {
                id: row.get(0)?,
                name: row.get(1)?,
                description: row.get(2)?,
                parent_id: row.get(3)?,
                deadline: row.get(4)?,
                is_done: row.get(5)?,
                created_at: row.get(6)?,
                position: row.get(7)?,
            })
        })
        .map_err(|e| e.to_string())?;
    Ok(task)
}


#[tauri::command]
pub fn set_is_done_value(
    db: tauri::State<DbConnection>,
    task_id: i64,
    is_done: bool
) -> Result<usize, String>
{
    let connection = db.0.lock().unwrap();
    connection
        .execute(
            "update tasks 
             set is_done = ?1 
             where id = ?2",
            [is_done as i64, task_id])
        .map_err(|e| e.to_string())
}


#[tauri::command]
pub fn rename_task(
    db: tauri::State<DbConnection>, 
    new_name: &str, 
    task_id: i64
) -> Result<usize, String> 
{
    let connection = db.0.lock().unwrap();
    connection
        .execute(
            "update tasks 
             set name = ?1 
             where id = ?2", 
            rusqlite::params![new_name, task_id])
        .map_err(|e| e.to_string())
}


#[tauri::command]
pub fn set_task_description(
    db: tauri::State<DbConnection>, 
    task_id: i64,
    description: String
) -> Result<usize, String>
{
    let connection = db.0.lock().unwrap();
    connection
        .execute(
            "update tasks 
             set description = ?1 
             where id = ?2", 
            rusqlite::params![description, task_id])
        .map_err(|e| e.to_string())
}


#[tauri::command]
pub fn set_task_deadline(
    db: tauri::State<DbConnection>, 
    task_id: i64,
    deadline: i64
) -> Result<usize, String>
{
    let connection = db.0.lock().unwrap();
    connection
        .execute(
            "update tasks 
             set deadline = ?1 
             where id = ?2", 
            [deadline, task_id])
        .map_err(|e| e.to_string())
}


#[tauri::command]
pub fn get_paths(
    db: tauri::State<DbConnection>
) -> Result<Vec<Path>, String> 
{
    let connection = db.0.lock().unwrap();
    let mut statement = 
        connection
        .prepare("select id, value from paths")
        .map_err(|e| e.to_string())?;
    let paths_with_string_values: Vec<(i64, String)> = 
        statement
        .query_map([], |row| {
            Ok((row.get(0)?, row.get(1)?))})
        .map_err(|e| e.to_string())?
        .collect::<rusqlite::Result<Vec<(i64, String)>>>()
        .map_err(|e| e.to_string())?;
    let mut paths: Vec<Path> = Vec::new();
    for (id, value_string) in paths_with_string_values {
        let value: Vec<i64> = 
            value_string
            .split_whitespace()
            .map(|s| s.parse::<i64>())
            .collect::<Result<Vec<i64>, _>>()
            .map_err(|e| e.to_string())?;
        paths.push(
            Path { id, value }
        );
    }
    Ok(paths)
}


#[tauri::command]
pub fn add_path(
    db: tauri::State<DbConnection>, 
    value: String,
) -> Result<usize, String>
{
    let connection = db.0.lock().unwrap();
    connection
        .execute(
            "insert into paths (value)
             values (?1)", 
            [value])
        .map_err(|e| e.to_string())
}


#[tauri::command]
pub fn delete_path(
    db: tauri::State<DbConnection>, 
    path_id: i64
) -> Result<usize, String> 
{
    let connection = db.0.lock().unwrap();
    connection
        .execute(
            "delete from paths 
             where id = ?1", 
            [path_id])
        .map_err(|e| e.to_string())
}

