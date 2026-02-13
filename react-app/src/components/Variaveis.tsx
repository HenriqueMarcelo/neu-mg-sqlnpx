import { Label, TextInput } from "flowbite-react"
import { ChangeEvent, Fragment, useEffect, useState } from "react"

type Props = {
    sql: string
    onChange: (value: string, index: number) => void
}

export function Variaveis({ sql, onChange }: Props) {
    const [variaveis, setVariaveis] = useState([] as string[])

    useEffect(() => {
        const matches = sql.match(/\{(.*?)\}/g);
        if (matches) {
            setVariaveis(matches.map(match => match.replace(/[{}]/g, "")));
        } else {
            setVariaveis([]);
        }
    }, [sql])

    function handleInput(event: ChangeEvent<HTMLInputElement>, index: number) {
        const { value } = event.target;
        onChange(value, index)
    }

    return (
        <div className="grid items-center grid-cols-24 gap-4 lg:grid-col-6">
            {variaveis.map((variavel, index) => (
                <Fragment key={variavel}>
                    <Label htmlFor={`small-${variavel}`} className="col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-2">{variavel}:</Label>
                    <TextInput id={`small-${variavel}`} type="text" sizing="sm" className="col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-2" onChange={(e) => { handleInput(e, index) }} />
                </Fragment>
            ))}

        </div >
    )
}