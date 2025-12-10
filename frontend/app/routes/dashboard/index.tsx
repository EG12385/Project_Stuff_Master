import React, { useEffect } from "react";
import { useWorkspaceContext } from "@/context/WorkspaceContext";
import { useGetWorkspaceStatsQuery } from "@/hooks/use-workspace";
import { NoDataFound } from "@/components/no-data-found";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import type { Workspace } from "@/types";
import { useLoaderData } from "react-router";

export const DashboardPage = () => {
  // Get workspaces from loader (React Router)
  const { workspaces: loadedWorkspaces } = useLoaderData() as { workspaces: Workspace[] };

  const {
    selectedWorkspace,
    setSelectedWorkspace,
    workspaces,
    setWorkspaces,
    isLoadingWorkspaces,
    setIsLoadingWorkspaces,
  } = useWorkspaceContext();

  // Load workspaces into context if not already
  useEffect(() => {
    if (loadedWorkspaces) {
      setWorkspaces(loadedWorkspaces);
      setIsLoadingWorkspaces(false);

      // Automatically select first workspace if none selected
      if (!selectedWorkspace && loadedWorkspaces.length > 0) {
        setSelectedWorkspace(loadedWorkspaces[0]);
      }
    }
  }, [loadedWorkspaces, selectedWorkspace, setWorkspaces, setIsLoadingWorkspaces, setSelectedWorkspace]);

  const workspaceId = selectedWorkspace?._id ?? "";

  // Fetch stats for selected workspace
  const { data, isLoading: isStatsLoading } = useGetWorkspaceStatsQuery(workspaceId, {
    enabled: !!workspaceId,
  });

  if (isLoadingWorkspaces || isStatsLoading) {
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
        taskTrendsData={data?.taskTrendsData || []}
        projectStatusData={data?.projectStatusData || []}
        taskPriorityData={data?.taskPriorityData || []}
        workspaceProductivityData={data?.workspaceProductivityData || []}
      />
      {/* Additional dashboard components like charts, tasks, projects can be added here */}
    </div>
  );
};


