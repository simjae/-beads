"use client";
import React, { FC } from "react";
import { Icon } from "../Icon";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
export const Canvas: FC = () => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm();

  return (
    <div className="bg-muted rounded-lg p-4 flex flex-col gap-4">
      <h3 className="font-semibold">Canvas</h3>
      <div className="aspect-[4/3] bg-muted-foreground/10 rounded-md border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
        <Icon
          type="layoutGrid"
          className="w-12 h-12 text-muted-foreground/50"
        />
      </div>
    </div>
  );
};
