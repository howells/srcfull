import type { LucideIcon } from "lucide-react";
import {
  File,
  FileArchive,
  FileSpreadsheet,
  FileText,
  Image,
} from "lucide-react";

export type DocumentItem = {
  id: string;
  name: string;
  downloadUrl: string;
  size?: string;
  fileType?: string;
};

export function getFileExtension(filename: string): string {
  const parts = filename.toLowerCase().trim().split(".");
  if (parts.length < 2) {
    return "";
  }
  return parts.pop() ?? "";
}

export function detectFileType(item: DocumentItem): string {
  if (item.fileType && item.fileType.length > 0) {
    return item.fileType.toLowerCase();
  }
  return getFileExtension(item.name);
}

export function getIconForFile(item: DocumentItem): LucideIcon {
  const type = detectFileType(item);
  switch (type) {
    case "pdf":
      return FileText;
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "webp":
      return Image;
    case "xls":
    case "xlsx":
    case "csv":
      return FileSpreadsheet;
    case "zip":
    case "gz":
    case "rar":
    case "tar":
      return FileArchive;
    case "txt":
    case "doc":
    case "docx":
      return FileText;
    default:
      return File;
  }
}
