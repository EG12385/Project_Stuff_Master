import { Loader } from "@/components/loader";
import { CreateProjectDialog } from "@/components/project/create-project";
import { InviteMemberDialog } from "@/components/workspace/invite-member";
import { ProjectList } from "@/components/workspace/project-list";
import { WorkspaceHeader } from "@/components/workspace/workspace-header";

import type { Project, Workspace } from "@/types";
import { useState } from "react";
import { useParams } from "react-router";
import { useGetWorkspaceDetailsQuery } from "@/hooks/use-workspace";

const WorkspaceDetails = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [isCreateProject, setIsCreateProject] = useState(false);
  const [isInviteMember, setIsInviteMember] = useState(false);

  if (!workspaceId) {
    return <div>No workspace selected</div>;
  }

  const { data: workspace, isLoading } = useGetWorkspaceDetailsQuery(workspaceId);

  if (isLoading || !workspace) {
    return <Loader />;
  }

  // Generate temporary _id for members if missing
  const membersWithId =
    workspace.members?.map((m, index) => ({
      _id: `${workspaceId}-${index}`,
      ...m,
    })) ?? [];

  return (
    <div className="space-y-8">
      <WorkspaceHeader
        workspace={workspace}
        members={membersWithId}
        onCreateProject={() => setIsCreateProject(true)}
        onInviteMember={() => setIsInviteMember(true)}
      />

      <ProjectList
        workspaceId={workspaceId}
        projects={workspace.projects ?? []} // safe access
        onCreateProject={() => setIsCreateProject(true)}
      />

      <CreateProjectDialog
        isOpen={isCreateProject}
        onOpenChange={setIsCreateProject}
        workspaceId={workspaceId}
        workspaceMembers={membersWithId}
      />

      <InviteMemberDialog
        isOpen={isInviteMember}
        onOpenChange={setIsInviteMember}
        workspaceId={workspaceId}
      />
    </div>
  );
};

export default WorkspaceDetails;

