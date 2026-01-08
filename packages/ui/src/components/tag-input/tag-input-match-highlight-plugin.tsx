"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  type TextNode,
} from "lexical";
import { useEffect, useRef } from "react";
import { useTagInputContext } from "./tag-input-context";
import {
  $createMatchedElementNode,
  $isMatchedElementNode,
} from "./tag-input-matched-element-node";
import type { TagData } from "./tag-input-types";

export function MatchHighlightPlugin() {
  const [editor] = useLexicalComposerContext();
  const { onQuery } = useTagInputContext();
  const queryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isProcessingRef = useRef(false);
  const lastTextRef = useRef<string>("");

  useEffect(() => {
    if (!onQuery) {
      return;
    }

    return editor.registerUpdateListener(
      ({ editorState, dirtyElements, dirtyLeaves }) => {
        // Prevent recursive updates
        if (isProcessingRef.current) {
          return;
        }

        // Only process if there are actual content changes
        if (dirtyElements.size === 0 && dirtyLeaves.size === 0) {
          return;
        }

        editorState.read(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) {
            return;
          }

          const node = selection.anchor.getNode();
          // Get the root paragraph node, not just immediate parent
          const rootNode = node.getTopLevelElement();
          if (!rootNode) {
            return;
          }

          // Get current text and check if it has actually changed
          const currentText = rootNode.getTextContent();
          if (currentText === lastTextRef.current) {
            return; // No text change, skip processing
          }

          lastTextRef.current = currentText;
        });

        // Clear existing timeout
        if (queryTimeoutRef.current) {
          clearTimeout(queryTimeoutRef.current);
        }

        // Debounce the query - increased to 500ms to reduce glitchiness
        queryTimeoutRef.current = setTimeout(() => {
          editorState.read(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) {
              return;
            }

            const node = selection.anchor.getNode();
            // Get the root paragraph node, not just immediate parent
            const rootNode = node.getTopLevelElement();
            if (!rootNode) {
              return;
            }

            // Get full text content of the paragraph
            const fullText = rootNode.getTextContent();

            // Only query if we have at least 2 characters
            if (!fullText || fullText.trim().length < 2) {
              // Unwrap any MatchedElementNodes back to text
              isProcessingRef.current = true;
              unwrapMatchedElements(editor, rootNode);
              setTimeout(() => {
                isProcessingRef.current = false;
              }, 0);
              return;
            }

            // Query the server with the full text - it will return matches with positions
            Promise.resolve(onQuery(fullText))
              .then((results) => {
                if (results.length > 0) {
                  // Build a map of exact matches (case-insensitive)
                  const matchMap = new Map<string, TagData>();
                  for (const result of results) {
                    const key = result.label.toLowerCase();
                    matchMap.set(key, result);
                  }

                  isProcessingRef.current = true;
                  editor.update(() => {
                    // Re-get root node as we're in a new update
                    const currentSelection = $getSelection();
                    if (!$isRangeSelection(currentSelection)) {
                      return;
                    }

                    const currentNode = currentSelection.anchor.getNode();
                    const currentRootNode = currentNode.getTopLevelElement();
                    if (!currentRootNode) {
                      return;
                    }

                    // Store cursor position before transformation
                    const cursorOffset = currentSelection.anchor.offset;

                    // Process the paragraph and replace exact matches
                    replaceExactMatches(
                      currentRootNode,
                      matchMap,
                      cursorOffset
                    );
                  });
                  setTimeout(() => {
                    isProcessingRef.current = false;
                  }, 0);
                } else {
                  // No matches, unwrap any MatchedElementNodes back to text
                  isProcessingRef.current = true;
                  unwrapMatchedElements(editor, rootNode);
                  setTimeout(() => {
                    isProcessingRef.current = false;
                  }, 0);
                }
              })
              .catch(() => {
                // On error, unwrap any MatchedElementNodes back to text
                isProcessingRef.current = true;
                unwrapMatchedElements(editor, rootNode);
                setTimeout(() => {
                  isProcessingRef.current = false;
                }, 0);
              });
          });
        }, 500); // 500ms debounce to reduce glitchiness
      }
    );
  }, [editor, onQuery]);

  // Cleanup timeout on unmount
  useEffect(
    () => () => {
      if (queryTimeoutRef.current) {
        clearTimeout(queryTimeoutRef.current);
      }
    },
    []
  );

  return null;
}

