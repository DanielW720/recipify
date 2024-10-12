import { useSearchContext } from "../../../../contexts/useSearchContext";

const ranges = [
  { param: "start_date", label: "From" },
  { param: "end_date", label: "To" },
];

export default function RangeFilters() {
  return (
    <div className="tracking-wider text-white">
      <h3 className="font-semibold">Published range</h3>
      {ranges.map((o) => (
        <RangeFilter key={o.param} param={o.param} label={o.label} />
      ))}
    </div>
  );
}

const RangeFilter = ({ param, label }: { param: string; label: string }) => {
  const { filters, setFilterParameter, removeFilter } = useSearchContext();

  return (
    <div className="mt-2 flex text-blue">
      <label htmlFor={param}>{label}:</label>
      <input
        type="date"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          if (!e.target.value) {
            removeFilter(param);
            return;
          }
          setFilterParameter(param, e.target.value);
        }}
        value={filters.find((f) => f.key === param)?.value || ""}
        id={param}
        name={param}
        className="flex w-full bg-darkBlue px-2 outline-none"
      />
    </div>
  );
};
