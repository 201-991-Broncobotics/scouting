use specta::specta;

use crate::{doc, Competition, Db, Field, SchemaType, SelectedComp};

#[tauri::command]
#[specta]
pub fn upload_schema(
    schema: Vec<Field>,
    schema_type: SchemaType,
    db: tauri::State<'_, Db>,
    selected_comp: tauri::State<'_, SelectedComp>,
) -> Result<(), String> {
    let comps = db.collection::<Competition>("competitions");
    println!("{:?}", schema);
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

    println!("{:?}", comps.find_many(None).unwrap());

    Ok(())
}

#[tauri::command]
#[specta]
pub fn get_schema(
    schema_type: SchemaType,
    selected_comp: tauri::State<'_, SelectedComp>,
) -> Result<Vec<Field>, String> {
    let comp = selected_comp.comp.lock().unwrap();
    let comp = comp.clone().ok_or("no competition selected")?;

    Ok(match schema_type {
        SchemaType::PIT => comp.pit_schema,
        SchemaType::MATCH => comp.match_schema,
    })
}