// Helper: Unwrap all MatchedElementNodes back to plain text
function unwrapMatchedElements(editor: any, parent: any) {
  editor.update(() => {
    const children = parent.getChildren();
    for (const child of children) {
      if ($isMatchedElementNode(child)) {
        const textContent = child.getTextContent();
        const textNode = $createTextNode(textContent);
        child.replace(textNode);
      }
    }
  });
}

// Helper: Wrap matched text in ElementNodes
function replaceExactMatches(
  parent: any,
  matchMap: Map<string, TagData>,
  _cursorOffset: number
) {
  // Get current selection to preserve cursor
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) {
    return;
  }

  const anchorNode = selection.anchor.getNode();
  const anchorOffset = selection.anchor.offset;

  // Get all text nodes and MatchedElementNodes
  const children = parent.getChildren();

  // First, unwrap all MatchedElementNodes back to text to start fresh
  for (const child of children) {
    if ($isMatchedElementNode(child)) {
      const textContent = child.getTextContent();
      const textNode = $createTextNode(textContent);
      child.replace(textNode);
    }
  }

  // Calculate cursor position BEFORE merging (important!)
  const allChildren = parent.getChildren();
  const textNodes: TextNode[] = [];
  for (const child of allChildren) {
    if ($isTextNode(child)) {
      textNodes.push(child);
    }
  }

  if (textNodes.length === 0) {
    return;
  }

  // Calculate absolute cursor position in combined text
  let cursorPositionInText = 0;
  let currentPosition = 0;
  let foundCursor = false;

  for (const node of textNodes) {
    const nodeText = node.getTextContent();
    const nodeLength = nodeText.length;

    // Check if cursor is in this node
    if (anchorNode === node || anchorNode.getParent() === node) {
      cursorPositionInText = currentPosition + anchorOffset;
      foundCursor = true;
      break;
    }

    currentPosition += nodeLength;
  }

  // If cursor wasn't found in any TextNode, default to end
  if (!foundCursor) {
    cursorPositionInText = currentPosition;
  }

  // Merge all text content into the first text node
  let combinedText = "";
  for (const node of textNodes) {
    combinedText += node.getTextContent();
  }

  // Replace all text nodes with a single merged node
  const firstNode = textNodes[0];
  firstNode.setTextContent(combinedText);

  // Remove the rest of the text nodes
  for (let i = 1; i < textNodes.length; i++) {
    textNodes[i].remove();
  }

  // Now process the single merged text node
  const textNode = firstNode;
  const text = combinedText;

  // Find all exact matches in the text (greedy, longest first)
  const matches = findExactMatches(text, matchMap);

  if (matches.length === 0) {
    return;
  }

  // Filter out incomplete words (words still being typed)
  // Only match complete words: words with whitespace/punctuation after them
  const activeMatches = matches.filter((match) => {
    // If cursor is within the match (including at the end)
    const cursorInMatch =
      cursorPositionInText >= match.start && cursorPositionInText <= match.end;

    if (cursorInMatch) {
      // Check if there's whitespace or punctuation after the match (word is complete)
      const charAfter = match.end < text.length ? text[match.end] : "";
      const hasDelimiterAfter = charAfter === " " || /[^\w]/.test(charAfter);

      // Only highlight if word has delimiter after (word is complete)
      return hasDelimiterAfter;
    }

    // Cursor not in match, safe to highlight
    return true;
  });

  if (activeMatches.length === 0) {
    return;
  }

  // Build replacement nodes based on matches
  const replacementNodes: Array<{
    node: any;
    start: number;
    end: number;
  }> = [];
  let lastIndex = 0;

  for (const match of activeMatches) {
    // Add text before match
    if (match.start > lastIndex) {
      const beforeText = text.substring(lastIndex, match.start);
      replacementNodes.push({
        node: $createTextNode(beforeText),
        start: lastIndex,
        end: match.start,
      });
    }

    // Add matched element node wrapping the text
    const matchedElement = $createMatchedElementNode({
      ...match.tag,
      label: match.text,
    });
    // Append the text as a child of the element node
    const textNodeInMatch = $createTextNode(match.text);
    matchedElement.append(textNodeInMatch);

    replacementNodes.push({
      node: matchedElement,
      start: match.start,
      end: match.end,
    });

    lastIndex = match.end;
  }

  // Add remaining text after last match
  if (lastIndex < text.length) {
    const afterText = text.substring(lastIndex);
    replacementNodes.push({
      node: $createTextNode(afterText),
      start: lastIndex,
      end: text.length,
    });
  }

  // Find which node the cursor should be in
  let targetNode = null;
  let targetOffset = 0;

  for (const { node, start, end } of replacementNodes) {
    if (cursorPositionInText >= start && cursorPositionInText <= end) {
      targetNode = node;
      targetOffset = cursorPositionInText - start;
      break;
    }
  }

  // Replace the text node with the new nodes
  if (replacementNodes.length > 0) {
    const firstNode = replacementNodes[0].node;
    textNode.replace(firstNode);

    let previousNode = firstNode;
    for (let i = 1; i < replacementNodes.length; i++) {
      previousNode.insertAfter(replacementNodes[i].node);
      previousNode = replacementNodes[i].node;
    }

    // Restore cursor position
    if (targetNode && $isTextNode(targetNode)) {
      targetNode.select(targetOffset, targetOffset);
    } else if (targetNode && $isMatchedElementNode(targetNode)) {
      // If cursor should be in a MatchedElementNode, select inside its TextNode child
      const textChild = targetNode.getFirstChild();
      if ($isTextNode(textChild)) {
        textChild.select(targetOffset, targetOffset);
      } else {
        // Fallback: place cursor after the element
        targetNode.selectNext(0, 0);
      }
    } else if (targetNode) {
      // Fallback: place cursor after the node
      targetNode.selectNext(0, 0);
    }
  }
}

