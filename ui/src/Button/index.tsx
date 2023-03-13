import React, { type LegacyRef } from "react";

export interface ButtonProps
  extends Pick<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "className" |"type" | "children" | "disabled"> {
  buttonRef?: LegacyRef<HTMLButtonElement> | undefined;
  variant: Variant;
}

export type Variant = "primary" | "secondary" | "danger";

const variants = {
  primary: "bg-gray-700 hover:bg-gray-800 disabled:bg-gray-300",
  secondary: "bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300",
  danger: "bg-red-500 hover:bg-red-700 disabled:bg-red-300",
} satisfies Record<Variant, string>;

export function Button(props: ButtonProps) {
  return (
    <button
      type={props.type || "button"}
      onClick={props.onClick}
      className={[
        "focus:shadow-outline mx-2 rounded py-2 px-4 font-bold text-white focus:outline-none h-min ",
        variants[props.variant],
        props.className,
      ].join(" ")}
      ref={props.buttonRef}
      disabled={props.disabled}>
      {props.children}
    </button>
  );
}
