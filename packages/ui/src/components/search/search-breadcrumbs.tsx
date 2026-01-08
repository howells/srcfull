"use client";

export type Breadcrumb = {
  text: string;
  index: number;
  isClickable: boolean;
};

export type SearchBreadcrumbsProps = {
  breadcrumbs: Breadcrumb[];
  materialKeyword: string;
  onClick: (index: number) => void;
};

export function SearchBreadcrumbs({
  breadcrumbs,
  materialKeyword,
  onClick,
}: SearchBreadcrumbsProps) {
  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <div className="font-medium text-base text-gray-700">
      <span>{materialKeyword}</span>

      {breadcrumbs.map((breadcrumb, idx) => (
        <span key={breadcrumb.index}>
          {idx === 0 && <span> for </span>}
          {idx > 0 && <span> </span>}

          {breadcrumb.isClickable ? (
            <button
              aria-label={`Edit ${breadcrumb.text} selection`}
              className="group relative inline-block"
              onClick={() => onClick(breadcrumb.index)}
              type="button"
            >
              <span className="relative z-10 transition-colors duration-150 group-hover:text-blue-700">
                {breadcrumb.text}
              </span>
              <span className="absolute bottom-0 left-0 h-[1px] w-full bg-blue-400 transition-all duration-150 ease-out group-hover:h-full group-hover:bg-blue-100" />
            </button>
          ) : (
            <span>{breadcrumb.text}</span>
          )}
        </span>
      ))}
    </div>
  );
}