// Helper: Find all exact matches in text
function findExactMatches(
  text: string,
  matchMap: Map<string, TagData>
): Array<{ start: number; end: number; text: string; tag: TagData }> {
  const matches: Array<{
    start: number;
    end: number;
    text: string;
    tag: TagData;
  }> = [];

  // Sort match keys by length (longest first) for greedy matching
  const sortedKeys = Array.from(matchMap.keys()).sort(
    (a, b) => b.length - a.length
  );

  const textLower = text.toLowerCase();
  const usedRanges = new Set<string>();

  // Try to match each key
  for (const key of sortedKeys) {
    let searchStart = 0;

    while (searchStart < text.length) {
      const matchIndex = textLower.indexOf(key, searchStart);

      if (matchIndex === -1) {
        break;
      }

      const matchEnd = matchIndex + key.length;

      // Check if this is a word boundary match
      const beforeChar = matchIndex > 0 ? text[matchIndex - 1] : " ";
      const afterChar = matchEnd < text.length ? text[matchEnd] : " ";

      const isWordBoundary =
        (beforeChar === " " || /[^\w]/.test(beforeChar) || matchIndex === 0) &&
        (afterChar === " " ||
          /[^\w]/.test(afterChar) ||
          matchEnd === text.length);

      if (isWordBoundary) {
        // Check if this range overlaps with existing matches
        const _rangeKey = `${matchIndex}-${matchEnd}`;
        let overlaps = false;

        for (let i = matchIndex; i < matchEnd; i++) {
          if (usedRanges.has(`${i}`)) {
            overlaps = true;
            break;
          }
        }

        if (!overlaps) {
          const matchedText = text.substring(matchIndex, matchEnd);
          const tag = matchMap.get(key);

          if (tag) {
            matches.push({
              start: matchIndex,
              end: matchEnd,
              text: matchedText,
              tag,
            });

            // Mark this range as used
            for (let i = matchIndex; i < matchEnd; i++) {
              usedRanges.add(`${i}`);
            }
          }
        }
      }

      searchStart = matchIndex + 1;
    }
  }

  // Sort matches by position
  matches.sort((a, b) => a.start - b.start);

  return matches;
}
