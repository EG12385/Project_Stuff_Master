import { Header } from "@/components/layout/header";
import { SidebarComponent } from "@/components/layout/sidebar-component";
import { Loader } from "@/components/loader";
import { CreateWorkspace } from "@/components/workspace/create-workspace";
import { useWorkspaceContext } from "@/context/WorkspaceContext";
import { useAuth } from "@/provider/auth-context";
import type { Workspace } from "@/types";
import { useState } from "react";
import { Navigate, Outlet } from "react-router";

const DashboardLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);

  const {
    workspaces,
    selectedWorkspace: selectedWorkspaceFromContext,
    setSelectedWorkspace,
    isLoadingWorkspaces,
  } = useWorkspaceContext();

  // Normalize undefined to null for TypeScript
  const selectedWorkspace: Workspace | null =
    selectedWorkspaceFromContext ?? null;

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" />;
  }

  const handleWorkspaceSelected = (workspace: Workspace) => {
    setSelectedWorkspace(workspace);
  };

  return (
    <div className="flex h-screen w-full">
      <SidebarComponent currentWorkspace={selectedWorkspace} />

      <div className="flex flex-1 flex-col h-full">
        <Header
          selectedWorkspace={selectedWorkspace}
          onWorkspaceSelected={handleWorkspaceSelected}
          onCreateWorkspace={() => setIsCreatingWorkspace(true)}
        />

        <main className="flex-1 overflow-y-auto h-full w-full">
          <div className="mx-auto container px-2 sm:px-6 lg:px-8 py-0 md:py-8 w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>

      <CreateWorkspace
        isCreatingWorkspace={isCreatingWorkspace}
        setIsCreatingWorkspace={setIsCreatingWorkspace}
      />
    </div>
  );
};

export default DashboardLayout;

