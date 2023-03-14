import { useForm } from "react-hook-form";
import { Button } from "ui";
import { Input, Label } from "../components/form";
import { Competition, newComp } from "../lib/types";
import CompList from "./openComp";


export default function NewComp() {
	const { register, handleSubmit } = useForm<Competition>({
		defaultValues: {
			match_schema: [],
			pit_schema: [],
		}
	});


	return <><form onSubmit={handleSubmit(newComp)} className="flex mt-4  flex-row justify-center gap-5">
		<Label>Name of the competition</Label>
		<Input register={register('name')} />
		<Label>The blue alliance Key: </Label>
		<Input register={register("tba_key")} />
		<Button type="submit" variant="primary" > Submit </Button>
	</form><CompList />
	</>
}
