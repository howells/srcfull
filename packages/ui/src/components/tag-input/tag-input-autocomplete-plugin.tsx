"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_HIGH,
  KEY_ARROW_DOWN_COMMAND,
  KEY_ARROW_UP_COMMAND,
  KEY_ENTER_COMMAND,
  KEY_ESCAPE_COMMAND,
  type TextNode,
} from "lexical";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@repo/ui/lib/utils";
import { useTagInputContext } from "./tag-input-context";
import type { TagData } from "./tag-input-types";
import { getTextSinceLastTag } from "./utils/get-text-since-last-tag";
import { replaceKeywordWithNode } from "./utils/replace-keyword-with-node";
import { $isMatchedElementNode } from "./tag-input-matched-element-node";

function DropdownList({
  suggestions,
  highlightedIndex,
  onSelect,
  onHighlight,
  anchorPosition,
}: {
  suggestions: TagData[];
  highlightedIndex: number;
  onSelect: (item: TagData) => void;
  onHighlight: (index: number) => void;
  anchorPosition: DOMRect;
}) {
  return createPortal(
    <div
      className="fixed z-50 w-64 max-h-60 overflow-auto rounded-md border border-border bg-popover shadow-lg"
      style={{
        top: `${anchorPosition.bottom + window.scrollY + 4}px`,
        left: `${anchorPosition.left + window.scrollX}px`,
      }}
      onMouseDown={(e) => {
        // Prevent focus loss from Lexical editor
        e.preventDefault();
      }}
    >
      <div className="py-1">
        {suggestions.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className={cn(
              "w-full cursor-default select-none px-3 py-2 text-left text-sm outline-none transition-colors",
              index === highlightedIndex
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent hover:text-accent-foreground"
            )}
            onMouseEnter={() => onHighlight(index)}
            onMouseDown={(e) => {
              e.preventDefault();
              onSelect(item);
            }}
          >
            <div className="font-medium">{item.label}</div>
            {item.type && (
              <div className="text-xs text-muted-foreground capitalize">
                {item.type}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>,
    document.body
  );
}

export function AutocompletePlugin() {
  const [editor] = useLexicalComposerContext();
  const { onQuery } = useTagInputContext();
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState<TagData[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [anchorPosition, setAnchorPosition] = useState<DOMRect | null>(null);

  // Track Lexical editor changes and query for suggestions
  useEffect(() => {
    if (!onQuery) {
      return;
    }

    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          setOpen(false);
          return;
        }

        const node = selection.anchor.getNode();
        if (!$isTextNode(node)) {
          setOpen(false);
          return;
        }

        const textContent = node.getTextContent();
        const offset = selection.anchor.offset;
        const textSinceLastTag = getTextSinceLastTag(node, offset);

        // Update search value
        setSearchValue(textSinceLastTag || "");

        // Only show suggestions if at least 2 characters
        if (!textSinceLastTag || textSinceLastTag.length < 2) {
          setOpen(false);
          setSuggestions([]);
          return;
        }

        // Get caret position for dropdown positioning
        const nativeSelection = window.getSelection();
        if (nativeSelection?.rangeCount > 0) {
          const range = nativeSelection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          setAnchorPosition(rect);
        }

        // Query for suggestions
        Promise.resolve(onQuery(textSinceLastTag))
          .then((results) => {
            if (results.length > 0) {
              setSuggestions(results);
              setHighlightedIndex(0);
              setOpen(true);
            } else {
              setSuggestions([]);
              setOpen(false);
            }
          })
          .catch(() => {
            setSuggestions([]);
            setOpen(false);
          });
      });
    });
  }, [editor, onQuery]);

  // Handle selection
  const handleSelect = useCallback(
    (item: TagData) => {
      editor.update(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return;
        }

        const node = selection.anchor.getNode();

        // Check if there's a MatchedTextNode in the parent
        const parent = node.getParent();
        if (parent) {
          const children = parent.getChildren();
          let matchedElementNode = null;

          for (const child of children) {
            if ($isMatchedElementNode(child)) {
              matchedElementNode = child;
              break;
            }
          }

          // If we found a MatchedElementNode, replace it with a KeywordNode
          if (matchedElementNode) {
            replaceKeywordWithNode(
              node as TextNode,
              node.getTextContent(),
              selection.anchor.offset,
              item,
              searchValue
            );
            return;
          }
        }

        // Otherwise, handle as normal text node
        if (!$isTextNode(node)) {
          return;
        }

        replaceKeywordWithNode(
          node as TextNode,
          node.getTextContent(),
          selection.anchor.offset,
          item,
          searchValue
        );
      });

      setOpen(false);
      setSuggestions([]);
      setSearchValue("");
      setHighlightedIndex(0);
    },
    [editor, searchValue]
  );

  // Handle keyboard navigation
  useEffect(() => {
    if (!open || suggestions.length === 0) {
      return;
    }

    const removeArrowUp = editor.registerCommand(
      KEY_ARROW_UP_COMMAND,
      (event) => {
        event?.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        return true;
      },
      COMMAND_PRIORITY_HIGH
    );

    const removeArrowDown = editor.registerCommand(
      KEY_ARROW_DOWN_COMMAND,
      (event) => {
        event?.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        return true;
      },
      COMMAND_PRIORITY_HIGH
    );

    const removeEnter = editor.registerCommand(
      KEY_ENTER_COMMAND,
      (event) => {
        event?.preventDefault();
        const selectedItem = suggestions[highlightedIndex];
        if (selectedItem) {
          handleSelect(selectedItem);
        }
        return true;
      },
      COMMAND_PRIORITY_HIGH
    );

    const removeEscape = editor.registerCommand(
      KEY_ESCAPE_COMMAND,
      () => {
        setOpen(false);
        setSuggestions([]);
        setHighlightedIndex(0);
        return true;
      },
      COMMAND_PRIORITY_HIGH
    );

    return () => {
      removeArrowUp();
      removeArrowDown();
      removeEnter();
      removeEscape();
    };
  }, [editor, open, suggestions, highlightedIndex, handleSelect]);

  if (!open || suggestions.length === 0 || !anchorPosition) {
    return null;
  }

  return (
    <DropdownList
      suggestions={suggestions}
      highlightedIndex={highlightedIndex}
      onSelect={handleSelect}
      onHighlight={setHighlightedIndex}
      anchorPosition={anchorPosition}
    />
  );
}
