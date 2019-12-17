import gql from "graphql-tag";
import * as ApolloReactCommon from "@apollo/react-common";
import * as ApolloReactHooks from "@apollo/react-hooks";
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

export const TaskFieldsFragmentDoc = gql`
  fragment taskFields on Task {
    id
    title
    notes
    completed
    due
  }
`;
export const FetchTasksDocument = gql`
  query fetchTasks(
    $completed: Boolean
    $order: TaskOrderFields!
    $first: Int
    $after: String
  ) {
    tasks(
      input: { completed: $completed }
      orderBy: $order
      page: { first: $first, after: $after }
    ) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          ...taskFields
        }
      }
    }
  }
  ${TaskFieldsFragmentDoc}
`;

/**
 * __useFetchTasksQuery__
 *
 * To run a query within a React component, call `useFetchTasksQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchTasksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchTasksQuery({
 *   variables: {
 *      completed: // value for 'completed'
 *      order: // value for 'order'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useFetchTasksQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    FetchTasksQuery,
    FetchTasksQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<FetchTasksQuery, FetchTasksQueryVariables>(
    FetchTasksDocument,
    baseOptions
  );
}
export function useFetchTasksLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    FetchTasksQuery,
    FetchTasksQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    FetchTasksQuery,
    FetchTasksQueryVariables
  >(FetchTasksDocument, baseOptions);
}
export type FetchTasksQueryHookResult = ReturnType<typeof useFetchTasksQuery>;
export type FetchTasksLazyQueryHookResult = ReturnType<
  typeof useFetchTasksLazyQuery
>;
export type FetchTasksQueryResult = ApolloReactCommon.QueryResult<
  FetchTasksQuery,
  FetchTasksQueryVariables
>;
export const CreateTaskDocument = gql`
  mutation createTask(
    $title: String!
    $notes: String
    $completed: Boolean
    $due: Time
  ) {
    createTask(
      input: { title: $title, notes: $notes, completed: $completed, due: $due }
    ) {
      ...taskFields
    }
  }
  ${TaskFieldsFragmentDoc}
`;
export type CreateTaskMutationFn = ApolloReactCommon.MutationFunction<
  CreateTaskMutation,
  CreateTaskMutationVariables
>;

/**
 * __useCreateTaskMutation__
 *
 * To run a mutation, you first call `useCreateTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTaskMutation, { data, loading, error }] = useCreateTaskMutation({
 *   variables: {
 *      title: // value for 'title'
 *      notes: // value for 'notes'
 *      completed: // value for 'completed'
 *      due: // value for 'due'
 *   },
 * });
 */
export function useCreateTaskMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateTaskMutation,
    CreateTaskMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    CreateTaskMutation,
    CreateTaskMutationVariables
  >(CreateTaskDocument, baseOptions);
}
export type CreateTaskMutationHookResult = ReturnType<
  typeof useCreateTaskMutation
>;
export type CreateTaskMutationResult = ApolloReactCommon.MutationResult<
  CreateTaskMutation
>;
export type CreateTaskMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateTaskMutation,
  CreateTaskMutationVariables
>;
export const UpdateTaskDocument = gql`
  mutation updateTask(
    $taskID: ID!
    $title: String
    $notes: String
    $completed: Boolean
    $due: Time
  ) {
    updateTask(
      input: {
        taskID: $taskID
        title: $title
        notes: $notes
        completed: $completed
        due: $due
      }
    ) {
      ...taskFields
    }
  }
  ${TaskFieldsFragmentDoc}
`;
export type UpdateTaskMutationFn = ApolloReactCommon.MutationFunction<
  UpdateTaskMutation,
  UpdateTaskMutationVariables
>;

/**
 * __useUpdateTaskMutation__
 *
 * To run a mutation, you first call `useUpdateTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTaskMutation, { data, loading, error }] = useUpdateTaskMutation({
 *   variables: {
 *      taskID: // value for 'taskID'
 *      title: // value for 'title'
 *      notes: // value for 'notes'
 *      completed: // value for 'completed'
 *      due: // value for 'due'
 *   },
 * });
 */
export function useUpdateTaskMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UpdateTaskMutation,
    UpdateTaskMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    UpdateTaskMutation,
    UpdateTaskMutationVariables
  >(UpdateTaskDocument, baseOptions);
}
export type UpdateTaskMutationHookResult = ReturnType<
  typeof useUpdateTaskMutation
>;
export type UpdateTaskMutationResult = ApolloReactCommon.MutationResult<
  UpdateTaskMutation
>;
export type UpdateTaskMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UpdateTaskMutation,
  UpdateTaskMutationVariables
>;
