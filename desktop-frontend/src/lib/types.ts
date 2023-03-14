import * as types from "./backend";


export interface CheckboxField {
  name: string,
  label: string,
  type: "checkbox";
}
export interface NumberField {
  name: string;
  label: string;
  type: "number"
}
export interface ChoiceField {
  name: string
  label: string
  type: "choice"
  one_of: string[]
}
export interface TextField {
  name: string
  label: string
  type: "text"
}

export type FieldSchema = CheckboxField | NumberField | ChoiceField | TextField;
export function fieldSchemaToField(field: FieldSchema): types.Field {
  switch (field.type) {
    case "checkbox": {
      return {
        Checkbox: {
          name: field.name,
          label: field.label,
        }
      }
    }
    case "choice": {
      return {
        Choice: {
          one_of: field.one_of,
          name: field.name,
          label: field.label,
        }
      }
    }
    case "text": {
      return {
        Text: {
          name: field.name,
          label: field.label,
        }
      }
    }
    case "number": {
      return {
        Number: {
          name: field.name,
          label: field.label,
        }
      }
    }
  }
}
export * from "./backend";
