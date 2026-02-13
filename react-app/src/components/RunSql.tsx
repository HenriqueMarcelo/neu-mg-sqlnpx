import { Button } from "flowbite-react";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { FaFileDownload, FaPlay } from "react-icons/fa";
import { SQLCommand } from "../App";
import { LoaderContext } from "../contexts/LoaderContext";
import { DBData, DBResponse } from "../interface";
import { TableResultado } from "./TableResultado";
import { Variaveis } from "./Variaveis";
import { EditarComando } from "./EditarComando";
import { ExcluirComando } from "./ExcluirComando";
import { executeSQL } from "../libs/neutralino";

type Props = {
    sql: SQLCommand;
}

export function RunSql({ sql }: Props) {
    const { showLoader, hideLoader } = useContext(LoaderContext);
    const [response, setResponse] = useState<DBResponse | undefined>()
    const [variaveisValue, setVariaveisValue] = useState([] as string[])

    useEffect(() => {
        setResponse(undefined)
        setVariaveisValue([])
    }, [sql])


    const sqlComVariaveisPreenchidas = useMemo(() => {
        const matches = sql.SQL.match(/\{(.*?)\}/g);
        if (matches && variaveisValue.length > 0) {
            let result = sql.SQL;
            matches.forEach((match, index) => {
                const variableName = match.replace(/[{}]/g, "");
                const value = variaveisValue[index];
                result = result.replace(new RegExp(`\\{${variableName}\\}`, "g"), value);
            });
            return result;
        }
        return sql.SQL;
    }, [sql.SQL, variaveisValue])

    const sqlComVariaveisPreenchidasVisual = useMemo(() => {
        const matches = sql.SQL.match(/\{(.*?)\}/g);
        if (matches) {
            let result = sql.SQL;
            matches.forEach((match, index) => {
                const variableName = match.replace(/[{}]/g, "");
                const value = variaveisValue[index] ? variaveisValue[index] : '&nbsp;';
                result = result.replace(new RegExp(`\\{${variableName}\\}`, "g"), '<strong class="text-gray-900 bg-purple-300 inline-block px-2">' + value + '</strong>');
            });
            return result;
        }
        return sql.SQL;
    }, [sql.SQL, variaveisValue])

    function changeVariableValue(value: string, index: number) {
        setVariaveisValue((values) => {
            const newValues = [...values];
            newValues[index] = value;
            return newValues;
        });
    }

    const runCommand = useCallback(async function handleGetSqls() {
        showLoader()
        try {
            const respondeDB = await executeSQL(sqlComVariaveisPreenchidas);
            setResponse(respondeDB);
            console.log('SQL Response:', respondeDB);
        } catch (error) {
            console.log('Error executing SQL:', error);
        } finally {
            hideLoader()
        }
    }, [sqlComVariaveisPreenchidas, setResponse])

    const generateCSV = (data: DBData[]): string => {
        const headers = Object.keys(data[0]).join(";");
        const rows = data.map(row => Object.values(row).join(";")).join("\n");
        return `${headers}\n${rows}`;
    };

    const downloadCSV = useCallback(() => {
        showLoader()
        if (!response || !response.data || response.data.length === 0) {
            console.error("No data available to export.");
            return;
        }

        const csvContent = generateCSV(response.data);
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${sql.NomeSQL.trim() || "export"}.csv`);
        document.body.appendChild(link);
        hideLoader();
        link.click();
        document.body.removeChild(link);
    }, [response, sql]);

    return (

        <div className="font-semibold h-full w-full overflow-y-auto flex flex-col gap-6 px-6">

            <header className="flex justify-between px-8 py-4 bg-gray-100 text-2xl -mx-6 w-[calc(100%+3rem)]">
                <h1 className="flex flex-col">
                    <span className="capitalize">
                        {sql.NomeSQL}
                    </span>
                    <small className="text-sm font-normal">{sql.OBS}</small>
                </h1>
                <div className="flex gap-4">
                    <ExcluirComando sql={sql} onCommandRemoved={() => { window.location.reload() }} />
                    <EditarComando sql={sql} onCommandUpdated={() => { window.location.reload() }} />
                    <Button color="blue" className="inline-flex gap-2 cursor-pointer" disabled={!response} onClick={downloadCSV}>Exportar para CSV <FaFileDownload /></Button>
                    <Button color="green" className="inline-flex gap-2 cursor-pointer" onClick={runCommand}>Executar <FaPlay /></Button>
                </div>
            </header>

            <div className="w-full min-h-24 bg-gray-700 text-white p-6 overflow-y-auto font-mono rounded-lg cursor-not-allowed">
                <p dangerouslySetInnerHTML={{ __html: sqlComVariaveisPreenchidasVisual }} />
            </div>

            <Variaveis sql={sql.SQL} onChange={changeVariableValue} />

            {response && <TableResultado data={response} />}
        </div>
    );
}