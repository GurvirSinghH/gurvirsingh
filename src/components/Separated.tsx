import { Fragment } from "react";

/**
 * "A · B · C", keeping each separator on the same line as the item before it.
 * Lines may only break at the spaces between items, so no line starts with "·".
 */
export default function Separated({ items }: { items: string[] }) {
  return (
    <>
      {items.map((item, i) => (
        <Fragment key={item}>
          <span className="whitespace-nowrap">
            {item}
            {i < items.length - 1 && " ·"}
          </span>
          {i < items.length - 1 && " "}
        </Fragment>
      ))}
    </>
  );
}
