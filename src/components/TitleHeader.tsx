import { cn } from "@lib/utils";


interface TitleHeaderProps {
    title: string;
    subTitle?: string;
    fontSizeTitle?: string;
    tutorialText?: string
    setHelpModal?: (value: boolean) => void;
}

export const TitleHeader = ({ title, subTitle, fontSizeTitle = 'text-[20px] leading-[20px]', tutorialText = "Guía de Ayuda", setHelpModal }: TitleHeaderProps) => {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-[10px]">
                <p className={cn('text-table-header-main font-semibold flex', fontSizeTitle)}>{title} </p>
                {setHelpModal && (
                    <span className="text-[#1B84FF] text-[13px] font-medium flex items-center cursor-pointer" onClick={() => setHelpModal(true)}>
                        {tutorialText}
                        {/* <QuestionBlueCircleIcon /> */}
                    </span>
                )}
            </div>
            {subTitle && <p className="text-[#4B5675] text-[12px] leading-[16px] font-normal">{subTitle}</p>}
        </div>
    );
};
