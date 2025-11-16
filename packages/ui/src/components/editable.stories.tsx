import type { Meta, StoryObj } from "@storybook/react-vite";
import "@materia/tailwind-config/shared-styles.css";
import {
	Editable,
	EditableArea,
	EditableCancel,
	EditableInput,
	EditableLabel,
	EditablePreview,
	EditableSubmit,
	EditableToolbar,
	EditableTrigger,
} from "./editable";
import { Button } from "./button";

const meta = {
  title: "Editable",
	component: Editable,
	tags: ["autodocs"],
	argTypes: {
		defaultValue: {
			control: "text",
			description: "Initial value of the editable field",
		},
		placeholder: {
			control: "text",
			description: "Placeholder text when empty",
		},
		disabled: {
			control: "boolean",
			description: "Disable the editable field",
		},
		readOnly: {
			control: "boolean",
			description: "Make the field read-only",
		},
		required: {
			control: "boolean",
			description: "Mark the field as required",
		},
		invalid: {
			control: "boolean",
			description: "Mark the field as invalid",
		},
		triggerMode: {
			control: "select",
			options: ["click", "dblclick", "none"],
			description: "How to trigger edit mode",
		},
	},
	args: {
		defaultValue: "Click to edit",
		placeholder: "Enter your text here",
		triggerMode: "click",
	},
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"Inline editing component with various trigger modes and validation states.",
			},
		},
	},
} satisfies Meta<typeof Editable>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive story - controls affect this component
export const Base: Story = {
	render: (args) => (
		<div className="w-96">
			<Editable {...args}>
				<EditableLabel>Fruit</EditableLabel>
				<EditableArea>
					<EditablePreview />
					<EditableInput />
				</EditableArea>
				<EditableTrigger asChild>
					<Button size="sm" className="w-fit">
						Edit
					</Button>
				</EditableTrigger>
				<EditableToolbar>
					<EditableSubmit asChild>
						<Button size="sm">Save</Button>
					</EditableSubmit>
					<EditableCancel asChild>
						<Button variant="outline" size="sm">
							Cancel
						</Button>
					</EditableCancel>
				</EditableToolbar>
			</Editable>
		</div>
	),
};

// Docs-only stories showing comprehensive examples
export const TriggerModes: Story = {
	parameters: {
		controls: { disable: true },
		docs: {
			description: {
				story: "Different trigger modes: button trigger, double-click trigger, and no explicit trigger (always editable).",
			},
		},
	},
	render: () => (
		<div className="w-96 space-y-4">
			<Editable defaultValue="Click Edit button to edit" placeholder="Enter your text here">
				<EditableLabel>Button Trigger</EditableLabel>
				<EditableArea>
					<EditablePreview />
					<EditableInput />
				</EditableArea>
				<EditableTrigger asChild>
					<Button size="sm" className="w-fit">
						Edit
					</Button>
				</EditableTrigger>
				<EditableToolbar>
					<EditableSubmit asChild>
						<Button size="sm">Save</Button>
					</EditableSubmit>
					<EditableCancel asChild>
						<Button variant="outline" size="sm">
							Cancel
						</Button>
					</EditableCancel>
				</EditableToolbar>
			</Editable>

			<Editable
				defaultValue="Double click to edit"
				triggerMode="dblclick"
				placeholder="Enter your text here"
			>
				<EditableLabel>Double Click Trigger</EditableLabel>
				<EditableArea>
					<EditablePreview />
					<EditableInput />
				</EditableArea>
				<EditableToolbar>
					<EditableSubmit asChild>
						<Button size="sm">Save</Button>
					</EditableSubmit>
					<EditableCancel asChild>
						<Button variant="outline" size="sm">
							Cancel
						</Button>
					</EditableCancel>
				</EditableToolbar>
			</Editable>
		</div>
	),
};

