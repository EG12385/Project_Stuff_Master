import { useNavigate } from "react-router";
import { useWorkspaceContext } from "@/context/WorkspaceContext";
import { Loader } from "@/components/loader";
import { Card } from "@/components/ui/card";
import { WorkspaceAvatar } from "@/components/workspace/workspace-avatar";

const WorkspaceIndex = () => {
  const navigate = useNavigate();
  const { workspaces, isLoadingWorkspaces } = useWorkspaceContext();

  if (isLoadingWorkspaces) {
    return <Loader />;
  }

  if (workspaces.length === 0) {
    return <div className="text-muted-foreground">No workspaces found.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {workspaces.map(ws => (
        <Card
          key={ws._id}
          className="p-4 cursor-pointer hover:bg-accent"
          onClick={() => navigate(`/dashboard/workspaces/${ws._id}`)}
        >
          <h2 className="font-semibold">{ws.name}</h2>
          <p className="text-sm text-muted-foreground">{ws.description ?? "No description"}</p>
        </Card>

      ))}
    </div>
  );
};

export default WorkspaceIndex;

