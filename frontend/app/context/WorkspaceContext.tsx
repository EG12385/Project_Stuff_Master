import React, { createContext, useContext, useState, useEffect, type ReactNode,  } from "react";
import type { Workspace } from "@/types";
import { useGetWorkspacesQuery } from "@/hooks/use-workspace";

interface WorkspaceContextType {
  workspaces: Workspace[];
  selectedWorkspace: Workspace | null;
  setSelectedWorkspace: (workspace: Workspace | null) => void;
  isLoadingWorkspaces: boolean;
  reloadWorkspaces: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

interface WorkspaceProviderProps {
  children: ReactNode;
}

export const WorkspaceProvider = ({ children }: WorkspaceProviderProps) => {
  const { data, isLoading, refetch } = useGetWorkspacesQuery();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [isLoadingWorkspaces, setIsLoadingWorkspaces] = useState<boolean>(true);

  // Normalize data: always get an array of workspaces
  useEffect(() => {
    let normalizedWorkspaces: Workspace[] = [];

    if (data) {
      if (Array.isArray(data)) {
        normalizedWorkspaces = data;
      } else if (Array.isArray((data as any).workspaces)) {
        normalizedWorkspaces = (data as any).workspaces;
      }
    }

    setWorkspaces(normalizedWorkspaces);
    setIsLoadingWorkspaces(isLoading);

    // Set selectedWorkspace if none is selected
    if (!selectedWorkspace && normalizedWorkspaces.length > 0) {
      setSelectedWorkspace(normalizedWorkspaces[0]);
    }
  }, [data, isLoading, selectedWorkspace]);

  const reloadWorkspaces = async () => {
    setIsLoadingWorkspaces(true);
    await refetch();
    setIsLoadingWorkspaces(false);
  };

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        selectedWorkspace,
        setSelectedWorkspace,
        isLoadingWorkspaces,
        reloadWorkspaces,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspaceContext = (): WorkspaceContextType => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspaceContext must be used within a WorkspaceProvider");
  }
  return context;
};
