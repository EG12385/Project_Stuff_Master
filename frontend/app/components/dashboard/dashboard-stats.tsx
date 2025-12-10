import React from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "../ui/card";
import { 
  StatsCardProps, 
  TaskTrendsData, 
  ProjectStatusData, 
  TaskPriorityData, 
  WorkspaceProductivityData 
} from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface DashboardStatsProps {
  stats?: StatsCardProps;
  taskTrendsData?: TaskTrendsData[];
  projectStatusData?: ProjectStatusData[];
  taskPriorityData?: TaskPriorityData[];
  workspaceProductivityData?: WorkspaceProductivityData[];
}

// Safe default stats
const DEFAULT_STATS: StatsCardProps = {
  totalProjects: 0,
  totalTasks: 0,
  totalProjectInProgress: 0,
  totalTaskCompleted: 0,
  totalTaskToDo: 0,
  totalTaskInProgress: 0,
  totalOverdueTasks: 0,
};

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#6b7280"];

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  stats = DEFAULT_STATS,
  taskTrendsData = [],
  projectStatusData = [],
  taskPriorityData = [],
  workspaceProductivityData = [],
}) => {
  return (
    <div className="space-y-6">
      {/* Key Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Projects</CardTitle>
          </CardHeader>
          <CardContent>{stats.totalProjects}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>{stats.totalTasks}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tasks Completed</CardTitle>
          </CardHeader>
          <CardContent>{stats.totalTaskCompleted}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Overdue Tasks</CardTitle>
          </CardHeader>
          <CardContent>{stats.totalOverdueTasks}</CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Task Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Task Trends (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={taskTrendsData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" stackId="a" fill="#10b981" />
                <Bar dataKey="inProgress" stackId="a" fill="#3b82f6" />
                <Bar dataKey="toDo" stackId="a" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Project Status */}
        <Card>
          <CardHeader>
            <CardTitle>Project Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={projectStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Task Priority */}
        <Card>
          <CardHeader>
            <CardTitle>Task Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={taskPriorityData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {taskPriorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Workspace Productivity */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Workspace Productivity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={workspaceProductivityData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="#10b981" />
                <Bar dataKey="total" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

