import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Badge } from "../badge";
import { BadgeButton } from "../badge/badge-button";
import { type TagData, TagInput } from "./tag-input-root";

const meta = {
  title: "Tag Input",
  component: TagInput,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    placeholder: {
      control: "text",
      description: "Placeholder text shown when input is empty",
    },
    keywords: {
      control: "object",
      description:
        "Array of simple keywords that will be converted to tags on match",
    },
  },
} satisfies Meta<typeof TagInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultKeywords = [
  "modern",
  "minimalist",
  "industrial",
  "scandinavian",
  "contemporary",
  "rustic",
  "traditional",
  "coastal",
];

/**
 * Simple mode with string keywords. Tags are converted internally to TagData.
 */
export const Base: Story = {
  args: {
    keywords: defaultKeywords,
    placeholder: "Add style tags…",
  },
  render: (args) => {
    const [tags, setTags] = useState<TagData[]>([]);

    return (
      <div className="space-y-4">
        <TagInput {...args} onTagsChange={setTags} />
        <p className="text-muted-foreground text-xs">
          Available: modern, minimalist, industrial, scandinavian, contemporary,
          rustic, traditional, coastal
        </p>
        {tags.length > 0 && (
          <div className="text-muted-foreground text-sm">
            Active tags: {tags.map((t) => t.label).join(", ")}
          </div>
        )}
      </div>
    );
  },
};

/**
 * Custom rendering with different badge variants per tag type
 */
