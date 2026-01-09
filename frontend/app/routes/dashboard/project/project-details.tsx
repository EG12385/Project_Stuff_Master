import { BackButton } from "@/components/back-button";
import { Loader } from "@/components/loader";
import { CreateTaskDialog } from "@/components/task/create-task-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UseProjectQuery } from "@/hooks/use-project";
import { getProjectProgress } from "@/lib";
import { cn } from "@/lib/utils";
import type { Project, Task } from "@/types";
import { TaskStatus } from "@/types";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";

const ProjectDetails = () => {
  const { projectId, workspaceId } = useParams();
  const navigate = useNavigate();

  const [isCreateTask, setIsCreateTask] = useState(false);
  const [taskFilter, setTaskFilter] = useState<TaskStatus | "All">("All");

  const { data, isLoading } = UseProjectQuery(projectId!);

  if (isLoading) return <Loader />;
  if (!data?.project) return <div>No project found</div>;

  const { project, tasks } = data;
  const projectProgress = getProjectProgress(tasks);

  const filteredTasks =
    taskFilter === "All"
      ? tasks
      : tasks.filter((t: { status: TaskStatus; }) => t.status === taskFilter);

  const handleTaskClick = (taskId: string) => {
    navigate(
      `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`
    );
  };

  return (
    <div className="space-y-8">
      <BackButton />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{project.title}</h1>
          {project.description && (
            <p className="text-sm text-muted-foreground">
              {project.description}
            </p>
          )}
        </div>

        <Button onClick={() => setIsCreateTask(true)}>Add Task</Button>
      </div>

      <Progress value={projectProgress} />

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all" onClick={() => setTaskFilter("All")}>
            All
          </TabsTrigger>
          <TabsTrigger
            value="todo"
            onClick={() => setTaskFilter(TaskStatus.TO_DO)}
          >
            To Do
          </TabsTrigger>
          <TabsTrigger
            value="in-progress"
            onClick={() => setTaskFilter(TaskStatus.IN_PROGRESS)}
          >
            In Progress
          </TabsTrigger>
          <TabsTrigger
            value="done"
            onClick={() => setTaskFilter(TaskStatus.DONE)}
          >
            Done
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <TaskGrid tasks={filteredTasks} onClick={handleTaskClick} />
        </TabsContent>
      </Tabs>

      <CreateTaskDialog
        open={isCreateTask}
        onOpenChange={setIsCreateTask}
        projectId={projectId!}
        projectMembers={project.members as any}
      />
    </div>
  );
};

export default ProjectDetails;

const TaskGrid = ({
  tasks,
  onClick,
}: {
  tasks: Task[];
  onClick: (id: string) => void;
}) => {
  if (tasks.length === 0)
    return <div className="text-muted-foreground">No tasks found</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <Card
          key={task._id}
          onClick={() => onClick(task._id)}
          className="cursor-pointer"
        >
          <CardHeader>
            <Badge>{task.status}</Badge>
          </CardHeader>
          <CardContent>
            <h4 className="font-semibold">{task.title}</h4>
            {task.dueDate && (
              <div className="text-xs flex items-center mt-2">
                <Calendar className="w-3 h-3 mr-1" />
                {format(new Date(task.dueDate), "MMM d, yyyy")}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
