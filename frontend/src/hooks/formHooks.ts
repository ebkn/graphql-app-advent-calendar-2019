import { useCallback, useState, ChangeEvent } from "react";
import { isValid } from "date-fns";
import { Task } from "../generated/graphql";

// export function useModal(initialValue: boolean) {
//   const [open, setOpen] = useState(initialValue);
//   const handleOpen = useCallback(() => {
//     setOpen(true);
//   }, []);

//   const handleClose = useCallback(() => {
//     setOpen(false);
//   }, []);

//   return { open, handleOpen, handleClose };
// }

function useTextInput(initialValue: string | undefined) {
  const [value, setValue] = useState(initialValue ?? "");

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  }, []);
  return { inputProps: { value, onChange: handleChange }, setValue };
}

function useCheckbox(initialValue: boolean | undefined) {
  const [value, setValue] = useState(!!initialValue);

  const handleChange = useCallback(() => {
    setValue(prev => !prev);
  }, []);
  return { inputProps: { checked: value, onChange: handleChange }, setValue };
}

function useDateTimePicker(initialValue: Date | undefined | null) {
  const [value, setValue] = useState<Date | undefined | null>(initialValue);

  const handleChange = useCallback((event: Date | null) => {
    setValue(event);
  }, []);

  return { inputProps: { selected: value, onChange: handleChange }, setValue };
}

export function useTaskFields(initialTask?: Task) {
  const { inputProps: titleProps, setValue: setTitle } = useTextInput(
    initialTask?.title
  );
  const { inputProps: notesProps, setValue: setNotes } = useTextInput(
    initialTask?.notes
  );
  const { inputProps: completedProps, setValue: setCompleted } = useCheckbox(
    initialTask?.completed
  );
  const { inputProps: dueProps, setValue: setDue } = useDateTimePicker(
    initialTask?.due && isValid(new Date(initialTask?.due))
      ? new Date(initialTask?.due)
      : null
  );

  const clearValue = useCallback(() => {
    setTitle("");
    setNotes("");
    setCompleted(false);
    setDue(null);
  }, [setCompleted, setDue, setNotes, setTitle]);

  return {
    titleProps,
    notesProps,
    completedProps,
    dueProps,
    clearValue
  };
}
