export interface ToolResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ImageCandidate {
  url: string;
  source: 'img' | 'picture' | 'background';
  width?: number;
  height?: number;
  srcset?: string[];
  alt?: string;
}
