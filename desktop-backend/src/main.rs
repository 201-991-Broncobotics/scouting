use comps::*;
use db::Db;
use polodb_core::bson::doc;
use schemas::*;
use scout::*;
use serde_json::Value;
use specta::{collect_types, specta};
use types::*;

mod comps;
mod db;
mod schemas;
mod scout;
mod types;

fn main() {
    #[cfg(debug_assertions)]
    tauri_specta::ts::export(
        collect_types![
            new_comp,
            get_comps,
            pit_scout,
            match_scout,
            upload_schema,
            get_schema,
            get_open_comp,
            open_comp,
            delete_comp
        ],
        "../desktop-frontend/src/lib/backend.ts",
    )
    .unwrap();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            new_comp,
            get_comps,
            pit_scout,
            match_scout,
            upload_schema,
            get_schema,
            get_open_comp,
            open_comp,
            delete_comp
        ])
        .manage(Db::new())
        .manage(SelectedComp::default())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
