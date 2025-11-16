"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_NORMAL,
  KEY_SPACE_COMMAND,
} from "lexical";
import { useEffect } from "react";
import { useTagInputContext } from "./tag-input-context";
import { KeywordNode } from "./tag-input-keyword-node";
import { getTextSinceLastTag } from "./utils/get-text-since-last-tag";
import { handleAsyncKeywordReplacement } from "./utils/handle-async-keyword-replacement";
import { findMatchingTag, queryTagMatches } from "./utils/keyword-utils";
import { replaceKeywordWithNode } from "./utils/replace-keyword-with-node";

export function KeywordPlugin() {
  const [editor] = useLexicalComposerContext();
  const { onQuery, keywords } = useTagInputContext();

  useEffect(() => {
    if (!editor.hasNodes([KeywordNode])) {
      throw new Error("KeywordPlugin: KeywordNode not registered on editor");
    }

    // Register command to detect keywords when space is pressed
    return editor.registerCommand(
      KEY_SPACE_COMMAND,
      (event) => {
        try {
          const selection = $getSelection();

          if (!$isRangeSelection(selection)) {
            console.log("[KeywordPlugin] Not a range selection");
            return false;
          }

          const node = selection.anchor.getNode();
          if (!$isTextNode(node)) {
            console.log("[KeywordPlugin] Not a text node");
            return false;
          }

          const textContent = node.getTextContent();
          const anchorOffset = selection.anchor.offset;

          console.log("[KeywordPlugin] Space pressed, text:", textContent, "offset:", anchorOffset);

          // Get all text since the last tag
          const textSinceLastTag = getTextSinceLastTag(node, anchorOffset);

          console.log("[KeywordPlugin] Text since last tag:", textSinceLastTag);

          if (!textSinceLastTag) {
            console.log("[KeywordPlugin] No text since last tag");
            return false;
          }

          // Handle async query mode
          // Disabled: automatic conversion on space is now handled by MatchHighlightPlugin + AutocompletePlugin
          if (onQuery) {
            console.log("[KeywordPlugin] Query mode - automatic conversion disabled");
            return false;
          }

          // Handle simple keywords mode
          if (keywords) {
            const matchedTag = findMatchingTag(textSinceLastTag, keywords);

            if (matchedTag) {
              console.log("[KeywordPlugin] Found keyword match:", matchedTag);
              editor.update(() => {
                replaceKeywordWithNode(node, textContent, anchorOffset, matchedTag);
              });

              event?.preventDefault();
              return true;
            }
          }

          console.log("[KeywordPlugin] No match found");
          return false;
        } catch (error) {
          console.error("[KeywordPlugin] Error in space handler:", error);
          return false;
        }
      },
      COMMAND_PRIORITY_NORMAL
    );
  }, [editor, onQuery, keywords]);

  return null;
}
