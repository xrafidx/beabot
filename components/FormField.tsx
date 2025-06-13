// Tiap komponen form itu buatnya di sini, nanti di render ke AuthForm

import React from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type: "text" | "password" | "email";
  description: string;
}

const FormField = <T extends FieldValues>({ control, name, label, placeholder, type = "text", description }: FormFieldProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <FormItem>
        <FormLabel className="label">{label}</FormLabel>
        <FormControl>
          <Input placeholder={placeholder} type={type} {...field} />
        </FormControl>
        <FormDescription className="font-thin text-left text-white">{description}</FormDescription>
        <FormMessage />
      </FormItem>
    )}></Controller>
);

export default FormField;
