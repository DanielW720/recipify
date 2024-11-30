import { Hit as HitType } from "../../hooks/useSearch";
import formatDate from "../../utils/formatDate";

export const Hit = ({ hit, imageUrl }: { hit: HitType; imageUrl: string }) => (
  <li
    key={hit.id}
    className="flex w-[300px] flex-col justify-between gap-2 rounded-md border-[1px] border-aqua bg-darkBlue p-2 shadow-black-lg xl:w-[200px]"
  >
    <h2 className="text-center font-semibold tracking-wider text-aqua">
      {hit.title}
    </h2>
    <p className="mt-1 text-xs text-white/50">{formatDate(hit.published)}</p>
    <img
      src={imageUrl}
      alt={`${hit.title} picture`}
      className="h-44 rounded-md object-cover shadow-md xl:h-28"
      sizes="500px"
    />
  </li>
);