export const CustomRendering: Story = {
  render: () => {
    const [tags, setTags] = useState<TagData[]>([]);

    return (
      <div className="space-y-4">
        <TagInput
          onQuery={async (query) => {
            // Simulate async query
            await new Promise((resolve) => setTimeout(resolve, 100));

            const lowerQuery = query.toLowerCase();

            // Match styles
            if (
              ["modern", "minimalist", "industrial", "scandinavian"].includes(
                lowerQuery
              )
            ) {
              return [
                {
                  id: lowerQuery,
                  label: query,
                  type: "style",
                  metadata: { verified: true },
                },
              ];
            }

            // Match rooms
            if (
              ["kitchen", "bedroom", "bathroom", "living"].includes(lowerQuery)
            ) {
              return [
                {
                  id: lowerQuery,
                  label: query,
                  type: "room",
                  metadata: { status: "active" },
                },
              ];
            }

            // Match materials
            if (["wood", "concrete", "marble", "steel"].includes(lowerQuery)) {
              return [
                {
                  id: lowerQuery,
                  label: query,
                  type: "material",
                  metadata: { extension: query },
                },
              ];
            }

            return [];
          }}
          onTagsChange={setTags}
          placeholder="Search styles, rooms, or materials…"
          renderTag={(tag, onRemove) => (
            <Badge
              appearance="light"
              shape="circle"
              size="xl"
              variant={
                tag.type === "style"
                  ? "rose"
                  : tag.type === "room"
                    ? "purple"
                    : "info"
              }
            >
              {tag.label}
              <BadgeButton onClick={onRemove} />
            </Badge>
          )}
        />
        <div className="text-muted-foreground text-xs">
          <div>Styles: modern, minimalist, industrial, scandinavian</div>
          <div>Rooms: kitchen, bedroom, bathroom, living</div>
          <div>Materials: wood, concrete, marble, steel</div>
        </div>
        {tags.length > 0 && (
          <div className="space-y-2">
            <div className="font-medium text-sm">Tagged Items:</div>
            {tags.map((tag) => (
              <div className="text-sm" key={tag.id}>
                <span className="font-mono">{tag.label}</span> - Type:{" "}
                {tag.type}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
};

/**
 * Click handlers for different tag types with editor interaction
 */
export const WithClickHandlers: Story = {
  render: () => {
    const [clickLog, setClickLog] = useState<string[]>([]);

    return (
      <div className="space-y-4">
        <TagInput
          onQuery={(query) => {
            const lowerQuery = query.toLowerCase();

            if (["modern", "minimalist", "industrial"].includes(lowerQuery)) {
              return [
                {
                  id: lowerQuery,
                  label: query,
                  type: "style",
                  metadata: { verified: true },
                },
              ];
            }

            if (["kitchen", "bedroom", "bathroom"].includes(lowerQuery)) {
              return [
                {
                  id: lowerQuery,
                  label: query,
                  type: "room",
                  metadata: { assetCount: 150 },
                },
              ];
            }

            return [];
          }}
          onTagClick={{
            style: (tag, _editor) => {
              setClickLog((prev) => [...prev, `View all ${tag.label} designs`]);
              // Could show style gallery
            },
            room: (tag, _editor) => {
              setClickLog((prev) => [
                ...prev,
                `Filter by ${tag.label} (${tag.metadata?.assetCount} images)`,
              ]);
              // Could filter room view
            },
          }}
          placeholder="Type style or room…"
        />
        <div className="text-muted-foreground text-xs">
          <div>Styles: modern, minimalist, industrial</div>
          <div>Rooms: kitchen, bedroom, bathroom</div>
          <div className="mt-1 italic">Click on tags to trigger actions</div>
        </div>
        {clickLog.length > 0 && (
          <div className="space-y-2">
            <div className="font-medium text-sm">Action Log:</div>
            <div className="space-y-1 text-xs">
              {clickLog.slice(-5).map((entry, i) => (
                <div className="text-muted-foreground" key={i}>
                  {entry}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Async query simulating API search for assets
 */
export const AsyncQuery: Story = {
  render: () => {
    const [tags, setTags] = useState<TagData[]>([]);
    const [loading, setLoading] = useState(false);

    return (
      <div className="space-y-4">
        <TagInput
          onQuery={async (query) => {
            setLoading(true);

            // Simulate API call to asset library
            await new Promise((resolve) => setTimeout(resolve, 500));

            const results: TagData[] = [];
            const lowerQuery = query.toLowerCase();

            const spaces = [
              "living-room",
              "dining-room",
              "bedroom",
              "bathroom",
              "kitchen",
            ];
            for (const space of spaces) {
              if (space.includes(lowerQuery)) {
                results.push({
                  id: space,
                  label: space,
                  type: "space",
                  metadata: { available: true },
                });
              }
            }

            setLoading(false);
            return results;
          }}
          onTagsChange={setTags}
          placeholder="Search for spaces…"
        />
        <p className="text-muted-foreground text-xs">
          Available: living-room, dining-room, bedroom, bathroom, kitchen
        </p>
        {loading && (
          <div className="text-muted-foreground text-xs">
            Searching library…
          </div>
        )}
        {tags.length > 0 && (
          <div className="text-muted-foreground text-sm">
            Selected: {tags.map((t) => t.label).join(", ")}
          </div>
        )}
      </div>
    );
  },
};

/**
 * Multiple inputs for organizing digital assets
 */
export const MultipleInputs: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block font-medium text-sm">Design Styles</label>
        <TagInput
          keywords={["modern", "minimalist", "industrial", "scandinavian"]}
          placeholder="Add style…"
        />
        <p className="mt-1 text-muted-foreground text-xs">
          Available: modern, minimalist, industrial, scandinavian
        </p>
      </div>

      <div>
        <label className="mb-2 block font-medium text-sm">Room Types</label>
        <TagInput
          keywords={["kitchen", "bedroom", "bathroom", "living"]}
          placeholder="Specify room…"
          renderTag={(tag, onRemove) => (
            <Badge
              appearance="light"
              shape="circle"
              size="xl"
              variant={
                tag.label === "kitchen"
                  ? "success"
                  : tag.label === "bedroom"
                    ? "warning"
                    : "info"
              }
            >
              {tag.label}
              <BadgeButton onClick={onRemove} />
            </Badge>
          )}
        />
        <p className="mt-1 text-muted-foreground text-xs">
          Available: kitchen, bedroom, bathroom, living
        </p>
      </div>

      <div>
        <label className="mb-2 block font-medium text-sm">Materials</label>
        <TagInput
          onQuery={(query) => {
            const materials = ["wood", "concrete", "marble", "steel", "glass"];
            if (materials.includes(query.toLowerCase())) {
              return [
                {
                  id: query.toLowerCase(),
                  label: query,
                  type: "material",
                  metadata: { type: query.toLowerCase() },
                },
              ];
            }
            return [];
          }}
          placeholder="Add material…"
        />
        <p className="mt-1 text-muted-foreground text-xs">
          Available: wood, concrete, marble, steel, glass
        </p>
      </div>
    </div>
  ),
};

/**
 * Comprehensive asset tagging system
 */
export const AllFeatures: Story = {
  render: () => {
    const [tags, setTags] = useState<TagData[]>([]);
    const [events, setEvents] = useState<string[]>([]);

    return (
      <div className="space-y-6">
        <div>
          <label className="mb-2 block font-medium text-sm">
            Asset Tagging System
          </label>
          <TagInput
            onQuery={async (query) => {
              await new Promise((resolve) => setTimeout(resolve, 200));

              const lowerQuery = query.toLowerCase();
              const results: TagData[] = [];

              // Styles
              const styles = [
                "modern",
                "minimalist",
                "industrial",
                "scandinavian",
                "contemporary",
              ];
              for (const style of styles) {
                if (style.includes(lowerQuery)) {
                  results.push({
                    id: style,
                    label: style,
                    type: "style",
                    metadata: { verified: true, imageCount: 234 },
                  });
                }
              }

              // Rooms
              const rooms = ["kitchen", "bedroom", "bathroom", "living-room"];
              for (const room of rooms) {
                if (room.includes(lowerQuery)) {
                  results.push({
                    id: room,
                    label: room,
                    type: "room",
                    metadata: { status: "active" },
                  });
                }
              }

              // Materials
              const materials = ["wood", "concrete", "marble", "steel"];
              for (const material of materials) {
                if (material.includes(lowerQuery)) {
                  results.push({
                    id: material,
                    label: material,
                    type: "material",
                    metadata: { imageCount: 567 },
                  });
                }
              }

              return results;
            }}
            onTagClick={{
              style: (tag, _editor) => {
                setEvents((prev) => [
                  ...prev,
                  `View ${tag.label} style gallery (${tag.metadata?.imageCount} images)`,
                ]);
              },
              room: (tag, _editor) => {
                setEvents((prev) => [
                  ...prev,
                  `Open ${tag.label} designs (${tag.metadata?.status})`,
                ]);
              },
              material: (tag, _editor) => {
                setEvents((prev) => [
                  ...prev,
                  `Filter by ${tag.label} (${tag.metadata?.imageCount} images)`,
                ]);
              },
            }}
            onTagsChange={setTags}
            placeholder="Search styles, rooms, or materials…"
            renderTag={(tag, onRemove) => (
              <Badge
                appearance="light"
                shape="circle"
                size="xl"
                variant={
                  tag.type === "style"
                    ? "rose"
                    : tag.type === "room"
                      ? "purple"
                      : tag.type === "material"
                        ? "info"
                        : "secondary"
                }
              >
                {tag.label}
                <BadgeButton onClick={onRemove} />
              </Badge>
            )}
          />
          <div className="mt-2 text-muted-foreground text-xs">
            <div>
              Styles: modern, minimalist, industrial, scandinavian, contemporary
            </div>
            <div>Rooms: kitchen, bedroom, bathroom, living-room</div>
            <div>Materials: wood, concrete, marble, steel</div>
          </div>
        </div>

        {tags.length > 0 && (
          <div className="space-y-2">
            <div className="font-medium text-sm">Applied Tags:</div>
            <div className="space-y-1">
              {tags.map((tag) => (
                <div className="text-sm" key={tag.id}>
                  <span className="font-mono">{tag.label}</span>
                  <span className="text-muted-foreground">
                    {" "}
                    - {tag.type} - ID: {tag.id}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {events.length > 0 && (
          <div className="space-y-2">
            <div className="font-medium text-sm">Actions:</div>
            <div className="space-y-1">
              {events.slice(-5).map((event, i) => (
                <div className="text-muted-foreground text-xs" key={i}>
                  {event}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  },
};
