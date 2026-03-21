import * as LabelPrimitive from "@radix-ui/react-label";
import { Upload, X } from "lucide-react";
import React, { useRef } from "react";
import { Button } from "../button/Button";
import { ImageWithFallback } from "../imageWithFallback/ImageWithFallback";
import styles from "./fileSelector.module.css";

type FileSelectorProps = {
  onFileSelect: (file: File) => void;
  onResetFile: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  selectedFileUrl: string;
  wrapperClassName?: string;
};

const FileSelector = ({
  onFileSelect,
  onResetFile,
  selectedFileUrl,
  wrapperClassName,
}: FileSelectorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      onFileSelect(file);

      e.target.value = "";
    }
  };

  return (
    <>
      <div className="formGroup">
        <LabelPrimitive.Root className={styles.label}>
          Image
        </LabelPrimitive.Root>
        <div className={styles.uploadSection}>
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className={[styles.uploadButton, wrapperClassName]
              .filter(Boolean)
              .join(" ")}
          >
            <Upload className={styles.uploadIcon} />
            {selectedFileUrl ? "Change Image" : "Upload Image from Computer"}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg"
            onChange={handleFileSelect}
            className={styles.hiddenInput}
          />
        </div>
      </div>

      {selectedFileUrl && (
        <div className={styles.previewContainer}>
          <ImageWithFallback
            src={selectedFileUrl}
            alt="Preview"
            className={styles.previewImage}
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className={styles.removeButton}
            onClick={onResetFile}
          >
            <X className={styles.removeIcon} />
          </Button>
        </div>
      )}
    </>
  );
};

export default FileSelector;
