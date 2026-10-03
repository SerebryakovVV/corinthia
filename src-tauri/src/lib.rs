pub mod db;
use std::sync;
use rusqlite;


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let db_path = if cfg!(debug_assertions) {
        "C:\\Users\\sereb\\main_files\\coding\\corinthia\\db.db"
    } else {
        "C:\\Users\\sereb\\AppData\\Local\\corinthia\\db.db"
    };
    let connection = rusqlite::Connection::open(db_path).expect("Failed to open db");
    connection.execute("PRAGMA foreign_keys = ON", []).unwrap();
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(db::DbConnection(sync::Mutex::new(connection)))
        .invoke_handler(tauri::generate_handler![
            crate::db::move_task,
            crate::db::delete_task,
            crate::db::get_tasks_by_parent_id,
            crate::db::add_task,
            crate::db::get_task,
            crate::db::set_is_done_value,
            crate::db::rename_task,
            crate::db::set_task_description,
            crate::db::set_task_deadline,
            crate::db::get_paths,
            crate::db::add_path,
            crate::db::delete_path,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}