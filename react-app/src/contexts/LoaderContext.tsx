import { createContext, useCallback, useEffect, useState } from "react";

type ItemContextType = {
    shown: boolean
    showLoader: () => void
    hideLoader: () => void
}

type Props = {
    children: React.ReactNode;
};

export const LoaderContext = createContext({} as ItemContextType);

export function LoaderContextProvider({ children }: Props) {
    /*
     * O contador foi utilizado para que um componente não esconda
     * o loader enquanto outro componente ainda quer o load ativo;
     *
     * Sempre que alguém quer ativar o loading é adicionado 1 ao estado
     * e sempre que alguém quiser terminar é removido 1 do estado.
     *
     * A animação é interrompida quando o valor ficar >= 0
     */
    const [auxCount, setAuxCount] = useState(0)
    const shown = auxCount > 0;

    const showLoader = useCallback(function showLoader() {
        setAuxCount((state) => state + 1)
    }, [])

    const hideLoader = useCallback(function hideLoader() {
        setAuxCount((state) => state - 1)
    }, [])

    useEffect(() => {
        // window.setNativeLoader(shown)
    }, [auxCount])

    return (
        <LoaderContext
            value={{
                shown,
                showLoader,
                hideLoader,
            }}
        >
            {children}
        </LoaderContext>
    )
}