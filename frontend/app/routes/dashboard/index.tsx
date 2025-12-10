import React, { useEffect } from "react";
import { useWorkspaceContext } from "@/context/WorkspaceContext";
import { useGetWorkspaceStatsQuery } from "@/hooks/use-workspace";
import { NoDataFound } from "@/components/no-data-found";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";

export const DashboardPage = () => {
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

  // Automatically select first workspace if none selected
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
        description="Please select or create a workspace to view dashboard data."
        buttonText="Create Workspace"
        buttonAction={() => {
          console.log("Open create workspace modal");
        }}
      />
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">{selectedWorkspace.name} Dashboard</h1>
      <DashboardStats
        stats={data?.stats}
        taskTrendsData={data?.taskTrendsData ?? []}
        projectStatusData={data?.projectStatusData ?? []}
        taskPriorityData={data?.taskPriorityData ?? []}
        workspaceProductivityData={data?.workspaceProductivityData ?? []}
      />
      {/* You can add additional dashboard charts/components here */}
    </div>
  );
};
