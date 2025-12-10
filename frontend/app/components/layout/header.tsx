import { useAuth } from "@/provider/auth-context";
import { useWorkspaceContext } from "@/context/WorkspaceContext";
import { Button } from "../ui/button";
import { Bell, PlusCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "../ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Link, useNavigate, useLocation } from "react-router";
import { WorkspaceAvatar } from "../workspace/workspace-avatar";

interface HeaderProps {
  onCreateWorkspace: () => void;
}

export const Header = ({ onCreateWorkspace }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const {
    workspaces,
    selectedWorkspace,
    setSelectedWorkspace,
    isLoadingWorkspaces,
  } = useWorkspaceContext();

  const handleWorkspaceSelect = (workspaceId: string) => {
    const workspace = workspaces.find((w) => w._id === workspaceId);
    if (!workspace) return;

    setSelectedWorkspace(workspace);

    // Navigate depending on current route
    if (location.pathname.includes("/workspace")) {
      navigate(`/workspaces/${workspace._id}`);
    } else {
      navigate(`${location.pathname}?workspaceId=${workspace._id}`);
    }
  };

  return (
    <div className="bg-background sticky top-0 z-40 border-b">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        {/* Workspace Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {selectedWorkspace ? (
                <>
                  {selectedWorkspace.color && (
                    <WorkspaceAvatar
                      color={selectedWorkspace.color}
                      name={selectedWorkspace.name}
                    />
                  )}
                  <span className="font-medium ml-2">{selectedWorkspace.name}</span>
                </>
              ) : (
                <span className="font-medium">Select Workspace</span>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              {isLoadingWorkspaces ? (
                <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
              ) : workspaces.length > 0 ? (
                workspaces.map((ws) => (
                  <DropdownMenuItem
                    key={ws._id}
                    onClick={() => handleWorkspaceSelect(ws._id)}
                  >
                    {ws.color && <WorkspaceAvatar color={ws.color} name={ws.name} />}
                    <span className="ml-2">{ws.name}</span>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>No workspaces found</DropdownMenuItem>
              )}
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={onCreateWorkspace}>
                <PlusCircle className="w-4 h-4 mr-2" />
                Create Workspace
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Right-side user actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full border p-1 w-8 h-8">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.profilePicture} alt={user?.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/user/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>Log Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
