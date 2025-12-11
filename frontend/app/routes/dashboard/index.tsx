import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { useGetWorkspaceStatsQuery } from "@/hooks/use-workspace";
/*import { useWorkspaceContext } from "@/context/WorkspaceContext";*/
import { NoDataFound } from "@/components/no-data-found";
import { useEffect } from "react";
import { useWorkspaceContext } from "@/context/WorkspaceContext";

// Required to avoid Router GET error
export const loader = async () => {
  return null;
};

export default function DashboardRoute() {
  const {
    selectedWorkspace,
    isLoadingWorkspaces,
    workspaces,
    setSelectedWorkspace,
  } = useWorkspaceContext();

  const workspaceId = selectedWorkspace?._id ?? "";
  const { data, isLoading } = useGetWorkspaceStatsQuery(workspaceId, {
    enabled: !!workspaceId,
  });

  // Auto-select first workspace
  useEffect(() => {
    if (!selectedWorkspace && workspaces.length > 0) {
      setSelectedWorkspace(workspaces[0]);
    }
  }, [workspaces, selectedWorkspace, setSelectedWorkspace]);

  if (isLoadingWorkspaces || isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!selectedWorkspace) {
    return (
      <NoDataFound
        title="No Workspace Selected"
        description="Please create or select a workspace to view your dashboard."
        buttonText="Create Workspace"
        buttonAction={() => {}}
      />
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">{selectedWorkspace.name} Dashboard</h1>

      {/* Safely render stats */}
      <DashboardStats stats={data?.stats ?? {}} />
    </div>
  );
}

