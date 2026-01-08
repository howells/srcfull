"use client";

import { Slot } from "@radix-ui/react-slot";
import { cn } from "@repo/ui/utils/cn";
import React, {
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { useComposedRefs } from "../lib/compose-refs";
import { VisuallyHiddenInput } from "./visually-hidden-input";

const ROOT_NAME = "Editable";
const LABEL_NAME = "EditableLabel";
const AREA_NAME = "EditableArea";
const PREVIEW_NAME = "EditablePreview";
const INPUT_NAME = "EditableInput";
const TRIGGER_NAME = "EditableTrigger";
const TOOLBAR_NAME = "EditableToolbar";
const SUBMIT_NAME = "EditableSubmit";
const CANCEL_NAME = "EditableCancel";

type TriggerMode = "focus" | "dblclick" | "click";

type EditableContextValue = {
  id?: string;
  value: string;
  editing: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  invalid?: boolean;
  placeholder?: string;
  autosize?: boolean;
  triggerMode: TriggerMode;
  onEdit: () => void;
  onCancel: () => void;
  onSubmit: (value: string) => void;
  onValueChange: (value: string) => void;
  inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement>;
  previewRef: React.RefObject<HTMLElement>;
};

const EditableContext = React.createContext<EditableContextValue | null>(null);

function useEditableContext(componentName: string) {
  const context = useContext(EditableContext);
  if (!context) {
    throw new Error(`${componentName} must be used within ${ROOT_NAME}`);
  }
  return context;
}

type EditableProps = {
  children?: React.ReactNode;
  id?: string;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  defaultEditing?: boolean;
  editing?: boolean;
  onEnterKeyDown?: (event: React.KeyboardEvent) => void;
  onEscapeKeyDown?: (event: React.KeyboardEvent) => void;
  onCancel?: () => void;
  onEdit?: () => void;
  onSubmit?: (value: string) => void;
  name?: string;
  placeholder?: string;
  triggerMode?: TriggerMode;
  autosize?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  invalid?: boolean;
  asChild?: boolean;
};

const Editable = ({
  ref: forwardedRef,
  ...props
}: EditableProps & { ref?: React.RefObject<HTMLDivElement | null> }) => {
  const {
    children,
    id: idProp,
    defaultValue = "",
    value: valueProp,
    onValueChange,
    defaultEditing = false,
    editing: editingProp,
    onEnterKeyDown,
    onEscapeKeyDown,
    onCancel: onCancelProp,
    onEdit: onEditProp,
    onSubmit: onSubmitProp,
    name,
    placeholder,
    triggerMode = "focus",
    autosize = false,
    disabled = false,
    readOnly = false,
    required = false,
    invalid = false,
    asChild = false,
    ...rootProps
  } = props;

  const RootPrimitive = asChild ? Slot : "div";

  const generatedId = useId();
  const id = idProp ?? generatedId;

  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const [uncontrolledEditing, setUncontrolledEditing] =
    useState(defaultEditing);

  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : uncontrolledValue;

  const isEditingControlled = editingProp !== undefined;
  const editing = isEditingControlled ? editingProp : uncontrolledEditing;

  const [previousValue, setPreviousValue] = useState(value);

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLElement>(null);
  const controlRef = useRef<HTMLDivElement>(null);
  const composedRefs = useComposedRefs(forwardedRef, controlRef);

  const handleValueChange = useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setUncontrolledValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [isControlled, onValueChange]
  );

  const handleEdit = useCallback(() => {
    if (disabled || readOnly) {
      return;
    }

    setPreviousValue(value);

    if (!isEditingControlled) {
      setUncontrolledEditing(true);
    }

    onEditProp?.();

    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  }, [disabled, readOnly, value, isEditingControlled, onEditProp]);

  const handleCancel = useCallback(() => {
    handleValueChange(previousValue);

    if (!isEditingControlled) {
      setUncontrolledEditing(false);
    }

    onCancelProp?.();

    setTimeout(() => {
      previewRef.current?.focus();
    }, 0);
  }, [handleValueChange, previousValue, isEditingControlled, onCancelProp]);

  const handleSubmit = useCallback(
    (submitValue: string) => {
      if (!isEditingControlled) {
        setUncontrolledEditing(false);
      }

      onSubmitProp?.(submitValue);

      setTimeout(() => {
        previewRef.current?.focus();
      }, 0);
    },
    [isEditingControlled, onSubmitProp]
  );

  useEffect(() => {
    if (!editing && inputRef.current) {
      const form = inputRef.current.form;
      if (form) {
        const formData = new FormData(form);
        const fieldValue = formData.get(name ?? "");
        if (fieldValue !== value) {
          handleValueChange(value);
        }
      }
    }
  }, [editing, name, value, handleValueChange]);

  const contextValue = useMemo<EditableContextValue>(
    () => ({
      id,
      value,
      editing,
      disabled,
      readOnly,
      required,
      invalid,
      placeholder,
      autosize,
      triggerMode,
      onEdit: handleEdit,
      onCancel: handleCancel,
      onSubmit: handleSubmit,
      onValueChange: handleValueChange,
      inputRef,
      previewRef,
    }),
    [
      id,
      value,
      editing,
      disabled,
      readOnly,
      required,
      invalid,
      placeholder,
      autosize,
      triggerMode,
      handleEdit,
      handleCancel,
      handleSubmit,
      handleValueChange,
    ]
  );

  useEffect(() => {
    if (!(editing && inputRef.current)) {
      return;
    }

    const input = inputRef.current;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSubmit(input.value);
        onEnterKeyDown?.(event as unknown as React.KeyboardEvent);
      } else if (event.key === "Escape") {
        event.preventDefault();
        handleCancel();
        onEscapeKeyDown?.(event as unknown as React.KeyboardEvent);
      }
    };

    input.addEventListener("keydown", handleKeyDown);

    return () => {
      input.removeEventListener("keydown", handleKeyDown);
    };
  }, [editing, handleSubmit, handleCancel, onEnterKeyDown, onEscapeKeyDown]);

  return (
    <EditableContext.Provider value={contextValue}>
      <RootPrimitive
        {...rootProps}
        data-component="editable"
        data-disabled={disabled ? "" : undefined}
        data-editing={editing ? "" : undefined}
        data-invalid={invalid ? "" : undefined}
        data-readonly={readOnly ? "" : undefined}
        data-required={required ? "" : undefined}
        ref={composedRefs}
      >
        {children}
        {name && (
          <VisuallyHiddenInput
            control={controlRef.current}
            disabled={disabled}
            name={name}
            required={required}
            value={value}
          />
        )}
      </RootPrimitive>
    </EditableContext.Provider>
  );
};

