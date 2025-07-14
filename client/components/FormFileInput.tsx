import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";

interface FormFileInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  accept?: string;
  description?: string;
}

const FormFileInput = <T extends FieldValues>({ control, name, label, accept, description }: FormFileInputProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, ...restField } }) => (
        <FormItem>
          <FormLabel className="label">{label}</FormLabel>
          <FormControl>
            <Input
              type="file"
              accept={accept}
              onChange={(event) => {
                onChange(event.target.files);
              }}
              {...restField}></Input>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage></FormMessage>
        </FormItem>
      )}></Controller>
  );
};

export default FormFileInput;