export const ValidationStates: Story = {
	parameters: {
		controls: { disable: true },
		docs: {
			description: {
				story: "Editable supports various validation states: disabled, read-only, required, and invalid.",
			},
		},
	},
	render: () => (
		<div className="w-96 space-y-4">
			<Editable
				defaultValue="This field is disabled"
				disabled
				placeholder="Enter your text here"
			>
				<EditableLabel>Disabled</EditableLabel>
				<EditableArea>
					<EditablePreview />
					<EditableInput />
				</EditableArea>
				<EditableTrigger asChild>
					<Button size="sm" className="w-fit">
						Edit
					</Button>
				</EditableTrigger>
				<EditableToolbar>
					<EditableSubmit asChild>
						<Button size="sm">Save</Button>
					</EditableSubmit>
					<EditableCancel asChild>
						<Button variant="outline" size="sm">
							Cancel
						</Button>
					</EditableCancel>
				</EditableToolbar>
			</Editable>

			<Editable
				defaultValue="This field is read-only"
				readOnly
				placeholder="Enter your text here"
			>
				<EditableLabel>Read Only</EditableLabel>
				<EditableArea>
					<EditablePreview />
					<EditableInput />
				</EditableArea>
				<EditableTrigger asChild>
					<Button size="sm" className="w-fit">
						Edit
					</Button>
				</EditableTrigger>
				<EditableToolbar>
					<EditableSubmit asChild>
						<Button size="sm">Save</Button>
					</EditableSubmit>
					<EditableCancel asChild>
						<Button variant="outline" size="sm">
							Cancel
						</Button>
					</EditableCancel>
				</EditableToolbar>
			</Editable>

			<Editable
				defaultValue=""
				required
				placeholder="This field is required…"
			>
				<EditableLabel>
					Required <span className="text-destructive">*</span>
				</EditableLabel>
				<EditableArea>
					<EditablePreview />
					<EditableInput />
				</EditableArea>
				<EditableTrigger asChild>
					<Button size="sm" className="w-fit">
						Edit
					</Button>
				</EditableTrigger>
				<EditableToolbar>
					<EditableSubmit asChild>
						<Button size="sm">Save</Button>
					</EditableSubmit>
					<EditableCancel asChild>
						<Button variant="outline" size="sm">
							Cancel
						</Button>
					</EditableCancel>
				</EditableToolbar>
			</Editable>

			<Editable
				defaultValue="invalid@"
				invalid
				placeholder="Enter valid email"
			>
				<EditableLabel className="text-destructive">Invalid</EditableLabel>
				<EditableArea>
					<EditablePreview className="border-destructive" />
					<EditableInput className="border-destructive" />
				</EditableArea>
				<EditableTrigger asChild>
					<Button size="sm" className="w-fit">
						Edit
					</Button>
				</EditableTrigger>
				<EditableToolbar>
					<EditableSubmit asChild>
						<Button size="sm">Save</Button>
					</EditableSubmit>
					<EditableCancel asChild>
						<Button variant="outline" size="sm">
							Cancel
						</Button>
					</EditableCancel>
				</EditableToolbar>
			</Editable>
		</div>
	),
};

export const PlaceholderAndEmpty: Story = {
	parameters: {
		controls: { disable: true },
		docs: {
			description: {
				story: "Editable fields can show a placeholder when empty, useful for prompting user input.",
			},
		},
	},
	render: () => (
		<div className="w-96">
			<Editable defaultValue="" placeholder="Click to add text…">
				<EditableLabel>Description</EditableLabel>
				<EditableArea>
					<EditablePreview />
					<EditableInput />
				</EditableArea>
				<EditableTrigger asChild>
					<Button size="sm" className="w-fit">
						Add
					</Button>
				</EditableTrigger>
				<EditableToolbar>
					<EditableSubmit asChild>
						<Button size="sm">Save</Button>
					</EditableSubmit>
					<EditableCancel asChild>
						<Button variant="outline" size="sm">
							Cancel
						</Button>
					</EditableCancel>
				</EditableToolbar>
			</Editable>
		</div>
	),
};

export const InlineEditing: Story = {
	parameters: {
		controls: { disable: true },
		docs: {
			description: {
				story: "Example of using multiple editable fields together in a form-like layout.",
			},
		},
	},
	render: () => (
		<div className="w-96 space-y-4">
			<div className="rounded-md border p-4">
				<Editable
					defaultValue="Rodney Mullen"
					placeholder="Enter name…"
					className="mb-2"
				>
					<EditableLabel className="font-medium text-sm">Name</EditableLabel>
					<div className="flex items-start gap-2">
						<EditableArea className="flex-1">
							<EditablePreview />
							<EditableInput />
						</EditableArea>
						<EditableTrigger asChild>
							<Button size="sm" variant="ghost">
								Edit
							</Button>
						</EditableTrigger>
					</div>
					<EditableToolbar className="mt-2">
						<EditableSubmit asChild>
							<Button size="sm">Save</Button>
						</EditableSubmit>
						<EditableCancel asChild>
							<Button variant="outline" size="sm">
								Cancel
							</Button>
						</EditableCancel>
					</EditableToolbar>
				</Editable>

				<Editable
					defaultValue="Professional Skateboarder"
					placeholder="Enter title…"
				>
					<EditableLabel className="font-medium text-sm">Title</EditableLabel>
					<div className="flex items-start gap-2">
						<EditableArea className="flex-1">
							<EditablePreview />
							<EditableInput />
						</EditableArea>
						<EditableTrigger asChild>
							<Button size="sm" variant="ghost">
								Edit
							</Button>
						</EditableTrigger>
					</div>
					<EditableToolbar className="mt-2">
						<EditableSubmit asChild>
							<Button size="sm">Save</Button>
						</EditableSubmit>
						<EditableCancel asChild>
							<Button variant="outline" size="sm">
								Cancel
							</Button>
						</EditableCancel>
					</EditableToolbar>
				</Editable>
			</div>
		</div>
	),
};