Editable.displayName = ROOT_NAME;

type EditableLabelProps = {
  children?: React.ReactNode;
  asChild?: boolean;
};

const EditableLabel = ({
  ref: forwardedRef,
  ...props
}: EditableLabelProps & { ref?: React.RefObject<HTMLLabelElement | null> }) => {
  const { children, asChild = false, ...labelProps } = props;

  const LabelPrimitive = asChild ? Slot : "label";
  const context = useEditableContext(LABEL_NAME);

  return (
    <LabelPrimitive
      {...labelProps}
      data-disabled={context.disabled ? "" : undefined}
      data-invalid={context.invalid ? "" : undefined}
      data-required={context.required ? "" : undefined}
      htmlFor={context.id}
      ref={forwardedRef}
    >
      {children}
    </LabelPrimitive>
  );
};

EditableLabel.displayName = LABEL_NAME;

type EditableAreaProps = {
  children?: React.ReactNode;
  className?: string;
  asChild?: boolean;
};

const EditableArea = ({
  ref: forwardedRef,
  ...props
}: EditableAreaProps & { ref?: React.RefObject<HTMLDivElement | null> }) => {
  const { children, className, asChild = false, ...areaProps } = props;

  const AreaPrimitive = asChild ? Slot : "div";
  const context = useEditableContext(AREA_NAME);

  return (
    <AreaPrimitive
      {...areaProps}
      className={cn("relative", className)}
      data-disabled={context.disabled ? "" : undefined}
      data-editing={context.editing ? "" : undefined}
      ref={forwardedRef}
    >
      {children}
    </AreaPrimitive>
  );
};

EditableArea.displayName = AREA_NAME;

type EditablePreviewProps = {
  children?: React.ReactNode;
  className?: string;
  asChild?: boolean;
};

const EditablePreview = ({
  ref: forwardedRef,
  ...props
}: EditablePreviewProps & {
  ref?: React.RefObject<HTMLSpanElement | null>;
}) => {
  const { children, className, asChild = false, ...previewProps } = props;

  const PreviewPrimitive = asChild ? Slot : "span";
  const context = useEditableContext(PREVIEW_NAME);

  const composedRefs = useComposedRefs(forwardedRef, context.previewRef);

  const isEmpty = !context.value || context.value.length === 0;

  if (context.editing) {
    return null;
  }

  const triggerHandlers =
    context.triggerMode === "dblclick"
      ? { onDoubleClick: context.onEdit }
      : context.triggerMode === "focus"
        ? { onFocus: context.onEdit }
        : { onClick: context.onEdit };

  return (
    <PreviewPrimitive
      {...previewProps}
      className={cn(
        "block w-full cursor-text rounded-md border border-transparent px-3 py-2 text-sm transition-colors",
        "hover:border-border focus-visible:border-ring focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        isEmpty && "text-muted-foreground",
        context.disabled && "cursor-not-allowed opacity-50",
        className
      )}
      data-disabled={context.disabled ? "" : undefined}
      data-empty={isEmpty ? "" : undefined}
      data-readonly={context.readOnly ? "" : undefined}
      {...triggerHandlers}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          context.onEdit();
        }
      }}
      ref={composedRefs}
      tabIndex={context.disabled || context.readOnly ? -1 : 0}
    >
      {children ?? (isEmpty ? context.placeholder : context.value)}
    </PreviewPrimitive>
  );
};

EditablePreview.displayName = PREVIEW_NAME;

