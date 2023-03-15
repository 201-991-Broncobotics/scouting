import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Qr } from "ui/src/Modal/QrModal";
import { Form } from "../components/form";
import { fieldSchemaToField, getOpenComp, getSchema, openComp, uploadSchema } from "../lib/types";
import LZMA from "lzma-web"

const lzma = new LZMA()

export default function CreateSchema() {
  const pitSchema = useQuery({
    queryKey: ["pitSchema",],
    queryFn: async () => {
      try {
        const schema = await getSchema("PIT")
        if (schema.length == 0) return null
        const a = await lzma.compress(JSON.stringify(schema));
        console.log(a);
        return a;
      } catch (e) { console.error(e); throw e }
    },
})

  const openCompQuery = useQuery({
    queryKey: ["openComp"],
    queryFn: () => getOpenComp(),
  })

  const queryClient = useQueryClient();

  if (openCompQuery.isLoading || pitSchema.isLoading) return <p>Loading...</p>
  if (openCompQuery.data === null) return <p> no open comp </p>
  console.log(pitSchema.error)

  return <>
    {pitSchema.data
      ? <><p>schema alr made: </p><Qr>{pitSchema.data}</Qr></>
      : <p> no pit schema yet </p>}
    <Form onSubmit={(a) => {
      uploadSchema(a.fields.map(fieldSchemaToField), "PIT");
      queryClient.invalidateQueries(["pitSchema"]); console.log(a)
    }} />
  </>
}
