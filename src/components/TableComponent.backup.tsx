/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TColumnsTable } from '@lib/types';
import React, { useCallback, useEffect, useRef, useState, type JSX } from 'react';
import { CheckBox } from './ui/ChecBox';

/**
 * Definición de columna básica
 */


/**
 * Props del componente TableComponent
 */
interface TableComponentProps<T> {
    columns: TColumnsTable<T>[];
    data: T[];
    height?: string;
    widthInitial?: number;
    className?: string;
    menuActions?: (row: T) => {
        label?: string;
        action?: () => void;
        icon?: JSX.Element;
    }[];
    withCheck?: boolean;
    singleRowSelection?: boolean;
    getSelectedRows?: (selectedIds: number[]) => void;
}

/**
 * TableComponent - Versión simplificada de SimpleTable
 * Mantiene: Drag & Drop de columnas, Resize de columnas, Render básico
 * Elimina: Filtros, Ordenamiento, Paginación, Búsqueda, localStorage
 */
const TableComponent = <T extends { id: number }>({
    columns,
    data,
    height = 'max-h-[600px]',
    widthInitial = 130,
    className = '',
    menuActions,
    withCheck = false,
    singleRowSelection = false,
    getSelectedRows,
}: TableComponentProps<T>) => {
    const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>({});
    const [draggedColumnIndex, setDraggedColumnIndex] = useState<number | null>(null);
    const [dragOverColumnIndex, setDragOverColumnIndex] = useState<number | null>(null);
    const [orderedColumns, setOrderedColumns] = useState<TColumnsTable<T>[]>(columns);
    const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
    const [selectAll, setSelectAll] = useState<boolean>(false);
    // ======================== REFS ========================
    const isResizing = useRef<boolean>(false);
    const currentColumnKey = useRef<string | null>(null);
    const startX = useRef<number>(0);

    // ======================== EFECTOS ========================

    /**
     * Inicializa los anchos de columna
     */
    useEffect(() => {
        const initialWidths = columns.reduce((acc, column) => {
            acc[column.key] = column.initialWidth ?? widthInitial;
            return acc;
        }, {} as { [key: string]: number });
        setColumnWidths(initialWidths);
    }, [columns, widthInitial]);

    /**
     * Actualiza orderedColumns cuando cambian las columnas
     */
    useEffect(() => {
        setOrderedColumns(columns);
    }, [columns]);

    /**
     * Limpia listeners al desmontar
     */
    useEffect(() => {
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    // ======================== DRAG & DROP ========================

    const handleDragStart = (index: number) => {
        setDraggedColumnIndex(index);
    };

    const handleDragOver = (index: number) => {
        setDragOverColumnIndex(index);
    };

    const handleDrop = (toIndex: number) => {
        if (draggedColumnIndex !== null && draggedColumnIndex !== toIndex) {
            const updatedColumns = [...orderedColumns];
            const [movedColumn] = updatedColumns.splice(draggedColumnIndex, 1);
            updatedColumns.splice(toIndex, 0, movedColumn);
            setOrderedColumns(updatedColumns);
        }
        setDraggedColumnIndex(null);
        setDragOverColumnIndex(null);
    };

    const handleDragEnd = () => {
        setDraggedColumnIndex(null);
        setDragOverColumnIndex(null);
    };


    // ======================== SELECTION ========================

    const handleRowSelection = useCallback(
        (id: number) => {
            setSelectedRows((prev) => {
                let newSet: Set<number>;

                if (singleRowSelection) {
                    if (prev.has(id) && prev.size === 1) {
                        newSet = new Set();
                    } else {
                        newSet = new Set([id]);
                    }
                } else {
                    newSet = new Set(prev);
                    if (newSet.has(id)) newSet.delete(id);
                    else newSet.add(id);
                }

                if (getSelectedRows) {
                    setTimeout(() => {
                        getSelectedRows(Array.from(newSet));
                    }, 0);
                }

                return newSet;
            });
        },
        [singleRowSelection, getSelectedRows]
    );

    const handleSelectAllChange = useCallback(
        (checked: boolean) => {
            setSelectAll(checked);

            let newSet: Set<number>;
            if (checked) {
                newSet = new Set<number>();
                data.forEach((row) => {
                    newSet.add(row.id);
                });
            } else {
                newSet = new Set();
            }

            setSelectedRows(newSet);

            if (getSelectedRows) {
                setTimeout(() => {
                    getSelectedRows(Array.from(newSet));
                }, 0);
            }
        },
        [data, getSelectedRows]
    );
    // ======================== RESIZE ========================

    const handleMouseDown = (e: React.MouseEvent, key: string) => {
        e.stopPropagation();
        isResizing.current = true;
        currentColumnKey.current = key;
        startX.current = e.clientX;

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isResizing.current && currentColumnKey.current !== null) {
            const deltaX = e.clientX - startX.current;
            startX.current = e.clientX;

            setColumnWidths((prevWidths) => {
                const newWidths = { ...prevWidths };
                if (currentColumnKey.current !== null && newWidths[currentColumnKey.current] !== undefined) {
                    newWidths[currentColumnKey.current] = Math.max(
                        newWidths[currentColumnKey.current] + deltaX,
                        50
                    );
                }
                return newWidths;
            });
        }
    };

    const handleMouseUp = () => {
        isResizing.current = false;
        currentColumnKey.current = null;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);

        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
    };

    // ======================== RENDER ROW ========================

    const renderRow = useCallback(
        (row: T): JSX.Element => {
            const isSelected = selectedRows.has(row.id);
            return (
                <tr key={row.id} className={`transition-all hover:bg-table-body-hover border-b border-b-gray-200 ${isSelected ? 'bg-[#EFF6FF80]' : ''}`}>
                    {/* Checkbox de selección */}
                    {withCheck && (
                        <td className="w-[35px] max-w-[35px] px-2 py-3 text-center border-r border-table-border sticky left-0 bg-white z-10">
                            <CheckBox
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleRowSelection(row.id)}
                                size="sm"
                            />
                        </td>
                    )}
                    {orderedColumns.map((column) => {
                        const width = columnWidths[column.key] ?? 50;
                        const cellValue = row[column.key as keyof T];

                        return (
                            <td
                                key={column.key}
                                className="px-3 py-3 text-left text-[12px] font-normal text-table-body-text border-r border-table-border"
                                style={{
                                    width,
                                    minWidth: width,
                                    maxWidth: width,
                                }}
                            >
                                {column.render ? (
                                    <div>{column.render(cellValue, row)}</div>
                                ) : (
                                    <p className="truncate">
                                        {cellValue === null || cellValue === undefined || cellValue === ''
                                            ? '-'
                                            : String(cellValue)}
                                    </p>
                        <td
                            key={column.key}
                            className="px-3 py-3 text-left text-[12px] font-normal text-table-body-text border-r border-table-border"
                            style={{
                                width,
                                minWidth: width,
                                maxWidth: width,
                            }}
                        >
                            {column.render ? (
                                <div>{column.render(cellValue, row)}</div>
                            ) : (
                                <p className="truncate">
                                    {cellValue === null || cellValue === undefined || cellValue === ''
                                        ? '-'
                                        : String(cellValue)}
                                </p>
                            )}
                        </td>
                                );
                })}

                                // ======================== RENDER ========================

                                return (
                                <div className={`flex flex-col w-full h-full font-inter ${className}`}>
                                    <div className="border shadow-md border-table-border rounded-lg w-full h-full flex flex-col">
                                        <div className={`overflow-x-auto overflow-y-auto relative w-full ${height} scroll-container`}>
                                            <table className="divide-y divide-gray-200" style={{ tableLayout: 'fixed' }}>
                                                {/* HEADER */}
                                                <thead className="bg-gray-50">
                                                    <tr className="h-10">
                                                        {/* Checkbox global para seleccionar/deseleccionar todas las filas */}
                                                        {withCheck && (
                                                            <th className="w-[35px] max-w-[35px] px-2 py-1 text-[13px] font-normal text-gray-menu-item border-r border-table-border text-center sticky left-0 top-0 bg-gray-50 z-20">
                                                                {!singleRowSelection && (
                                                                    <CheckBox
                                                                        type="checkbox"
                                                                        checked={selectAll}
                                                                        onChange={(checked) => handleSelectAllChange(checked)}
                                                                        size="sm"
                                                                    />
                                                                )}
                                                            </th>
                                                        )}
                                                        {orderedColumns.map((column, index) => {
                                                            const colWidth = columnWidths[column.key] ?? 50;

                                                            return (
                                                                <th
                                                                    key={column.key}
                                                                    className={`px-3 py-1 text-left text-[13px] font-normal text-gray-menu-item border-r border-table-border text-wrap z-10 bg-gray-50 group top-0 sticky transition-transform duration-200 ${dragOverColumnIndex === index ? 'opacity-50' : ''
                                                                        }`}
                                                                    draggable
                                                                    onDragStart={() => handleDragStart(index)}
                                                                    onDragOver={(e) => {
                                                                        e.preventDefault();
                                                                        handleDragOver(index);
                                                                    }}
                                                                    onDrop={() => handleDrop(index)}
                                                                    onDragEnd={handleDragEnd}
                                                                    style={{
                                                                        width: colWidth,
                                                                        minWidth: colWidth,
                                                                        maxWidth: colWidth,
                                                                    }}
                                                                >
                                                                    <p className="truncate">{column.name}</p>

                                                                    {/* Resizer */}
                                                                    <div
                                                                        className="absolute right-0 top-0 h-full w-[6px] cursor-col-resize select-none transition-all rounded-lg group-hover:bg-gray-200"
                                                                        draggable={false}
                                                                        onMouseDown={(e) => {
                                                                            e.preventDefault();
                                                                            e.stopPropagation();
                                                                            handleMouseDown(e, column.key);
                                                                        }}
                                                                        style={{ zIndex: 100 }}
                                                                    />
                                                                </th>
                                                            );
                                                        })}

                                                        {/* Última columna de acciones */}
                                                        {menuActions && (
                                                            <th
                                                                className="w-[100px] min-w-[100px] max-w-[100px] px-3 py-3 text-center text-[13px] font-normal text-gray-menu-item sticky right-0 bg-gray-50 z-20"
                                                                style={{ boxShadow: '-4px 0 8px -2px rgba(0, 0, 0, 0.1)' }}
                                                            >
                                                                Acciones
                                                            </th>
                                                        )}
                                                    </tr>
                                                </thead>

                                                {/* BODY */}
                                                <tbody className="bg-white">
                                                    {data.map((row) => renderRow(row))}

                                                    {data.length === 0 && (
                                                        <tr>
                                                            <td colSpan={orderedColumns.length + (menuActions ? 1 : 0) + (withCheck ? 1 : 0)} className="h-[100px] w-full text-center align-middle">
                                                                <div className="flex flex-col justify-center items-center">
                                                                    <p className="text-[13px] italic text-table-pagination-text">No hay datos para mostrar</p>
                                                                    {/* <EmptyBoxIcon className="fill-breadcrumbs-svg w-[30px]" /> */}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                );
};

                                export default React.memo(TableComponent);