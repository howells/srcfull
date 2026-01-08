"use client";

import { CircleUser } from "lucide-react";
import { Button } from "../button";
import { Text } from "../text";
import { useFileUpload } from "./use-file-upload";

export function FileUpload() {
  const [{ files }, { removeFile, openFileDialog, getInputProps }] =
    useFileUpload({
      accept: "image/*",
    });

  const previewUrl = files[0]?.preview || null;
  const fileName = files[0]?.file.name || null;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="inline-flex items-center gap-2 align-top">
        <div
          aria-label={
            previewUrl ? "Preview of uploaded image" : "Default user avatar"
          }
          className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-input"
        >
          {previewUrl ? (
            <img
              alt="Preview of uploaded image"
              className="size-full object-cover"
              height={32}
              src={previewUrl}
              width={32}
            />
          ) : (
            <div aria-hidden="true">
              <CircleUser className="opacity-60" size={16} />
            </div>
          )}
        </div>
        <div className="relative inline-block">
          <Button aria-haspopup="dialog" onClick={openFileDialog}>
            {fileName ? "Change image" : "Upload image"}
          </Button>
          <input
            {...getInputProps()}
            aria-label="Upload image file"
            className="sr-only"
            tabIndex={-1}
          />
        </div>
      </div>
      {fileName ? (
        <div className="inline-flex gap-2 text-xs">
          <Text aria-live="polite" className="truncate text-muted-foreground">
            {fileName}
          </Text>{" "}
          <Button
            aria-label={`Remove ${fileName}`}
            className="h-auto p-0 font-medium text-destructive text-xs hover:underline"
            onClick={() => {
              const fileId = files[0]?.id;
              if (fileId) {
                removeFile(fileId);
              }
            }}
            size="sm"
            type="button"
            variant="link"
          >
            Remove
          </Button>
        </div>
      ) : (
        <div className="inline-flex gap-2 text-xs">
          <Text aria-live="polite" className="truncate text-muted-foreground">
            No image attached
          </Text>
        </div>
      )}
    </div>
  );
}
