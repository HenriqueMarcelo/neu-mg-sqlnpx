"use client";

import { Button, Modal, ModalBody, ModalHeader, Spinner } from "flowbite-react";
import { useCallback, useContext, useState } from "react";
import { LoaderContext } from "../contexts/LoaderContext";
import { MdDelete } from "react-icons/md";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { SQLCommand } from "../Router";
import { executeSQL } from "../libs/neutralino";



type Props = {
    onCommandRemoved: () => void;
    sql: SQLCommand;
}

export function ExcluirComando({ onCommandRemoved, sql }: Props) {
    const [openModal, setOpenModal] = useState(false);

    const { shown, showLoader, hideLoader } = useContext(LoaderContext);

    function onCloseModal() {
        setOpenModal(false);
    }

    const handleExcluirComando = useCallback(async () => {
        showLoader();
        try {
            const sqlCommand = `DELETE FROM SQL WHERE SQL = '${sql.SQL}'`;
            console.log('Executing SQL Command:', sqlCommand);
            const response = await executeSQL(sqlCommand);
            console.log('SQL Response:', response);
            onCloseModal();
            onCommandRemoved();
        } catch (error) {
            alert('Error executing SQL:' + error);
        } finally {
            hideLoader();
        }
    }, [sql, onCommandRemoved]);

    return (
        <>
            <Button onClick={() => setOpenModal(true)} disabled={shown} color="red" className="inline-flex gap-2 cursor-pointer" >Excluir comando <MdDelete /></Button>
            <Modal show={openModal} size="xl" onClose={onCloseModal} popup dismissible >
                <ModalHeader />
                <ModalBody>
                    <div className="p-4 md:p-5 text-center">
                        <AiOutlineExclamationCircle size={56} className="mx-auto mb-8 text-gray-500" />
                        <h3 className="mb-6 text-body">Deseja realmente excluir o comando?</h3>
                        <div className="flex items-center space-x-4 justify-center">
                            <Button color="red" onClick={handleExcluirComando} disabled={shown}>
                                {shown ? <Spinner aria-label="Default status example" /> : 'Sim, excluir'}
                            </Button>
                            <Button color="alternative" onClick={() => setOpenModal(false)}>
                                Não, Cancelar
                            </Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </>
    );
}
