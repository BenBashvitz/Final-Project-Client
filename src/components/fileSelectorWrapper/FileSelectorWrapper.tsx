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
    if (value) {
      return URL.createObjectURL(value);
    }
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
        onResetFile={() =>
          setValue("img", null, { shouldValidate: isSubmitted })
        }
        wrapperClassName={error?.message && styles.error}
      />
    </FormFieldErrorWrapper>
  );
};

export default FileSelectorWrapper;
