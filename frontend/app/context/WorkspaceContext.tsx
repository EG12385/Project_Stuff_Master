import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { useGetWorkspacesQuery } from "@/hooks/use-workspace";
import type { Workspace } from "@/types";

interface WorkspaceContextType {
  workspaces: Workspace[];
  selectedWorkspace?: Workspace;
  workspaceId?: string;
  setSelectedWorkspace: (ws?: Workspace) => void;
  isLoadingWorkspaces: boolean;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider = ({ children }: { children: React.ReactNode }) => {
  const { workspaceId } = useParams();
  const { data: workspaces = [], isLoading } = useGetWorkspacesQuery();

  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | undefined>();

  // 🔥 SYNC CONTEXT WITH URL
  useEffect(() => {
    if (!workspaceId || workspaces.length === 0) return;

    const ws = workspaces.find(w => w._id === workspaceId);
    if (ws) setSelectedWorkspace(ws);
  }, [workspaceId, workspaces]);

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        selectedWorkspace,
        workspaceId,
        setSelectedWorkspace,
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
