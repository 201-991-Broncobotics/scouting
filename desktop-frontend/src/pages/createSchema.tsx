import { Form } from "../components/form";
import { fieldSchemaToField, uploadSchema } from "../lib/types";

export default function CreateSchema() {
  return <>
    <Form onSubmit={(a) => uploadSchema(a.fields.map(fieldSchemaToField), "PIT") as any} />
  </>
}
