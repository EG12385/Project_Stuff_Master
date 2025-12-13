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
  // Fetch all workspaces
  const { data: workspacesData = [], isLoading } = useGetWorkspacesQuery();

  // Ensure workspaces is always an array
  const workspaces: Workspace[] = Array.isArray(workspacesData)
    ? workspacesData
    : [];

  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace>();

  // Auto-select first workspace when loaded
  useEffect(() => {
    if (!selectedWorkspace && workspaces.length > 0) {
      setSelectedWorkspace(workspaces[0]);
    }
  }, [workspaces, selectedWorkspace]);

  // Expose workspaceId for hooks/components
  const workspaceId = selectedWorkspace?._id;

  // Default arrays inside selectedWorkspace to avoid runtime errors
  const safeSelectedWorkspace: Workspace | undefined = selectedWorkspace
    ? {
        ...selectedWorkspace,
        tasks: selectedWorkspace.tasks ?? [],
        notes: selectedWorkspace.notes ?? [],
        members: selectedWorkspace.members ?? [],
      }
    : undefined;

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        selectedWorkspace: safeSelectedWorkspace,
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


