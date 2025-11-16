"use client";

import { useFileUpload } from "./use-file-upload";
import { Button } from "../button";
import { Text } from "../text";
import { CircleUser } from "lucide-react";

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
					className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-input"
					aria-label={previewUrl ? "Preview of uploaded image" : "Default user avatar"}
				>
					{previewUrl ? (
						<img
							className="size-full object-cover"
							src={previewUrl}
							alt="Preview of uploaded image"
							width={32}
							height={32}
						/>
					) : (
						<div aria-hidden="true">
							<CircleUser className="opacity-60" size={16} />
						</div>
					)}
				</div>
				<div className="relative inline-block">
					<Button onClick={openFileDialog} aria-haspopup="dialog">
						{fileName ? "Change image" : "Upload image"}
					</Button>
					<input
						{...getInputProps()}
						className="sr-only"
						aria-label="Upload image file"
						tabIndex={-1}
					/>
				</div>
			</div>
			{fileName ? (
				<div className="inline-flex gap-2 text-xs">
					<Text className="truncate text-muted-foreground" aria-live="polite">
						{fileName}
					</Text>{" "}
					<Button
						type="button"
						variant="link"
						size="sm"
						onClick={() => {
							const fileId = files[0]?.id;
							if (fileId) {
								removeFile(fileId);
							}
						}}
						className="h-auto p-0 text-xs font-medium text-destructive hover:underline"
						aria-label={`Remove ${fileName}`}
					>
						Remove
					</Button>
				</div>
			) : (
				<div className="inline-flex gap-2 text-xs">
					<Text className="truncate text-muted-foreground" aria-live="polite">
						No image attached
					</Text>
				</div>
			)}
		</div>
	);
}
