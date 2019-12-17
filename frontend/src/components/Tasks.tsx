import React, { useCallback, useState, useEffect, useMemo } from "react";

import {
  Header,
  Icon,
  List,
  Dimmer,
  Loader,
  Dropdown,
  DropdownProps
} from "semantic-ui-react";
import InfiniteScroll from "react-infinite-scroller";
import CreateTaskModal from "./CreateTaskModal";
import UpdateTaskModal from "./UpdateTaskModal";
import CompletedIcon from "./CompletedIcon";

import { formatRelative } from "date-fns";
import ja from "date-fns/locale/ja";
import {
  useFetchTasksQuery,
  TaskOrderFields,
  Task
} from "../generated/graphql";
import styles from "../styles/main.css";

type TaskFilterType = "all" | "completed" | "notCompleted";
const Tasks = () => {
  const [selectedTask, setSelectedTask] = useState<Task>();
  const [fetchMoreLoading, setFetchMoreLoading] = useState(false);
  const [taskFilterType, setTaskFilterType] = useState<TaskFilterType>("all");
  const [orderType, setOrderType] = useState<TaskOrderFields>(
    TaskOrderFields.Latest
  );

  const handleTaskFilterTypeChange = useCallback(
    (_: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
      setTaskFilterType(data.value as TaskFilterType);
    },
    []
  );
  const completedInput = useMemo(() => {
    switch (taskFilterType) {
      case "all":
        return null;
      case "completed":
        return true;
      case "notCompleted":
        return false;
    }
  }, [taskFilterType]);

  const handleOrderTypeChange = useCallback(
    (_: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
      setOrderType(data.value as TaskOrderFields);
    },
    []
  );

  const { data, error, fetchMore, refetch } = useFetchTasksQuery({
    variables: { order: TaskOrderFields.Latest, first: 5 },
    fetchPolicy: "cache-and-network"
  });

  useEffect(() => {
    refetch({ order: orderType, completed: completedInput, first: 5 });
  }, [completedInput, orderType, refetch]);

  const refetchAfterAdd = useCallback(() => {
    refetch({ order: orderType, completed: completedInput, first: 5 });
  }, [completedInput, orderType, refetch]);

  const handleLoadMore = useCallback(async () => {
    if (data && !fetchMoreLoading) {
      setFetchMoreLoading(true);
      await fetchMore({
        variables: {
          after: data.tasks.pageInfo.endCursor,
          order: orderType,
          completed: completedInput,
          first: 5
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return previousResult;
          }

          const newEdges = fetchMoreResult.tasks.edges;
          const pageInfo = fetchMoreResult.tasks.pageInfo;

          return {
            tasks: {
              ...previousResult.tasks,
              pageInfo,
              edges: [...previousResult.tasks.edges, ...newEdges]
            }
          };
        }
      });
      setFetchMoreLoading(false);
    }
  }, [completedInput, data, fetchMore, fetchMoreLoading, orderType]);

  const handleListItemClick = useCallback(
    (subscriber: Task) => () => {
      setSelectedTask(subscriber);
    },
    []
  );

  const handleModalClose = useCallback(() => {
    setSelectedTask(undefined);
  }, []);

  if (!data) {
    return (
      <Dimmer active={true}>
        <Loader>ロード中...</Loader>
      </Dimmer>
    );
  }

  if (error) {
    return <div>エラー</div>;
  }

  return (
    <div className={styles.main_content_box}>
      <Header color="teal" icon={true} textAlign="center">
        <Icon name="tasks" />
        <Header.Content>TODOs</Header.Content>
      </Header>
      <Dropdown
        options={[
          { value: "all", text: "すべて" },
          { value: "notCompleted", text: "未完了" },
          { value: "completed", text: "完了済み" }
        ]}
        value={taskFilterType}
        onChange={handleTaskFilterTypeChange}
        fluid={true}
        selection={true}
      />
      <div className={styles.order_dropdown}>
        <Dropdown
          options={[
            { value: TaskOrderFields.Due, text: "期限順" },
            { value: TaskOrderFields.Latest, text: "作成順" }
          ]}
          icon="sort amount up"
          value={orderType}
          onChange={handleOrderTypeChange}
        />
      </div>
      <InfiniteScroll
        loadMore={handleLoadMore}
        hasMore={data.tasks.pageInfo.hasNextPage}
        loader={
          <p style={{ textAlign: "center" }} key={0}>
            <Icon loading={true} name="spinner" />
          </p>
        }
      >
        <List selection={true} divided={true}>
          {data.tasks.edges.map(task =>
            task ? (
              <List.Item key={task.node.id}>
                <CompletedIcon task={task.node} />
                <List.Content onClick={handleListItemClick(task.node)}>
                  <List.Header>{task.node.title}</List.Header>
                  {task.node.due ? (
                    <List.Description>
                      <Icon name="time" />
                      {formatRelative(new Date(task.node.due), new Date(), {
                        locale: ja
                      })}{" "}
                      まで
                    </List.Description>
                  ) : null}
                </List.Content>
              </List.Item>
            ) : null
          )}
        </List>
      </InfiniteScroll>
      <CreateTaskModal refetch={refetchAfterAdd} />
      {selectedTask !== undefined ? (
        <UpdateTaskModal
          task={selectedTask}
          handleModalClose={handleModalClose}
        />
      ) : null}
    </div>
  );
};
export default Tasks;
