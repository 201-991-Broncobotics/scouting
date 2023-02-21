import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: Variant;
}

export enum Variant {
  Primary = "primary",
  Secondary = "secondary",
  Danger = "danger",
}

const VARIANT_MAPS: Record<Variant, string> = {
  [Variant.Primary]: "bg-gray-700 hover:bg-gray-800 disabled:bg-gray-300",
  [Variant.Secondary]: "bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300",
  [Variant.Danger]: "bg-red-500 hover:bg-red-700 disabled:bg-red-300",
};

export function Button(props: ButtonProps) {
  return (
    <button
      type='button'
      onClick={props.onClick}
      className={[
        "focus:shadow-outline mx-2 rounded  py-2 px-4 font-bold text-white focus:outline-none",
        VARIANT_MAPS[props.variant],
        props.className,
      ].join(" ")}
      disabled={props.disabled}>
      {props.children}
    </button>
  );
}
