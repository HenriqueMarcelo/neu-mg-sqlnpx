import { useMemo, useRef } from "react";
import { Grid } from "react-window";
import { type CellComponentProps } from "react-window";
import { DBData, DBResponse } from "../interface";

type Props = {
    data: DBResponse;
}

function relacaodeLarguraPorIndex(data: DBData[]) {
    const larguras = Array(Object.values(data[0]).length).fill(0);

    data.forEach(row => {
        Object.values(row).forEach((value, index) => {
            if (larguras[index] < String(value).trim().length) {
                larguras[index] = String(value).trim().length;
            }
        })
    })

    return larguras;
}

function Header({ data, ref, largurasPorIndex }: { data: DBResponse, ref: React.Ref<HTMLDivElement>, largurasPorIndex: number[] }) {

    return (
        <div className="flex   h-18 w-full overflow-x-hidden -mb-6" ref={ref}>
            {data.columns.map((col, index) => (
                <div
                    key={index}
                    className="p-1 bg-zinc-300"
                    style={{
                        width: largurasPorIndex[index] * 10 + 20, // Multiplica por 10 para converter em pixels e adiciona um padding
                        flex: '0 0 auto',
                        border: '1px solid #ddd'
                    }}
                >
                    {col}
                </div>
            ))}
        </div>
    );
}

export function TableResultado({ data }: Props) {
    const dataWithHeader = [data.columns, ...data.data]
    const largurasPorIndex = useMemo(() => relacaodeLarguraPorIndex(dataWithHeader), [data])

    const headerRef = useRef<HTMLDivElement>(null);

    function columnWidth(index: number) {
        const larguras = largurasPorIndex;
        return larguras[index] * 10 + 20; // Multiplica por 10 para converter em pixels e adiciona um padding
    }

    const handleScroll = (e: any) => {
        const { scrollLeft } = e.currentTarget;

        // Sincroniza a posição horizontal da segunda div
        if (headerRef.current) {
            headerRef.current.scrollLeft = scrollLeft;
        }
    };


    return (
        <>
            <Header data={data} ref={headerRef} largurasPorIndex={largurasPorIndex} />
            <Grid
                cellComponent={CellComponent}
                cellProps={{ data: data.data }}
                columnCount={data.columns.length}
                columnWidth={columnWidth}
                rowCount={data.rowCount}
                rowHeight={30}
                overscanCount={8}
                onScroll={handleScroll}
            />
        </>
    );
}

function CellComponent({
    data,
    columnIndex,
    rowIndex,
    style
}: CellComponentProps<{
    data: DBData[];
}>) {
    const linha = data[rowIndex];
    const conntent = linha ? Object.values(linha)[columnIndex] : null;
    const bgColor = rowIndex % 2 ? '#f9fafb' : 'white'

    return (
        <div className="truncate" style={{ ...style, border: '1px solid #ddd', padding: '4px', background: bgColor }}>
            {conntent}
        </div>
    );
}