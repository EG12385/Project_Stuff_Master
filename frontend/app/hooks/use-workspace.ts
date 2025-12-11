import type { WorkspaceForm } from "@/components/workspace/create-workspace";
import { fetchData, postData } from "@/lib/fetch-util";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  StatsCardProps,
  TaskTrendsData,
  ProjectStatusData,
  TaskPriorityData,
  WorkspaceProductivityData,
  Task,
  Project,
  Workspace,
} from "@/types";

// -----------------------
// SAFE DEFAULTS
// -----------------------
const DEFAULT_STATS: StatsCardProps = {
  totalProjects: 0,
  totalTasks: 0,
  totalProjectInProgress: 0,
  totalTaskCompleted: 0,
  totalTaskToDo: 0,
  totalTaskInProgress: 0,
  totalOverdueTasks: 0,
};

// -----------------------
// CREATE WORKSPACE
// -----------------------
export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation<Workspace, unknown, WorkspaceForm>({
    mutationFn: (data: WorkspaceForm) => postData("/workspaces", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
};

// -----------------------
// GET ALL WORKSPACES
// -----------------------
export const useGetWorkspacesQuery = (workspaceId: string) => {
  return useQuery<Workspace[], unknown>({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const res = await fetchData<any>("/workspaces");

      if (Array.isArray(res)) return res;
      if (Array.isArray(res?.workspaces)) return res.workspaces;
      if (Array.isArray(res?.data?.workspaces)) return res.data.workspaces;
      if (Array.isArray(res?.data)) return res.data;

      return [];
    },
  });
};

// -----------------------
// GET SINGLE WORKSPACE
// -----------------------
export const useGetWorkspaceQuery = (workspaceId?: string) => {
  return useQuery<Workspace, unknown>({
    queryKey: ["workspace", workspaceId ?? "none"],
    enabled: !!workspaceId,
    queryFn: async () => fetchData<Workspace>(`/workspaces/${workspaceId}`),
  });
};

// -----------------------
// GET WORKSPACE DETAILS
// -----------------------
export const useGetWorkspaceDetailsQuery = (workspaceId?: string) => {
  return useQuery<Workspace, unknown>({
    queryKey: ["workspace", workspaceId ?? "none", "details"],
    enabled: !!workspaceId,
    queryFn: async () => fetchData<Workspace>(`/workspaces/${workspaceId}`),
  });
};


// -----------------------
// GET WORKSPACE STATS
// -----------------------
export const useGetWorkspaceStatsQuery = (
  workspaceId?: string,
  options?: { enabled?: boolean }
) => {
  type StatsResponse = {
    stats: StatsCardProps;
    taskTrendsData: TaskTrendsData[];
    projectStatusData: ProjectStatusData[];
    taskPriorityData: TaskPriorityData[];
    workspaceProductivityData: WorkspaceProductivityData[];
    upcomingTasks: Task[];
    recentProjects: Project[];
  };

  return useQuery<StatsResponse, unknown>({
    queryKey: ["workspace", workspaceId ?? "none", "stats"],
    enabled: options?.enabled ?? !!workspaceId,
    queryFn: async (): Promise<StatsResponse> => {
      if (!workspaceId) {
        return {
          stats: DEFAULT_STATS,
          taskTrendsData: [],
          projectStatusData: [],
          taskPriorityData: [],
          workspaceProductivityData: [],
          upcomingTasks: [],
          recentProjects: [],
        };
      }

      const res = await fetchData<any>(`/workspaces/${workspaceId}/stats`);

      return {
        stats: res?.stats ?? DEFAULT_STATS,
        taskTrendsData: res?.taskTrendsData ?? [],
        projectStatusData: res?.projectStatusData ?? [],
        taskPriorityData: res?.taskPriorityData ?? [],
        workspaceProductivityData: res?.workspaceProductivityData ?? [],
        upcomingTasks: res?.upcomingTasks ?? [],
        recentProjects: res?.recentProjects ?? [],
      };
    },
    initialData: {
      stats: DEFAULT_STATS,
      taskTrendsData: [],
      projectStatusData: [],
      taskPriorityData: [],
      workspaceProductivityData: [],
      upcomingTasks: [],
      recentProjects: [],
    },
  });
};

// -----------------------
// INVITE MEMBER
// -----------------------
export const useInviteMemberMutation = () => {
  return useMutation<unknown, unknown, { email: string; role: string; workspaceId: string }>({
    mutationFn: (data) =>
      postData(`/workspaces/${data.workspaceId}/invite-member`, data),
  });
};

// -----------------------
// ACCEPT INVITE BY TOKEN
// -----------------------
export const useAcceptInviteByTokenMutation = () => {
  return useMutation<unknown, unknown, string>({
    mutationFn: (token) => postData(`/workspaces/accept-invite-token`, { token }),
  });
};

// -----------------------
// GENERATE ACCEPT LINK
// -----------------------
export const useAcceptGenerateInviteMutation = () => {
  return useMutation<unknown, unknown, string>({
    mutationFn: (workspaceId) =>
      postData(`/workspaces/${workspaceId}/accept-generate-invite`, {}),
  });
};

