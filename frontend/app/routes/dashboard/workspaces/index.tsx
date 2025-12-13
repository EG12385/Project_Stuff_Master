import { useEffect } from "react";
import { useWorkspaceContext } from "@/context/WorkspaceContext";
import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

const WorkspacesPage = () => {
  const {
    workspaces,
    selectedWorkspace,
    setSelectedWorkspace,
    isLoadingWorkspaces,
    workspaceId,
  } = useWorkspaceContext();

  const navigate = useNavigate();

  useEffect(() => {
    // Auto-select first workspace if none is selected
    if (!selectedWorkspace && workspaces.length > 0) {
      setSelectedWorkspace(workspaces[0]);
    }
  }, [workspaces, selectedWorkspace, setSelectedWorkspace]);

  if (isLoadingWorkspaces) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (!workspaces.length) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-xl font-bold">No workspaces available</h2>
      </div>
    );
  }

  const tasks = selectedWorkspace?.tasks ?? [];
  const notes = selectedWorkspace?.notes ?? [];
  const members = selectedWorkspace?.members ?? [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Workspaces</h1>

      {/* Workspace selector */}
      <div className="flex gap-2 mb-6">
        {workspaces.map((ws) => (
          <Button
            key={ws._id}
            variant={ws._id === workspaceId ? "default" : "outline"}
            onClick={() => setSelectedWorkspace(ws)}
          >
            {ws.name}
          </Button>
        ))}
      </div>

      {selectedWorkspace ? (
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Selected Workspace: {selectedWorkspace.name}
          </h2>
          <p className="mb-4">{selectedWorkspace.description}</p>

          {/* Members */}
          <div className="mb-4">
            <h3 className="font-semibold">Members</h3>
            {members.length ? (
              <ul className="list-disc ml-5">
                {members.map((member) => (
                  <li key={member.user._id}>
                    {member.user.name} ({member.user.email}) - {member.role}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No members yet</p>
            )}
          </div>

          {/* Tasks */}
          <div className="mb-4">
            <h3 className="font-semibold">Tasks</h3>
            {tasks.length ? (
              <ul className="list-disc ml-5">
                {tasks.map((task) => (
                  <li key={task._id}>
                    {task.title} - {task.status} - {task.priority}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No tasks yet</p>
            )}
          </div>

          {/* Notes */}
          <div className="mb-4">
            <h3 className="font-semibold">Notes</h3>
            {notes.length ? (
              <ul className="list-disc ml-5">
                {notes.map((note) => (
                  <li key={note._id}>
                    {note.content} (by{" "}
                    {typeof note.createdBy === "string"
                      ? note.createdBy
                      : note.createdBy.name}
                    )
                  </li>
                ))}
              </ul>
            ) : (
              <p>No notes yet</p>
            )}
          </div>
        </div>
      ) : (
        <p>Please select a workspace to see details</p>
      )}
    </div>
  );
};

export default WorkspacesPage;

