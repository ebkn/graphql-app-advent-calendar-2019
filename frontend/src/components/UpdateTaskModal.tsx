import React, { useCallback, useState } from "react";

import {
  Form,
  Modal,
  Button,
  Icon,
  Message,
  Checkbox
} from "semantic-ui-react";
import { useUpdateTaskMutation, Task } from "../generated/graphql";

import { useTaskFields } from "../hooks/formHooks";
import sleep from "../lib/sleep";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);

interface Props {
  task: Task;
  handleModalClose: () => void;
}

const CreateTaskModal = ({ task, handleModalClose }: Props) => {
  const {
    titleProps,
    notesProps,
    completedProps,
    dueProps,
    clearValue
  } = useTaskFields(task);

  const [success, setSuccess] = useState(false);

  const handleMutationCompleted = useCallback(async () => {
    setSuccess(true);
    await sleep(1500);
    clearValue();
    handleModalClose();
  }, [clearValue, handleModalClose]);

  const [updateTask, { loading, error }] = useUpdateTaskMutation({
    variables: {
      taskID: task.id,
      title: titleProps.value,
      notes: notesProps.value,
      completed: completedProps.checked,
      due: dueProps.selected?.toISOString()
    },
    onCompleted: handleMutationCompleted
  });

  const handleButtonClick = useCallback(() => {
    updateTask();
  }, [updateTask]);

  // if (loading) {
  //   return <Loading />;
  // }

  return (
    <Modal open={!!task} closeIcon={true} onClose={handleModalClose}>
      <Modal.Header>タスクを編集</Modal.Header>
      <Modal.Content>
        <Form loading={loading} success={success} error={!!error}>
          <Message error={true}>保存中にエラーが発生しました</Message>
          <Message success={true}>タスクを編集しました</Message>
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
          <Icon name="plus" /> 保存する
        </Button>
      </Modal.Actions>
    </Modal>
  );
};
export default CreateTaskModal;
