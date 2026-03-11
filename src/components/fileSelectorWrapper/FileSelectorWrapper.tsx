import { useEffect, useMemo } from "react";
import { useController, useFormContext } from "react-hook-form";
import type { PostFormValues } from "../../types/post";
import FileSelector from "../fileSelector/FileSelector";

const FileSelectorWrapper = () => {
  const { setValue, control } = useFormContext<PostFormValues>();
  const {
    field: { onChange, value },
  } = useController({ name: "img", control });

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
    <FileSelector
      onFileSelect={onChange}
      selectedFileUrl={selectedFileUrl}
      onResetFile={() => setValue("img", null)}
    />
  );
};

export default FileSelectorWrapper;
