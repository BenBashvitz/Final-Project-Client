import { useEffect, useMemo } from "react";
import { useController, useFormContext } from "react-hook-form";
import type { PostFormValues } from "../../types/post";
import FileSelector from "../fileSelector/FileSelector";
import FormFieldErrorWrapper from "../formFieldErrorWrapper/FormFieldErrorWrapper";
import styles from "./fileSelectorWrapper.module.css";

const FileSelectorWrapper = () => {
  const { setValue, control } = useFormContext<PostFormValues>();
  const {
    field: { onChange, value },
    fieldState: { error },
    formState: { isSubmitted },
  } = useController({
    name: "img",
    control,
    rules: { required: "Image is required" },
  });

  const selectedFileUrl = useMemo(() => {
    if (value instanceof File) {
      return URL.createObjectURL(value);
    }

    return value;
  }, [value]);

  useEffect(() => {
    return () => {
      if (selectedFileUrl) {
        URL.revokeObjectURL(selectedFileUrl);
      }
    };
  }, [selectedFileUrl]);

  return (
    <FormFieldErrorWrapper error={error?.message}>
      <FileSelector
        onFileSelect={onChange}
        selectedFileUrl={selectedFileUrl}
        onResetFile={() => setValue("img", "", { shouldValidate: isSubmitted })}
        wrapperClassName={error?.message && styles.error}
      />
    </FormFieldErrorWrapper>
  );
};

export default FileSelectorWrapper;
