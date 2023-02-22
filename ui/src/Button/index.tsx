import React from "react";

export interface ButtonProps
  extends Pick<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "className" | "children" | "disabled"> {
  variant: Variant;
}

export type Variant = "primary" | "secondary" | "danger";

const VARIANT_MAPS: Record<Variant, string> = {
  primary: "bg-gray-700 hover:bg-gray-800 disabled:bg-gray-300",
  secondary: "bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300",
  danger: "bg-red-500 hover:bg-red-700 disabled:bg-red-300",
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
