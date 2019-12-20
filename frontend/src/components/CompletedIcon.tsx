import React from "react";

import { Icon, Message } from "semantic-ui-react";
import { useUpdateTaskMutation, Task } from "../generated/graphql";

interface Props {
  task: Task;
}

const CreateTaskModal = ({ task }: Props) => {
  const [updateTask, { error }] = useUpdateTaskMutation({
    variables: {
      taskID: task.id,
      completed: !task.completed
    }
  });

  if (error) {
    return <Message error={true}>更新に失敗しました</Message>;
  }

  return task.completed ? (
    <Icon name="check circle" color="green" size="big" onClick={updateTask} />
  ) : (
    <Icon name="check circle" size="big" onClick={updateTask} />
  );
};
export default CreateTaskModal;
