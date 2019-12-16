export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Time: string;
};

export type Connection = {
  pageInfo: PageInfo;
  edges: Array<Maybe<Edge>>;
};

export type CreateTaskInput = {
  title: Scalars["String"];
  notes?: Maybe<Scalars["String"]>;
  completed?: Maybe<Scalars["Boolean"]>;
  due?: Maybe<Scalars["Time"]>;
};

export type Edge = {
  cursor: Scalars["String"];
  node: Node;
};

export type Mutation = {
  __typename?: "Mutation";
  createTask: Task;
  updateTask: Task;
};

export type MutationCreateTaskArgs = {
  input: CreateTaskInput;
};

export type MutationUpdateTaskArgs = {
  input: UpdateTaskInput;
};

export type Node = {
  id: Scalars["ID"];
};

export type PageInfo = {
  __typename?: "PageInfo";
  endCursor: Scalars["String"];
  hasNextPage: Scalars["Boolean"];
};

export type PaginationInput = {
  first?: Maybe<Scalars["Int"]>;
  after?: Maybe<Scalars["String"]>;
};

export type Query = {
  __typename?: "Query";
  tasks: TaskConnection;
};

export type QueryTasksArgs = {
  input: TasksInput;
  orderBy: TaskOrderFields;
  page: PaginationInput;
};

export type Task = Node & {
  __typename?: "Task";
  id: Scalars["ID"];
  title: Scalars["String"];
  notes: Scalars["String"];
  completed: Scalars["Boolean"];
  due?: Maybe<Scalars["Time"]>;
};

export type TaskConnection = Connection & {
  __typename?: "TaskConnection";
  pageInfo: PageInfo;
  edges: Array<Maybe<TaskEdge>>;
};

export type TaskEdge = Edge & {
  __typename?: "TaskEdge";
  cursor: Scalars["String"];
  node: Task;
};

export enum TaskOrderFields {
  Latest = "LATEST",
  Due = "DUE"
}

export type TasksInput = {
  completed?: Maybe<Scalars["Boolean"]>;
};

export type UpdateTaskInput = {
  taskID: Scalars["ID"];
  title?: Maybe<Scalars["String"]>;
  notes?: Maybe<Scalars["String"]>;
  completed?: Maybe<Scalars["Boolean"]>;
  due?: Maybe<Scalars["Time"]>;
};

export type TaskFieldsFragment = { __typename?: "Task" } & Pick<
  Task,
  "id" | "title" | "notes" | "completed" | "due"
>;

export type FetchTasksQueryVariables = {
  completed?: Maybe<Scalars["Boolean"]>;
  order: TaskOrderFields;
  first?: Maybe<Scalars["Int"]>;
  after?: Maybe<Scalars["String"]>;
};

export type FetchTasksQuery = { __typename?: "Query" } & {
  tasks: { __typename?: "TaskConnection" } & {
    pageInfo: { __typename?: "PageInfo" } & Pick<
      PageInfo,
      "endCursor" | "hasNextPage"
    >;
    edges: Array<
      Maybe<
        { __typename?: "TaskEdge" } & Pick<TaskEdge, "cursor"> & {
            node: { __typename?: "Task" } & TaskFieldsFragment;
          }
      >
    >;
  };
};

export type CreateTaskMutationVariables = {
  title: Scalars["String"];
  notes?: Maybe<Scalars["String"]>;
  completed?: Maybe<Scalars["Boolean"]>;
  due?: Maybe<Scalars["Time"]>;
};

export type CreateTaskMutation = { __typename?: "Mutation" } & {
  createTask: { __typename?: "Task" } & TaskFieldsFragment;
};

export type UpdateTaskMutationVariables = {
  taskID: Scalars["ID"];
  title?: Maybe<Scalars["String"]>;
  notes?: Maybe<Scalars["String"]>;
  completed?: Maybe<Scalars["Boolean"]>;
  due?: Maybe<Scalars["Time"]>;
};

export type UpdateTaskMutation = { __typename?: "Mutation" } & {
  updateTask: { __typename?: "Task" } & TaskFieldsFragment;
};
