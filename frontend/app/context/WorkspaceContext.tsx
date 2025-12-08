import { createContext, useContext, useState, useEffect, type ReactNode,  } from "react";
import type { Workspace } from "@/types";
import { useGetWorkspacesQuery } from "@/hooks/use-workspace";

interface WorkspaceContextType {
  selectedWorkspace: Workspace | null;
  setSelectedWorkspace: (workspace: Workspace | null) => void;
  workspaces: Workspace[];
  setWorkspaces: (workspaces: Workspace[]) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const { data: workspaceData, isLoading } = useGetWorkspacesQuery() as {
    data: Workspace[];
    isLoading: boolean;
  };

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);

  // Sync fetched workspaces to state
  useEffect(() => {
    if (!isLoading && workspaceData) {
      setWorkspaces(workspaceData);

      // Auto-select first workspace if none selected
      if (!selectedWorkspace && workspaceData.length > 0) {
        setSelectedWorkspace(workspaceData[0]);
      }
    }
  }, [workspaceData, isLoading, selectedWorkspace]);

  const value: WorkspaceContextType = {
    selectedWorkspace,
    setSelectedWorkspace,
    workspaces,
    setWorkspaces,
  };

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
};

// Hook to use context safely
export const useWorkspaceContext = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspaceContext must be used within WorkspaceProvider");
  }
  return context;
};

