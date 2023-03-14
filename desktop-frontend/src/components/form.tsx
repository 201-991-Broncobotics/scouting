import { DetailedHTMLProps, InputHTMLAttributes } from "react";
import {
  useForm,
  useFieldArray,
  type UseFormRegister,
  UseFieldArrayUpdate,
  UseFormGetValues,
  UseFormHandleSubmit,
} from "react-hook-form";
import { Button } from "ui";
import { FieldSchema } from "../lib/types";

interface Form {
  fields: FieldSchema[];
}

export const Form = ({ onSubmit }: { onSubmit: (form: Form) => void | Promise<void> }) => {
  const { control, register, getValues, handleSubmit } = useForm<Form>({});
  const { fields, append, update } = useFieldArray({
    control,
    name: "fields",
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='flex flex-row justify-between m-5'>
        <Button
          variant='primary'
          onClick={() => {
            append({
              label: "",
              name: "",
              type: "number" as const,
            });
          }}>
          add number
        </Button>
        <Button
          variant='primary'
          onClick={() => {
            append({
              label: "",
              name: "",
              type: "checkbox",
            });
          }}>
          add checkbox
        </Button>
        <Button
          variant='primary'
          onClick={() => {
            append({
              label: "",
              type: "text",
              name: "",
            });
          }}>
          add text
        </Button>
        <Button
          variant='primary'
          onClick={() => {
            append({
              type: "choice",
              label: "",
              name: "",
              one_of: [],
            });
          }}>
          add choice
        </Button>
      </div>
      {fields.map(({ id }, index) => (
        <Field key={id} {...{ register, update, get: getValues, index }} />
      ))}
      <Button type='submit' variant='secondary'>
        Submit
      </Button>
    </form>
  );
};

export function Input(
  // im to lazy to type this the right way... 
  props: { register: any }
) {
  return <input {...props.register} className='border border-1 border-black text-black ' />;
}
export function Label({ children }: { children: string }) {
  return <span className='text-black text-lg'>{children}</span>;
}

export function NormalField({ register, index }: { register: UseFormRegister<Form>; index: number }) {
  return (
    <div className='flex flex-row gap-4 mx-auto my-2'>
      <Label>Name</Label>
      <Input {...{ register: register(`fields.${index}.name`) }} />
      <Label>Label (short, not duplicated version of the name)</Label>
      <Input {...{ register: register(`fields.${index}.label`) }} />
    </div>
  );
}
export function ChoiceField({
  register,
  index,
  get,
  update,
}: {
  register: UseFormRegister<Form>;
  index: number;
  update: UseFieldArrayUpdate<Form, "fields">;
  get: UseFormGetValues<Form>;
}) {
  return (
    <>
      <Label>Name</Label>
      <Input register={register(`fields.${index}.name`)} />
      <Label>Label (short, not duplicated version of the name)</Label>
      <Input register={register(`fields.${index}.label`)} />
      <button
        type='button'
        onClick={() =>
          update(index, {
            ...get(`fields.${index}`),
            one_of: [...(get(`fields.${index}.one_of`) as string[]), ""],
          } as any)
        }>
        add choice
      </button>
      <button
        type='button'
        onClick={() =>
          update(index, {
            ...get(`fields.${index}`),
            one_of: [...(get(`fields.${index}.one_of`) as string[])].slice(0, -1),
          } as any)
        }>
        delete last choice
      </button>
      {get(`fields.${index}.one_of`).map(({ }, oneOfIndex) => {
        return (
          <div key={oneOfIndex}>
            {" "}
            <Label>Choice: </Label>
            <Input key={oneOfIndex} register={register(`fields.${index}.one_of.${oneOfIndex}`)} />
          </div>
        );
      })}
    </>
  );
}

export function Field(props: {
  register: UseFormRegister<Form>;
  index: number;
  update: UseFieldArrayUpdate<Form, "fields">;
  get: UseFormGetValues<Form>;
}) {
  const choice = !!(props.get(`fields.${props.index}.one_of`) as string[] | null | undefined);
  if (choice) return <ChoiceField {...props} />;
  else return <NormalField {...props} />;
}
