import { IoSearch } from "react-icons/io5";

export default function Searchbar() {
  return (
    <div className="shadow-black-lg flex w-64 items-center gap-2 rounded-md bg-[#374154] px-4 py-2 font-semibold tracking-wide text-aqua">
      <IoSearch className="text-xl" />
      <input
        type="text"
        placeholder="Search recipes"
        className="w-full bg-inherit outline-none"
      />
    </div>
  );
}
