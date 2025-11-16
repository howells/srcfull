/**
 * Utility type that adds testId prop to component props for Playwright testing.
 * Components should extract testId and render it as data-testid={testId}.
 *
 * @example
 * ```tsx
 * function MyComponent({ testId, ...props }: WithTestId<React.ComponentProps<"div">>) {
 *   return <div data-testid={testId} {...props} />;
 * }
 * ```
 */
export type WithTestId<T> = T & {
  testId?: string;
};
