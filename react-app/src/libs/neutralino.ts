import { os } from "@neutralinojs/lib";

export async function executeSQL(sql: string) {
    const comando = '.\\MDBQueryVemovel.exe "' + sql + '"';
    console.log("Executando comando: " + comando);
    const result = await os.execCommand(comando);

    if (result.stdErr) {
        throw new Error(result.stdErr);
    }

    const parsedResult = JSON.parse(result.stdOut);

    if (parsedResult.error) {
        throw new Error(parsedResult.error);
    }

    return parsedResult;

}