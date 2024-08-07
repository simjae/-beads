import React, { ButtonHTMLAttributes, FC } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "outline" | "solid";
}

export const Button: FC<ButtonProps> = ({
  children,
  variant = "solid",
  ...props
}) => {
  const baseClasses = "px-4 py-2 rounded";
  const variantClasses =
    variant === "outline" ? "border border-gray-300" : "bg-blue-500 text-white";

  return (
    <button className={`${baseClasses} ${variantClasses}`} {...props}>
      {children}
    </button>
  );
};
