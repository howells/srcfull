import type { Meta, StoryObj } from "@storybook/react";
import { ImageIcon, Upload } from "lucide-react";
import { Badge } from "../badge";
import { Button } from "../button";
import { Card, CardContent, CardHeader, CardTitle } from "../card";
import { IconContainer } from "../icon-container";
import { VStack } from "../stack";
import { Text } from "../text";
import { FileUpload } from "./file-upload-root";
import { useFileUpload } from "./use-file-upload";

const meta = {
  title: "Components/FileUpload",
  component: FileUpload,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AvatarUpload: Story = {};

export const ImageUploadWithPreview: StoryObj = {
  render: () => {
    const [
      { files, isDragging },
      {
        removeFile,
        openFileDialog,
        getInputProps,
        handleDragEnter,
        handleDragLeave,
        handleDragOver,
        handleDrop,
      },
    ] = useFileUpload({
      accept: "image/*",
      maxSize: 5 * 1024 * 1024, // 5MB
    });

    const previewUrl = files[0]?.preview || null;

    return (
      <Card border="dashed" className="w-96">
        <CardHeader>
          <CardTitle>Image Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <VStack gap="base">
            <div
              className={`flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-12 transition-colors ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-muted-foreground/50"
              }`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input {...getInputProps()} className="sr-only" />
              {previewUrl ? (
                <div className="flex flex-col items-center gap-4">
                  <img
                    alt="Uploaded"
                    className="max-h-64 max-w-full rounded-lg object-contain"
                    height={512}
                    src={previewUrl}
                    width={512}
                  />
                  <Button onClick={openFileDialog} size="sm" variant="outline">
                    <Upload />
                    Upload Different Image
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 text-center">
                  <IconContainer icon={ImageIcon} size="xl" variant="muted" />
                  <div className="flex flex-col gap-2">
                    <Text className="font-medium">
                      Drop an image here or click to upload
                    </Text>
                    <Text className="text-muted-foreground text-xs">
                      JPEG, PNG, or WebP up to 5MB
                    </Text>
                  </div>
                  <Button onClick={openFileDialog} size="lg">
                    <Upload />
                    Select Image
                  </Button>
                </div>
              )}
            </div>

            {files[0] && (
              <div className="flex items-center justify-between rounded-md border p-3">
                <div className="flex flex-col gap-1">
                  <Text className="font-medium">{files[0].file.name}</Text>
                  <Text className="text-muted-foreground text-xs">
                    {(files[0].file.size / 1024 / 1024).toFixed(2)} MB
                  </Text>
                </div>
                <Button
                  onClick={() => {
                    const fileId = files[0]?.id;
                    if (fileId) {
                      removeFile(fileId);
                    }
                  }}
                  size="sm"
                  variant="ghost"
                >
                  Remove
                </Button>
              </div>
            )}
          </VStack>
        </CardContent>
      </Card>
    );
  },
};

export const MultipleFiles: StoryObj = {
  render: () => {
    const [{ files, errors }, { removeFile, openFileDialog, getInputProps }] =
      useFileUpload({
        multiple: true,
        maxFiles: 5,
        maxSize: 10 * 1024 * 1024, // 10MB
        accept: "image/*,.pdf,.doc,.docx",
      });

    return (
      <Card border="dashed" className="w-96">
        <CardHeader>
          <CardTitle>Multiple File Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <VStack gap="base">
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-muted-foreground/25 border-dashed p-8 transition-colors hover:border-muted-foreground/50">
              <input {...getInputProps()} className="sr-only" />
              <IconContainer icon={Upload} size="lg" variant="muted" />
              <div className="flex flex-col gap-2 text-center">
                <Text className="font-medium">
                  Upload up to 5 files (max 10MB each)
                </Text>
                <Text className="text-muted-foreground text-xs">
                  Images, PDFs, and Word documents
                </Text>
              </div>
              <Button onClick={openFileDialog}>Select Files</Button>
            </div>

            {errors.length > 0 && (
              <div className="rounded-md border border-destructive bg-destructive/10 p-3">
                {errors.map((error, index) => (
                  <Text className="text-destructive" key={index}>
                    {error}
                  </Text>
                ))}
              </div>
            )}

            {files.length > 0 && (
              <VStack gap="xs">
                <div className="flex items-center justify-between">
                  <Text className="font-medium">
                    {files.length} file{files.length > 1 ? "s" : ""} selected
                  </Text>
                  <Badge variant="outline">{files.length}/5</Badge>
                </div>
                <VStack gap="xs">
                  {files.map((file) => (
                    <div
                      className="flex items-center justify-between rounded-md border p-3"
                      key={file.id}
                    >
                      <div className="flex flex-col gap-1">
                        <Text className="font-medium">{file.file.name}</Text>
                        <Text className="text-muted-foreground text-xs">
                          {(file.file.size / 1024).toFixed(0)} KB
                        </Text>
                      </div>
                      <Button
                        onClick={() => removeFile(file.id)}
                        size="sm"
                        variant="ghost"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </VStack>
              </VStack>
            )}
          </VStack>
        </CardContent>
      </Card>
    );
  },
};
