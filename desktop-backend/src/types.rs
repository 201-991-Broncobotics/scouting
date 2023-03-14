use serde::{Deserialize, Serialize};
use serde_json::Value;
use specta::Type;

#[derive(Debug, Default, Serialize, Deserialize, Type)]
pub struct Team {
    pub name: String,
    pub number: u32,
    pub pit: Value,
    pub matches: Vec<Match>,
}

#[derive(Debug, Serialize, Deserialize, Type)]
pub struct Match {
    pub match_number: u32,
    pub team: TeamType,
    pub additional_data: Value,
}

#[derive(Debug, Serialize, Deserialize, Type)]
pub enum TeamType {
    RED1,
    RED2,
    RED3,
    BLUE1,
    BLUE2,
    BLUE3,
}

#[derive(Debug, Serialize, Deserialize, Clone, Type, PartialEq, Eq)]
pub struct Competition {
    pub name: String,
    pub tba_key: String,
    pub match_schema: Vec<Field>,
    pub pit_schema: Vec<Field>,
}

#[derive(Debug, Serialize, Deserialize, Clone, Type)]
pub enum SchemaType {
    PIT,
    MATCH,
}

#[derive(Default, Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Type)]
pub struct Checkbox {
    pub label: String,
    pub name: String,
}

#[derive(Default, Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Type)]
pub struct Number {
    pub label: String,
    pub name: String,
}

#[derive(Default, Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Type)]
pub struct Choice {
    pub label: String,
    pub one_of: Vec<String>,
    pub name: String,
}

#[derive(Default, Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Type)]
pub struct Text {
    pub label: String,
    pub name: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Type)]
pub enum Field {
    Checkbox(Checkbox),
    Number(Number),
    Choice(Choice),
    Text(Text),
}
