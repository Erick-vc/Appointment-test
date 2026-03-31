interface AccountToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
}

export const AccountToggle = ({ checked, onChange }: AccountToggleProps) => {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-8 w-11 rounded-full border transition-colors ${
        checked
          ? "border-[#3972FF] bg-[#3972FF]"
          : "border-[#D5DEEC] bg-[#EEF3FB]"
      }`}
      aria-pressed={checked}
    >
      <span
        className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-sm transition-all ${
          checked ? "left-4" : "left-1"
        }`}
      />
    </button>
  );
};
