import { useWorkspaceContext } from "@/context/WorkspaceContext";
import { useNavigate } from "react-router";


export const WorkspaceSelector = () => {
  const { workspaces, selectedWorkspace, setSelectedWorkspace } = useWorkspaceContext();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const ws = workspaces.find((w) => w._id === e.target.value);
    if (ws) {
      setSelectedWorkspace(ws);
      navigate(`/dashboard/workspaces/${ws._id}`);
    }
  };

  return (
    <select value={selectedWorkspace?._id ?? ""} onChange={handleChange}>
      {workspaces.map((w) => (
        <option key={w._id} value={w._id}>
          {w.name}
        </option>
      ))}
    </select>
  );
};
