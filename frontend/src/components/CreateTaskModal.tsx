import React, { useCallback, useState } from "react";

import {
  Form,
  Modal,
  Button,
  Icon,
  Message,
  Checkbox
} from "semantic-ui-react";

import { useCreateTaskMutation } from "../generated/graphql";

import { useTaskFields } from "../hooks/formHooks";
import sleep from "../lib/sleep";
import styles from "../styles/main.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);

interface Props {
  refetch: () => void;
}

const CreateTaskModal = ({ refetch }: Props) => {
  const {
    titleProps,
    notesProps,
    completedProps,
    dueProps,
    clearValue
  } = useTaskFields();

  const [success, setSuccess] = useState(false);
  const [open, setOpen] = useState(false);

  const handleMutationCompleted = useCallback(async () => {
    setSuccess(true);
    refetch();
    await sleep(1500);
    clearValue();
    setOpen(false);
    setSuccess(false);
  }, [clearValue, refetch]);

  const [createTask, { loading, error }] = useCreateTaskMutation({
    variables: {
      title: titleProps.value,
      notes: notesProps.value,
      completed: completedProps.checked,
      due: dueProps.selected?.toISOString()
    },
    // refetchQueries: () => [{ query: "tasks" }],
    // update: (cache, { data }) => {
    //   if (!data) return;

    //   const createdTask = data.createTask;
    //   const tasksQuery = cache.readQuery<
    //     FetchTasksQuery,
    //     FetchTasksQueryVariables
    //   >({
    //     query: FetchTasksDocument,
    //     variables: { ...fetchTaskParam }
    //   });

    //   if (!tasksQuery) return;

    //   cache.writeQuery<FetchTasksQuery, FetchTasksQueryVariables>({
    //     query: FetchTasksDocument,
    //     variables: { ...fetchTaskParam },
    //     data: {
    //       ...tasksQuery,
    //       tasks: {
    //         ...tasksQuery.tasks,
    //         edges: [
    //           ...tasksQuery.tasks.edges,
    //           {
    //             node: createTask
    //           }
    //         ]
    //       }
    //     }
    //   });
    // },
    onCompleted: handleMutationCompleted
  });

  const handleButtonClick = useCallback(() => {
    createTask();
  }, [createTask]);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);
  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <Modal
      open={open}
      closeIcon={true}
      onClose={handleClose}
      onOpen={handleOpen}
      trigger={
        <div className={styles.add_button}>
          <Button
            icon={true}
            size="tiny"
            basic={true}
            circular={true}
            positive={true}
          >
            <Icon name="plus" />
          </Button>
        </div>
      }
    >
      <Modal.Header>タスクを追加</Modal.Header>
      <Modal.Content>
        <Form loading={loading} success={success} error={!!error}>
          <Message error={true}>追加中にエラーが発生しました</Message>
          <Message success={true}>タスクを追加しました</Message>
          <Form.Field required={true}>
            <label>タスク名</label>
            <Form.Input
              placeholder="ピーマンを買いに行く"
              type="text"
              required={true}
              {...titleProps}
            />
          </Form.Field>
          <Form.Field>
            <label>メモ</label>
            <Form.Input
              placeholder="駅前のOKストアがマジで安い"
              type="text"
              {...notesProps}
            />
          </Form.Field>
          <Form.Field>
            <label>完了</label>
            <Checkbox {...completedProps} />
          </Form.Field>
          <Form.Field>
            <label>期限</label>
            <DatePicker {...dueProps} locale="ja" dateFormat="yyyy/MM/dd" />
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          icon={true}
          onClick={handleButtonClick}
          positive={true}
          disabled={titleProps.value === ""}
        >
          <Icon name="plus" /> 追加する
        </Button>
      </Modal.Actions>
    </Modal>
  );
};
export default CreateTaskModal;
