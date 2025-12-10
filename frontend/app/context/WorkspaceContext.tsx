import React, { createContext, useContext, useState, ReactNode } from "react";
import type { Workspace } from "@/types";

interface WorkspaceContextType {
  workspaces: Workspace[];
  setWorkspaces: React.Dispatch<React.SetStateAction<Workspace[]>>;
  selectedWorkspace?: Workspace;
  setSelectedWorkspace: React.Dispatch<React.SetStateAction<Workspace | undefined>>;
  isLoadingWorkspaces: boolean;
  setIsLoadingWorkspaces: React.Dispatch<React.SetStateAction<boolean>>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace>();
  const [isLoadingWorkspaces, setIsLoadingWorkspaces] = useState(true);

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        setWorkspaces,
        selectedWorkspace,
        setSelectedWorkspace,
        isLoadingWorkspaces,
        setIsLoadingWorkspaces,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspaceContext = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspaceContext must be used within a WorkspaceProvider");
  }
  return context;
};
