"use client";

import { Button, Label, Modal, ModalBody, ModalHeader, Spinner, Textarea, TextInput } from "flowbite-react";
import { useCallback, useContext, useEffect, useState } from "react";
import { LoaderContext } from "../contexts/LoaderContext";
import { FaEdit } from "react-icons/fa";
import { SQLCommand } from "../Router";
import { executeSQL } from "../libs/neutralino";

type Props = {
    onCommandUpdated: () => void;
    sql: SQLCommand;
}

export function EditarComando({ onCommandUpdated, sql: sqlOriginal }: Props) {
    const [openModal, setOpenModal] = useState(false);
    const [nome, setNome] = useState(sqlOriginal.NomeSQL);
    const [sql, setSql] = useState(sqlOriginal.SQL);
    const [obs, setObs] = useState(sqlOriginal.OBS);
    const { shown, showLoader, hideLoader } = useContext(LoaderContext);

    function onCloseModal() {
        setOpenModal(false);
        setNome("");
        setSql("");
        setObs("");
    }

    useEffect(() => {
        setNome(sqlOriginal.NomeSQL);
        setSql(sqlOriginal.SQL);
        setObs(sqlOriginal.OBS);
    }, [sqlOriginal]);

    const handleEditarComando = useCallback(async () => {
        showLoader();
        try {
            const sqlCommand = `UPDATE SQL SET NomeSQL = '${nome}', OBS = '${obs}', SQL = '${sql}' WHERE SQL = '${sqlOriginal.SQL}'`;
            console.log('Executing SQL Command:', sqlCommand);
            const response = await executeSQL(sqlCommand);
            console.log('SQL Response:', response);
            onCloseModal();
            onCommandUpdated();
        } catch (error) {
            alert('Error executing SQL:' + error);
        } finally {
            hideLoader();
        }
    }, [nome, obs, sql, onCommandUpdated, sqlOriginal]);

    return (
        <>
            <Button onClick={() => setOpenModal(true)} disabled={shown} color="yellow" className="inline-flex gap-2 cursor-pointer" >Editar código <FaEdit /></Button>
            <Modal show={openModal} size="xl" onClose={onCloseModal} popup dismissible >
                <ModalHeader>
                    Editar Comando SQL
                </ModalHeader>
                <ModalBody>
                    <div className="space-y-6">
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="nome">Nome</Label>
                            </div>
                            <TextInput
                                id="nome"
                                value={nome}
                                onChange={(event) => setNome(event.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="obs">Observação</Label>
                            </div>
                            <TextInput
                                id="obs"
                                value={obs}
                                onChange={(event) => setObs(event.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="sql">Comando SQL</Label>
                            </div>
                            <Textarea id="sql" rows={4} placeholder="Escreva seu comando SQL aqui..." value={sql} onChange={(event) => setSql(event.target.value)} />
                        </div>
                        <div className="w-full flex justify-end gap-4">
                            <Button color="green" onClick={handleEditarComando}>
                                {shown ? <Spinner aria-label="Default status example" /> : 'Salvar'}
                            </Button>
                            <Button color="alternative" onClick={() => setOpenModal(false)}>
                                Cancelar
                            </Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </>
    );
}
