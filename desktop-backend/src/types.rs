use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Debug, Default, Serialize, Deserialize)]
pub struct Team {
    pub name: String,
    pub number: u32,
    pub pit: Value,
    pub matches: Vec<Match>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Match {
    pub match_number: u32,
    pub team: TeamType,
    pub additional_data: Value,
}

#[derive(Debug, Serialize, Deserialize)]
pub enum TeamType {
    RED1,
    RED2,
    RED3,
    BLUE1,
    BLUE2,
    BLUE3,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Competition {
    pub name: String,
    pub tba_key: String,
    pub match_fields: Vec<Field>,
    pub pit_fields: Vec<Field>,
}

#[derive(Default, Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct Checkbox {
    pub value: bool,
    pub label: String,
    pub name: String,
}

#[derive(Default, Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct Number {
    pub value: rust_decimal::Decimal,
    pub label: String,
    pub name: String,
}

#[derive(Default, Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct Choice {
    pub value: String,
    pub label: String,
    pub one_of: Vec<String>,
    pub name: String,
}

#[derive(Default, Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct Text {
    pub value: String,
    pub label: String,
    pub name: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum Field {
    Checkbox(Checkbox),
    Number(Number),
    Choice(Choice),
    Text(Text),
}
