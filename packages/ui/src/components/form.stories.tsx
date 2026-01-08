import type { Meta, StoryObj } from "@storybook/react";
import "@materia/tailwind-config/shared-styles.css";
import { useForm } from "react-hook-form";
import { Button } from "./button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Input } from "./input";

const meta = {
  title: "Form",
  component: FormItem,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Form components built with react-hook-form provide accessible, validated form fields. Each form field includes a label, control, optional description, and error message display.",
      },
    },
  },
} satisfies Meta<typeof FormItem>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive story - simple form with validation
export const Base: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A basic form with a single input field, description, and validation. Try submitting without an @ symbol to see error handling.",
      },
    },
  },
  render: () => {
    type Values = { email: string };
    const form = useForm<Values>({ defaultValues: { email: "" } });
    const onSubmit = form.handleSubmit((values) => {
      if (!values.email.includes("@")) {
        form.setError("email", { message: "Enter a valid email" });
      }
    });
    return (
      <Form {...form}>
        <form className="flex max-w-sm flex-col gap-4" onSubmit={onSubmit}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" {...field} />
                </FormControl>
                <FormDescription>We'll never share it.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    );
  },
};

// Interactive story - multi-field form
export const MultiField: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Forms can contain multiple fields with different validation rules and descriptions.",
      },
    },
  },
  render: () => {
    type Values = { name: string; email: string };
    const form = useForm<Values>({ defaultValues: { name: "", email: "" } });
    const onSubmit = form.handleSubmit((values) => {
      if (!values.name) {
        form.setError("name", { message: "Name is required" });
      }
      if (!values.email.includes("@")) {
        form.setError("email", { message: "Enter a valid email" });
      }
    });
    return (
      <Form {...form}>
        <form className="flex max-w-sm flex-col gap-4" onSubmit={onSubmit}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormDescription>Your full name.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="you@example.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormDescription>We'll never share it.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    );
  },
};

// Documentation story - form states
export const FormStates: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Form fields can display different states: default, with description, with error message, and disabled.",
      },
    },
  },
  render: () => {
    type Values = {
      default: string;
      withDescription: string;
      withError: string;
      disabled: string;
    };
    const form = useForm<Values>({
      defaultValues: {
        default: "",
        withDescription: "",
        withError: "invalid",
        disabled: "Cannot edit",
      },
    });

    // Manually set an error for demonstration
    form.setError("withError", {
      message: "This field has an error",
    });

    return (
      <Form {...form}>
        <form className="flex max-w-sm flex-col gap-6">
          <FormField
            control={form.control}
            name="default"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Default field</FormLabel>
                <FormControl>
                  <Input placeholder="Enter text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="withDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Field with description</FormLabel>
                <FormControl>
                  <Input placeholder="Enter text" {...field} />
                </FormControl>
                <FormDescription>
                  This is a helpful description for the field.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="withError"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Field with error</FormLabel>
                <FormControl>
                  <Input placeholder="Enter text" {...field} />
                </FormControl>
                <FormDescription>Try to fix the error.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="disabled"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Disabled field</FormLabel>
                <FormControl>
                  <Input disabled {...field} />
                </FormControl>
                <FormDescription>This field cannot be edited.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    );
  },
};

// Documentation story - form layouts
export const FormLayouts: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Forms can be arranged in different layouts depending on the content: vertical (default), horizontal, or grid-based for multiple columns.",
      },
    },
  },
  render: () => {
    type Values = { firstName: string; lastName: string; email: string };
    const form = useForm<Values>({
      defaultValues: { firstName: "", lastName: "", email: "" },
    });

    return (
      <div className="flex flex-col gap-8">
        <div>
          <h3 className="mb-4 font-medium text-sm">
            Vertical layout (default)
          </h3>
          <Form {...form}>
            <form className="flex max-w-sm flex-col gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <div>
          <h3 className="mb-4 font-medium text-sm">
            Grid layout (two columns)
          </h3>
          <Form {...form}>
            <form className="grid max-w-2xl grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </div>
    );
  },
};
