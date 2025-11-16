# DataGrid Expandable Rows - Summary

## What Was Added

The DataGrid component now has **full support for expandable rows (sub-tables)** with easy-to-use components and helpers.

### New Components

1. **`DataGridExpandToggle`** - A ready-to-use toggle button component
2. **`createExpanderColumn()`** - Helper function to quickly add an expand column

### What Was Already There

The base infrastructure was already in place:
- `DataGridTableBodyRowExpandded` component renders expanded content
- Support for `meta.expandedContent` in column definitions
- Integration with TanStack Table's `getExpandedRowModel()`

## Quick Usage

```tsx
import {
  DataGrid,
  DataGridTable,
  createExpanderColumn,
} from "@materia/ui/components/data-grid";
import { getExpandedRowModel } from "@tanstack/react-table";

// 1. Add expander column
const columns = [
  createExpanderColumn<MyData>(),
  { accessorKey: 'name', header: 'Name' },
  {
    accessorKey: 'details',
    header: 'Details',
    meta: {
      // 2. Define what shows when expanded
      expandedContent: (row) => (
        <div className="p-4">
          <h4>Expanded Details for {row.name}</h4>
          {/* Your expanded content here */}
        </div>
      ),
    },
  },
];

// 3. Add expanded row model
const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getExpandedRowModel: getExpandedRowModel(), // Required!
});
```

## Key Features

- ✅ **Toggle buttons** - Automatically show/hide based on whether rows can expand
- ✅ **Nested tables** - Render complete sub-tables within expanded rows
- ✅ **Programmatic control** - Control expansion state via table methods
- ✅ **Conditional expansion** - Use `getRowCanExpand` to control which rows can expand
- ✅ **Custom icons** - Override default chevron icons
- ✅ **Full TypeScript support** - Expanded content is typed to your data

## Files Added

- `data-grid-expand.tsx` - Toggle component and helper
- `data-grid-expandable.stories.tsx` - Interactive Storybook example
- `data-grid-expandable-rows.md` - Complete documentation

## Files Modified

- `data-grid.tsx` - Added exports for new components

## Examples Available

1. **Storybook** - Run Storybook to see the interactive example at `DataGrid/Expandable Rows`
2. **Documentation** - See `data-grid-expandable-rows.md` for detailed examples
3. **Classifications page** - Could be updated to show expandable rows for classification values

## Next Steps

To use in your app:

```tsx
import {
  DataGrid,
  DataGridContainer,
  DataGridTable,
  createExpanderColumn,
} from "@materia/ui/components/data-grid";
```

See `data-grid-expandable-rows.md` for complete examples and advanced usage patterns.





