use std::sync::Mutex;

use db::Db;
use polodb_core::bson::doc;
use serde_json::Value;
use specta::{collect_types, specta, ts};
use types::*;

mod db;
mod types;

#[tauri::command]
#[specta]
fn get_comps(db: tauri::State<'_, Db>) -> Result<Vec<Competition>, String> {
    db.get_comps()
}
#[derive(Default)]
struct SelectedComp {
    comp: Mutex<Option<Competition>>,
    pit_schema: Mutex<Option<Vec<Field>>>,
    match_schema: Mutex<Option<Vec<Field>>>,
}

#[tauri::command]
#[specta]
fn new_comp(
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
async fn pit_scout(
    name: String,
    team_number: u32,
    value: Value,
    db: tauri::State<'_, Db>,
) -> Result<(), String> {
    let teams = db.get_team_collection().ok_or("no competition selected")?;

    // get the old team, in case the team alr has match scouting done for some reason, and we wanna keep that
    let mut team = teams
        .find_one(doc! { "name": &name, "number": team_number })
        .map_err(|e| e.to_string())?
        .unwrap_or_default();

    team.number = team_number;
    team.name = name;
    team.pit = value;

    // delete old one (if it even exists)
    teams
        .delete_many(doc! { "name": &team.name, "number": team_number })
        .map_err(|e| e.to_string())?;

    // insert new one
    teams.insert_one(team).map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
#[specta]
fn match_scout(
    team_type: TeamType,
    team_number: u32,
    match_number: u32,
    data: Value,
    db: tauri::State<'_, Db>,
) -> Result<(), String> {
    let teams = db.get_team_collection().ok_or("no competition selected")?;

    // get the old team
    let mut team = teams
        .find_one(doc! { "number": team_number })
        .map_err(|e| e.to_string())?
        .unwrap_or_default();

    team.number = team_number;

    let new_match = Match {
        match_number,
        team: team_type,
        additional_data: data,
    };

    team.matches.push(new_match);

    // delete old one (if it even exists)
    teams
        .delete_many(doc! { "number": team_number })
        .map_err(|e| e.to_string())?;

    // insert new one
    teams.insert_one(team).map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
#[specta]
fn upload_schema(
    schema: Vec<Field>,
    schema_type: SchemaType,
    db: tauri::State<'_, Db>,
    selected_comp: tauri::State<'_, SelectedComp>,
) -> Result<(), String> {
    let comps = db.collection::<Competition>("competitions");
    let mut opened_comp = selected_comp
        .comp
        .lock()
        .unwrap()
        .clone()
        .ok_or("no competition selected")?;

    match schema_type {
        SchemaType::PIT => opened_comp.pit_schema = schema.clone(),
        SchemaType::MATCH => opened_comp.match_schema = schema.clone(),
    }
    match schema_type {
        SchemaType::PIT => selected_comp.pit_schema.lock().unwrap().replace(schema),
        SchemaType::MATCH => selected_comp.match_schema.lock().unwrap().replace(schema),
    };

    selected_comp
        .comp
        .lock()
        .unwrap()
        .replace(opened_comp.clone());



    comps
        .update_one(
            doc! { "name": &opened_comp.name },
            doc! {"$set": bson::to_document(&opened_comp).map_err(|e| e.to_string())?},
        )
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
#[specta]
fn get_schema(schema_type: SchemaType, selected_comp: tauri::State<'_, SelectedComp>,) -> Option<Vec<Field>> {
    match schema_type {
        SchemaType::PIT => selected_comp.pit_schema.lock().unwrap().clone(),
        SchemaType::MATCH => selected_comp.match_schema.lock().unwrap().clone(),
    }
}


fn main() {
    #[cfg(debug_assertions)]
    tauri_specta::ts::export(
        collect_types![new_comp, get_comps, pit_scout, match_scout, upload_schema, get_schema],
        "../desktop-frontend/src/lib/backend.ts",
    )
    .unwrap();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            new_comp,
            get_comps,
            pit_scout,
            match_scout,
            upload_schema, get_schema
        ])
        .manage(Db::new())
        .manage(SelectedComp::default())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
