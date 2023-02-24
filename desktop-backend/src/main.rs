use std::sync::Mutex;

use db::Db;
use polodb_core::bson::doc;
use serde_json::Value;
use types::{Competition, TeamType, Match};

mod db;
mod types;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_comps(db: tauri::State<'_, Db>) -> Result<Vec<Competition>, String> {
    db.get_comps()
}
#[derive(Default)]
struct SelectedComp {
    comp: Mutex<Option<Competition>>,
}

#[tauri::command]
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

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            greet,
            new_comp,
            get_comps,
            pit_scout,
            match_scout
        ])
        .manage(Db::new())
        .manage(SelectedComp::default())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
