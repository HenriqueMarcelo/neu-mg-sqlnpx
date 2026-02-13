
"use client";

import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems } from "flowbite-react";
import { NovoComando } from "./NovoComando";
import { useCallback, useContext, useEffect, useState } from "react";
import { LoaderContext } from "../contexts/LoaderContext";
import { SQLCommand } from "../App";
import { executeSQL } from "../libs/neutralino";

type Props = {
    setSqlSelecionado: (sql: SQLCommand) => void;
}

export function MenuLateral({ setSqlSelecionado }: Props) {
    const [sqls, setSqls] = useState([] as SQLCommand[])
    const { showLoader, hideLoader } = useContext(LoaderContext);

    const handleGetSqls = useCallback(async function handleGetSqls() {
        showLoader()
        try {
            const response = await executeSQL('SELECT * FROM SQL');
            setSqls(response.data as SQLCommand[]);
            console.log('SQL Response:', response);
        } catch (error) {
            console.log('Error executing SQL:', error);
        } finally {
            hideLoader()
        }
    }, [setSqls])

    useEffect(() => {
        handleGetSqls();
    }, [handleGetSqls]);

    return (
        <Sidebar aria-label="Relatórios">
            <SidebarItems>
                <SidebarItemGroup>
                    <NovoComando onCommandSaved={handleGetSqls} />
                </SidebarItemGroup>
                <SidebarItemGroup >
                    {sqls.map((sqlCommand, index) => (
                        <SidebarItem key={index} onClick={() => setSqlSelecionado(sqlCommand)} className="cursor-pointer capitalize">
                            {sqlCommand.NomeSQL}
                        </SidebarItem>
                    ))}
                </SidebarItemGroup>
            </SidebarItems>
        </Sidebar>
    );
}
