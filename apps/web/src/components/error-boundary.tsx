"use client";

import { Component, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  hasError: boolean;
  error?: Error;
};

/* biome-ignore lint/style/useReactFunctionComponents: Error boundaries require class components */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <h2 className="mb-2 font-semibold text-red-800">
              Something went wrong
            </h2>
            <p className="text-red-600 text-sm">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
