use std::sync::Mutex;

use bson::doc;
use specta::specta;

use crate::{db::Db, types::Competition};

#[derive(Default)]
pub struct SelectedComp {
    pub comp: Mutex<Option<Competition>>,
}

#[tauri::command]
#[specta]
pub fn get_comps(db: tauri::State<'_, Db>) -> Result<Vec<Competition>, String> {
    db.get_comps()
}

#[tauri::command]
#[specta]
pub fn new_comp(
    comp: Competition,
    state: tauri::State<'_, SelectedComp>,
    db: tauri::State<'_, Db>,
) -> Result<(), String> {
    let comps = db.collection::<Competition>("competitions");

    // see if the name is alr taken
    let old_comp = comps
        .find_one(doc! { "name": &comp.name })
        .map_err(|e| e.to_string())?;

    if let Some(_) = old_comp {
        return Err(String::from("competition already exists"));
    }

    // Now we know that this comp has a unique name (which is necessary for the team name thing)
    // so we can add it to the db

    comps.insert_one(comp.clone()).map_err(|e| e.to_string())?;

    {
        state.comp.lock().unwrap().replace(comp.clone());
    }

    Ok(())
}

#[tauri::command]
#[specta]
pub fn delete_comp(
    name: String,
    state: tauri::State<'_, SelectedComp>,
    db: tauri::State<'_, Db>,
) -> Result<(), String> {
    let comps = db.collection::<Competition>("competitions");

    comps
        .delete_many(doc! {
            "name": name
        })
        .map_err(|e| e.to_string())?;

    {
        *state.comp.lock().unwrap() = None;
    }

    println!("{:?}", state.comp.lock().unwrap());

    Ok(())
}

#[tauri::command]
#[specta]
pub fn get_open_comp(state: tauri::State<'_, SelectedComp>) -> Option<Competition> {
    let comp = state.comp.lock().unwrap().clone();

    comp
}

#[tauri::command]
#[specta]
pub fn open_comp(
    state: tauri::State<'_, SelectedComp>,
    name: String,
    db: tauri::State<'_, Db>,
) -> Result<(), String> {
    let comp = db
        .collection::<Competition>("competitions")
        .find_one(doc! { "name": &name })
        .map_err(|e| e.to_string())?
        .ok_or(String::from("no competition with that name"))?;

    {
        state.comp.lock().unwrap().replace(comp.clone());
    }
    {
        println!("{:?}", state.comp.lock().unwrap().clone());
    }

    Ok(())
}
