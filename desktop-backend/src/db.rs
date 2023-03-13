use std::{fs::create_dir_all, path::PathBuf, sync::Arc};

use polodb_core::Collection;
use serde::Serialize;

use crate::types::{Competition, Team};

const APP_NAME: &str = "SAWACA";

pub fn get_db_path() -> PathBuf {
    create_dir_all(
        tauri::api::path::data_dir()
            .unwrap()
            .as_path()
            .join(APP_NAME),
    )
    .unwrap();

    #[cfg(not(debug_assertions))]
    return tauri::api::path::data_dir()
        .unwrap()
        .as_path()
        .join(APP_NAME)
        .join("prod.db");

    #[cfg(debug_assertions)]
    return tauri::api::path::data_dir()
        .unwrap()
        .as_path()
        .join(APP_NAME)
        .join("test.db");
}

pub struct Db {
    db: polodb_core::Database,
    comp_name: Arc<Option<String>>,
}
impl Db {
    pub fn new() -> Self {
        println!("Opening db at {:?}", get_db_path());
        let db = polodb_core::Database::open_file(get_db_path()).unwrap();
        Self {
            db,
            comp_name: Arc::new(None),
        }
    }
    pub fn collection<T>(&self, name: &str) -> Collection<T>
    where
        T: Serialize,
    {
        self.db.collection(name)
    }

    pub fn get_comps(&self) -> Result<Vec<Competition>, String> {
        let comps = self.collection::<Competition>("competitions");

        comps.find_many(None).map_err(|e| e.to_string())
    }
    pub fn get_team_collection(&self) -> Option<Collection<Team>> {
        let comp_name = &*(self.comp_name);

        Some(self.collection(comp_name.as_deref()?))
    }
}

impl Default for Db {
    fn default() -> Self {
        Self::new()
    }
}
