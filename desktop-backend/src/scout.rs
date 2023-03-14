use crate::{doc, specta, Db, Match, TeamType, Value};

#[tauri::command]
#[specta]
pub async fn pit_scout(
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
pub fn match_scout(
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
