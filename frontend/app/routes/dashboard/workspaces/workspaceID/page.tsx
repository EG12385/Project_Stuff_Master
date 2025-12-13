import { useParams } from "react-router";
import { BackButton } from "@/components/back-button";
import { Loader } from "@/components/loader";
import { useWorkspaceContext } from "@/context/WorkspaceContext";
import { useGetWorkspaceQuery } from "@/hooks/use-workspace";

export const WorkspacePage = () => {
  const { workspaceId: paramId } = useParams<{ workspaceId: string }>();
  const { workspaceId: contextId } = useWorkspaceContext();

  // Prefer paramId from the route; fallback to contextId
  const workspaceId = paramId || contextId;

  const { data: workspace, isLoading, error } = useGetWorkspaceQuery(workspaceId);

  if (isLoading) return <Loader />;
  if (error) return <div>Error loading workspace</div>;
  if (!workspace) return <div>No workspace selected</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <BackButton />
        <h1 className="text-2xl font-bold">{workspace.name}</h1>
      </div>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Tasks</h2>
        {workspace.tasks?.length ? (
          <ul>
            {workspace.tasks.map((task) => (
              <li key={task._id}>{task.title}</li>
            ))}
          </ul>
        ) : (
          <p>No tasks yet</p>
        )}
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Members</h2>
        {workspace.members?.length ? (
          <ul>
            {workspace.members.map((member) => (
              <li key={member.user._id}>{member.user.email}</li>
            ))}
          </ul>
        ) : (
          <p>No members yet</p>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Notes</h2>
        {workspace.notes?.length ? (
          <ul>
            {workspace.notes.map((note) => (
              <li key={note._id}>{note.content}</li>
            ))}
          </ul>
        ) : (
          <p>No notes yet</p>
        )}
      </section>
    </div>
  );
};

