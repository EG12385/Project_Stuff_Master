import { createContext, useContext, useState, useEffect } from "react";
import { useGetWorkspacesQuery } from "@/hooks/use-workspace";
import type { Workspace } from "@/types";

interface WorkspaceContextType {
  workspaces: Workspace[];
  selectedWorkspace?: Workspace;
  workspaceId?: string;
  setSelectedWorkspace: (ws?: Workspace) => void;
  isLoadingWorkspaces: boolean;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined
);

export const WorkspaceProvider = ({ children }: { children: React.ReactNode }) => {
  // Data returned by hook is already normalized to Workspace[]
  const { data: workspaces = [], isLoading } = useGetWorkspacesQuery();

  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace>();

  // Auto-select first workspace when workspaces load
  useEffect(() => {
    if (workspaces.length > 0 && !selectedWorkspace) {
      setSelectedWorkspace(workspaces[0]);
    }
  }, [workspaces]);

  // Expose workspaceId for use in hooks and components
  const workspaceId = selectedWorkspace?._id;

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


