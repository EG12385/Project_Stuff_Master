import { createContext, useContext, useEffect, useMemo } from "react";
import { useParams } from "react-router";
import { useGetWorkspacesQuery } from "@/hooks/use-workspace";
import type { Workspace } from "@/types";

interface WorkspaceContextType {
  workspaces: Workspace[];
  selectedWorkspace?: Workspace;
  workspaceId?: string;
  isLoadingWorkspaces: boolean;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider = ({ children }: { children: React.ReactNode }) => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { data: workspaces = [], isLoading } = useGetWorkspacesQuery();

  const selectedWorkspace = useMemo(() => {
    if (!workspaceId) return undefined;
    return workspaces.find((ws) => ws._id === workspaceId);
  }, [workspaceId, workspaces]);

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        selectedWorkspace,
        workspaceId,
        isLoadingWorkspaces: isLoading,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspaceContext = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspaceContext must be used inside WorkspaceProvider");
  }
  return context;
};