interface EditableInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value"> {
  asChild?: boolean;
}

const EditableInput = ({
  ref: forwardedRef,
  ...props
}: EditableInputProps & { ref?: React.RefObject<HTMLInputElement | null> }) => {
  const { className, asChild = false, ...inputProps } = props;

  const InputPrimitive = asChild ? Slot : "input";
  const context = useEditableContext(INPUT_NAME);

  const composedRefs = useComposedRefs(
    forwardedRef,
    context.inputRef as React.RefObject<HTMLInputElement>
  );

  const [localValue, setLocalValue] = useState(context.value);

  useEffect(() => {
    setLocalValue(context.value);
  }, [context.value]);

  if (!context.editing) {
    return null;
  }

  return (
    <InputPrimitive
      {...inputProps}
      aria-invalid={context.invalid}
      className={cn(
        "flex h-9 w-full rounded-md border border-border bg-transparent px-3 py-1 text-sm transition-colors",
        "file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm",
        "placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      disabled={context.disabled}
      id={context.id}
      onChange={(e) => {
        setLocalValue(e.target.value);
        context.onValueChange(e.target.value);
      }}
      placeholder={context.placeholder}
      readOnly={context.readOnly}
      ref={composedRefs}
      required={context.required}
      value={localValue}
    />
  );
};

EditableInput.displayName = INPUT_NAME;

type EditableTriggerProps = {
  children?: React.ReactNode;
  forceMount?: boolean;
  asChild?: boolean;
};

const EditableTrigger = ({
  ref: forwardedRef,
  ...props
}: EditableTriggerProps & {
  ref?: React.RefObject<HTMLButtonElement | null>;
}) => {
  const {
    children,
    forceMount = false,
    asChild = false,
    ...triggerProps
  } = props;

  const TriggerPrimitive = asChild ? Slot : "button";
  const context = useEditableContext(TRIGGER_NAME);

  if (!forceMount && context.editing) {
    return null;
  }

  return (
    <TriggerPrimitive
      {...triggerProps}
      data-disabled={context.disabled ? "" : undefined}
      data-readonly={context.readOnly ? "" : undefined}
      disabled={context.disabled || context.readOnly}
      onClick={context.onEdit}
      ref={forwardedRef}
      type="button"
    >
      {children}
    </TriggerPrimitive>
  );
};

EditableTrigger.displayName = TRIGGER_NAME;

type EditableToolbarProps = {
  children?: React.ReactNode;
  className?: string;
  orientation?: "horizontal" | "vertical";
  asChild?: boolean;
};

const EditableToolbar = ({
  ref: forwardedRef,
  ...props
}: EditableToolbarProps & { ref?: React.RefObject<HTMLDivElement | null> }) => {
  const {
    children,
    className,
    orientation = "horizontal",
    asChild = false,
    ...toolbarProps
  } = props;

  const ToolbarPrimitive = asChild ? Slot : "div";
  const context = useEditableContext(TOOLBAR_NAME);

  if (!context.editing) {
    return null;
  }

  return (
    <ToolbarPrimitive
      {...toolbarProps}
      aria-orientation={orientation}
      className={cn(
        "flex gap-2",
        orientation === "vertical" && "flex-col",
        className
      )}
      ref={forwardedRef}
      role="toolbar"
    >
      {children}
    </ToolbarPrimitive>
  );
};

EditableToolbar.displayName = TOOLBAR_NAME;

type EditableSubmitProps = {
  children?: React.ReactNode;
  asChild?: boolean;
};

const EditableSubmit = ({
  ref: forwardedRef,
  ...props
}: EditableSubmitProps & {
  ref?: React.RefObject<HTMLButtonElement | null>;
}) => {
  const { children, asChild = false, ...submitProps } = props;

  const SubmitPrimitive = asChild ? Slot : "button";
  const context = useEditableContext(SUBMIT_NAME);

  return (
    <SubmitPrimitive
      {...submitProps}
      onClick={() => context.onSubmit(context.value)}
      ref={forwardedRef}
      type="button"
    >
      {children}
    </SubmitPrimitive>
  );
};

EditableSubmit.displayName = SUBMIT_NAME;

type EditableCancelProps = {
  children?: React.ReactNode;
  asChild?: boolean;
};

const EditableCancel = ({
  ref: forwardedRef,
  ...props
}: EditableCancelProps & {
  ref?: React.RefObject<HTMLButtonElement | null>;
}) => {
  const { children, asChild = false, ...cancelProps } = props;

  const CancelPrimitive = asChild ? Slot : "button";
  const context = useEditableContext(CANCEL_NAME);

  return (
    <CancelPrimitive
      {...cancelProps}
      onClick={context.onCancel}
      ref={forwardedRef}
      type="button"
    >
      {children}
    </CancelPrimitive>
  );
};

EditableCancel.displayName = CANCEL_NAME;

export {
  Editable,
  EditableArea,
  EditableCancel,
  EditableInput,
  EditableLabel,
  EditablePreview,
  EditableSubmit,
  EditableToolbar,
  EditableTrigger,
};
