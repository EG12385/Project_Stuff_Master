import { Outlet, useParams } from "react-router";
import { Loader } from "@/components/loader";
import { useGetWorkspaceDetailsQuery } from "@/hooks/use-workspace";
import { useWorkspaceContext } from "@/context/WorkspaceContext";
import { useEffect } from "react";

const WorkspaceLayout = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { setSelectedWorkspace } = useWorkspaceContext();

  const { data: workspace, isLoading } =
    useGetWorkspaceDetailsQuery(workspaceId!);

  useEffect(() => {
    if (workspace) {
      setSelectedWorkspace(workspace);
    }
  }, [workspace, setSelectedWorkspace]);

  if (isLoading) return <Loader />;

  if (!workspace) {
    return <div className="p-6 text-lg">Workspace not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold">{workspace.name}</h1>
        <p className="text-muted-foreground">
          {workspace.description || "No description"}
        </p>
      </div>

      {/* Nested routes render here */}
      <Outlet />
    </div>
  );
};

export default WorkspaceLayout;
