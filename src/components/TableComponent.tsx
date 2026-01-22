/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TColumnsTable } from '@lib/types';
import React, { useCallback, useEffect, useRef, useState, type JSX } from 'react';
import { CheckBox } from './ui/ChecBox';


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
    getSelectedRows?: (data: T[]) => void;
    fromName: string;
    buttonsHeaders?: JSX.Element;

}

/**
 * TableComponent - Versión simplificada de SimpleTable
 * Mantiene: Drag & Drop de columnas, Resize de columnas, Render básico
 * Elimina: Filtros, Ordenamiento, Paginación, Búsqueda, localStorage
 */
const TableComponent = <T extends { id: number }>({
    columns,
    data,
    height = 'h-full',
    widthInitial = 130,
    className = '',
    menuActions,
    withCheck = false,
    singleRowSelection = false,
    getSelectedRows,
    fromName,
    buttonsHeaders,
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
    const [pageValues, setPageValues] = useState<string>('');

    // ======================== EFECTOS ========================

    /**
     * Inicializa los anchos de columna
     */
    useEffect(() => {
        const initialWidths = columns.reduce((acc, column) => {
            acc[column.key] = column.initialWidth ?? widthInitial;
            return acc;
        }, {} as Record<keyof T, number>);
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

    /**
     * Sincroniza el estado de selectAll cuando todas las filas están seleccionadas
     */
    useEffect(() => {
        if (data.length > 0 && selectedRows.size === data.length) {
            setSelectAll(true);
        } else {
            setSelectAll(false);
        }
    }, [selectedRows, data]);

    /**
     * Limpia las filas seleccionadas que ya no existen en data (por ejemplo, después de eliminar)
     */
    useEffect(() => {
        if (selectedRows.size > 0) {
            const dataIds = new Set(data.map(row => row.id));
            const validIds = Array.from(selectedRows).filter(id => dataIds.has(id));

            if (validIds.length !== selectedRows.size) {
                const newSelectedRows = new Set(validIds);
                setSelectedRows(newSelectedRows);

                if (getSelectedRows) {
                    const selectedRowsData = data.filter(r => newSelectedRows.has(r.id));
                    setTimeout(() => {
                        getSelectedRows(selectedRowsData);
                    }, 0);
                }
            }
        }
    }, [data]);

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
        (row: T) => {
            setSelectedRows((prev) => {
                let newSetForSelection: Set<number>;

                if (singleRowSelection) {
                    if (prev.has(row.id) && prev.size === 1) {
                        newSetForSelection = new Set();
                    } else {
                        newSetForSelection = new Set([row.id]);
                    }
                } else {
                    newSetForSelection = new Set(prev);
                    if (newSetForSelection.has(row.id)) newSetForSelection.delete(row.id);
                    else newSetForSelection.add(row.id);
                }

                if (getSelectedRows) {
                    const selectedRowsData = data.filter(r => newSetForSelection.has(r.id));
                    setTimeout(() => {
                        getSelectedRows(selectedRowsData);
                    }, 0);
                }

                return newSetForSelection;
            });
        },
        [singleRowSelection, getSelectedRows, data]
    );

    const handleSelectAllChange = useCallback(
        (checked: boolean) => {
            setSelectAll(checked);

            let newSet: Set<number>;
            let newSetFormGetSelectedRows: T[] = [];
            if (checked) {
                newSet = new Set<number>();
                data.forEach((row) => {
                    newSet.add(row.id);
                    newSetFormGetSelectedRows.push(row);
                });
            } else {
                newSet = new Set();
            }

            setSelectedRows(newSet);

            if (getSelectedRows) {
                setTimeout(() => {
                    getSelectedRows(Array.from(newSetFormGetSelectedRows));
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
                <tr key={row.id} className={`transition-all hover:bg-[#F9F9F9] border-b border-b-gray-200 ${isSelected ? 'bg-[#EFF6FF80]' : ''}`}>
                    {withCheck && (
                        <td className="w-[35px] max-w-[35px] px-2 py-3 text-center border-r border-[#F1F1F4] sticky left-0 bg-white z-10">
                            <CheckBox type="checkbox" checked={isSelected} onChange={() => handleRowSelection(row)} size="sm" />
                        </td>
                    )}
                    {orderedColumns.map((column) => {
                        const width = columnWidths[column.key] ?? 50;
                        const cellValue = row[column.key as keyof T];
                        return (
                            <td key={column.key} className="px-3 py-3 text-left text-[12px] font-normal text-[#252F4A] border-r border-[#F1F1F4]" style={{ width, minWidth: width, maxWidth: width }}>
                                {column.render ? <div>{column.render(cellValue, row)}</div> : <p className="truncate">{cellValue === null || cellValue === undefined || cellValue === '' ? '-' : String(cellValue)}</p>}
                            </td>
                        );
                    })}
                    {menuActions && <td className=" w-full" />}
                    {menuActions && (
                        <td className="w-[100px] min-w-[100px] px-3 py-3 text-center sticky right-0 bg-white z-10" style={{ boxShadow: '-4px 0 8px -2px rgba(0, 0, 0, 0.1)' }}>
                            <div className="flex items-center justify-center gap-2">
                                {menuActions(row).map((action, index) => (
                                    <button key={index} onClick={() => action.action && action.action()} className="p-1 hover:bg-gray-100 rounded transition-colors" title={action.label}>{action.icon}</button>
                                ))}
                            </div>
                        </td>
                    )}
                </tr>
            );
        },
        [orderedColumns, columnWidths, menuActions, withCheck, selectedRows, handleRowSelection]
    );

    // ======================== RENDER ========================

    return (
        <div className={`border shadow-md border-[#F1F1F4] rounded-lg w-full h-full flex flex-col bg-white ${className}`}>
            <div className="border-b bg-white border-[#F1F1F4] p-[10px] px-[20px] text-[14px] font-medium text-[#071437] flex justify-between items-center h-[55px] rounded-t-lg">
                <div className="flex items-center gap-[10px]">
                    <div>
                        Mostrando {pageValues} {fromName}
                    </div>
                </div>
                {buttonsHeaders && buttonsHeaders}
            </div>
            <div className={`overflow-x-auto overflow-y-auto relative w-full ${height} scroll-container bg-white`}>
                <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr className="h-10">
                            {withCheck && (
                                <th className="w-[35px] max-w-[35px] px-2 py-1 text-[13px] font-normal text-[#99A1B7] border-r border-[#F1F1F4] text-center sticky left-0 top-0 bg-gray-50 z-20">
                                    {!singleRowSelection && <CheckBox type="checkbox" checked={selectAll} onChange={(checked) => handleSelectAllChange(checked)} size="sm" />}
                                </th>
                            )}
                            {orderedColumns.map((column, index) => {
                                const colWidth = columnWidths[column.key] ?? 50;
                                return (
                                    <th key={column.key} className={`px-3 py-1 text-left text-[13px] font-normal text-[#99A1B7] border-r border-[#F1F1F4] text-wrap z-10 bg-gray-50 group top-0 sticky transition-transform duration-200 ${dragOverColumnIndex === index ? 'opacity-50' : ''}`} draggable onDragStart={() => handleDragStart(index)} onDragOver={(e) => { e.preventDefault(); handleDragOver(index); }} onDrop={() => handleDrop(index)} onDragEnd={handleDragEnd} style={{ width: colWidth, minWidth: colWidth, maxWidth: colWidth }}>
                                        <p className="truncate">{column.name}</p>
                                        <div className="absolute right-0 top-0 h-full w-[6px] cursor-col-resize select-none transition-all rounded-lg group-hover:bg-gray-200" draggable={false} onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); handleMouseDown(e, column.key); }} style={{ zIndex: 100 }} />
                                    </th>
                                );
                            })}
                            {menuActions && <th className="bg-gray-50 top-0 sticky w-full" />}
                            {menuActions && (
                                <th className="w-[100px] min-w-[100px] px-3 py-3 text-center text-[13px] font-normal text-[#99A1B7] sticky right-0 top-0 bg-gray-50 z-20" style={{ boxShadow: '-4px 0 8px -2px rgba(0, 0, 0, 0.1)' }}>
                                    Acciones
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {data.map((row) => renderRow(row))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={orderedColumns.length + (menuActions ? 2 : 0) + (withCheck ? 1 : 0)} className="h-[100px] w-full text-center align-middle">
                                    <div className="flex flex-col justify-center items-center">
                                        <p className="text-[13px] italic text-table-pagination-text">No hay datos para mostrar</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <p>Paginación</p>
        </div>
    );
};

export default React.memo(TableComponent) as <T extends { id: number }>(props: TableComponentProps<T>) => JSX.Element;