export interface IElectronAPI {
    loadPreferences: () => Promise<void>,
}

type DBData = {
    [key: string]: any,
}

type DBResponse = {
    columns: string[],
    rowCount: number,
    data: DBData[],
};

declare global {
    interface Window {
        executeSQL: (sql: string) => Promise<DBResponse>;
        // setNativeLoader: (shown: boolean) => void;
    }
}