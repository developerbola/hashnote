fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs_extra::init())
        .run(tauri::generate_context!())
        .expect("failed to run app");
}
