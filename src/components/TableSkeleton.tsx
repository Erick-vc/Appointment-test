import { cn } from "@lib/utils";

const SkeletonCell = ({ width = '100%', height = '1.5rem' }) => <div className="bg-gray-300 animate-pulse rounded-md" style={{ width, height }}></div>;

type Props = {
    rows: number;
    columns: number;
    sectionsLength?: number;
    isButtonPrimary?: boolean;
    isFilters?: boolean;
    classNameContainer?: string;
    isLastColumnFixed?: boolean;
    isFirstColumnFixed?: boolean;
    showHeader?: boolean;
}

export const TableSkeleton = ({
    rows = 5,
    columns = 1,
    sectionsLength,
    isButtonPrimary = true,
    isFilters = true,
    classNameContainer,
    isLastColumnFixed = true,
    isFirstColumnFixed = true,
    showHeader = true,
}: Props) => {
    return (
        <div className={cn('w-full flex flex-col', classNameContainer)}>
            {sectionsLength && (
                <div className="w-full flex mb-[16px] ">
                    {[...Array(sectionsLength)].map((_, index) => {
                        return <div key={index} className="w-[128px] h-[31.82px] rounded-md mr-[10px] animate-pulse bg-gray-300"></div>;
                    })}
                </div>
            )}
            {isFilters && (
                <div className="flex w-full p-3 gap-2">
                    <div className="w-[72px] h-[30px] rounded-md animate-pulse bg-gray-300"></div>
                    <div className="w-[85px] h-[30px] rounded-md animate-pulse bg-gray-300"></div>
                    <div className="w-[210px] h-[30px] rounded-md animate-pulse bg-gray-300"></div>
                    <div className="w-[38px] h-[30px] rounded-md animate-pulse bg-gray-300"></div>
                </div>
            )}
            <div className="border border-[#F1F1F4] rounded-lg shadow-md">
                {showHeader && (
                    <div className="border-b border-[#F1F1F4] p-[10px] px-[20px] text-[14px] font-medium text-[#071437] flex justify-between items-center h-[55px]">
                        <div className="bg-gray-300 animate-pulse rounded-md w-[170px] h-[30px]"></div>
                        {isButtonPrimary && <div className="bg-gray-300 animate-pulse rounded-md w-[100px] h-[30px]"></div>}
                    </div>
                )}
                <div className="relative overflow-x-auto">
                    <table className="w-full bg-white">
                        <thead>
                            <tr >
                                {isFirstColumnFixed && (
                                    <th className="px-3 py-1 bg-gray-200 h-[40px] w-[50px] sticky left-0 z-10">
                                        <SkeletonCell height="1rem" width="80%" />
                                    </th>
                                )}
                                {[...Array(columns)].map((_, colIndex) => (
                                    <th key={colIndex} className="px-3 py-1 bg-gray-200 h-[40px]">
                                        <SkeletonCell height="1rem" width="80%" />
                                    </th>
                                ))}
                                {isLastColumnFixed && (
                                    <th className="px-3 py-1 bg-gray-200 h-[40px] w-[50px] sticky right-0 z-10">
                                        <SkeletonCell height="1rem" width="80%" />
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(rows)].map((_, rowIndex) => (
                                <tr key={rowIndex} >
                                    {isFirstColumnFixed && (
                                        <td className="px-3 py-3 border-b border-[#F1F1F4] w-[50px] sticky left-0 z-10 bg-white">
                                            <SkeletonCell width="30px" />
                                        </td>
                                    )}
                                    {[...Array(columns)].map((_, colIndex) => (
                                        <td key={colIndex} className="px-3 py-3 border-b border-[#F1F1F4]">
                                            <SkeletonCell width="100px" />
                                        </td>
                                    ))}
                                    {isLastColumnFixed && (
                                        <td className="px-3 py-3 border-b border-[#F1F1F4] w-[50px] sticky right-0 z-10 bg-white">
                                            <SkeletonCell width="30px" />
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-between w-full py-4 px-[20px]">
                    <div className="w-[185px] h-[34px] rounded-md mr-[10px] animate-pulse bg-gray-300"></div>
                    <div className="w-[350px] h-[30px] rounded-md mr-[10px] animate-pulse bg-gray-300"></div>
                </div>
            </div>
        </div>
    );
};
