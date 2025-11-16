export const AVATAR_IMAGE_OPTIONS = {
  None: "",
  "Alex (1)": "https://i.pravatar.cc/128?img=1",
  "Jamie (2)": "https://i.pravatar.cc/128?img=2",
  "Taylor (3)": "https://i.pravatar.cc/128?img=3",
  "Riley (4)": "https://i.pravatar.cc/128?img=4",
  "Jordan (5)": "https://i.pravatar.cc/128?img=5",
  "Morgan (6)": "https://i.pravatar.cc/128?img=6",
  "Casey (7)": "https://i.pravatar.cc/128?img=7",
  "Avery (8)": "https://i.pravatar.cc/128?img=8",
  "Quinn (9)": "https://i.pravatar.cc/128?img=9",
  "Drew (10)": "https://i.pravatar.cc/128?img=10",
} as const;

export const avatarImageControlArgType = {
  control: "select",
  options: Object.keys(AVATAR_IMAGE_OPTIONS),
  mapping: AVATAR_IMAGE_OPTIONS,
  description: "Avatar image source URL (None = no image)",
  table: {
    category: "Avatar",
  },
} as Record<string, unknown>;
