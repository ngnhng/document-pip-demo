"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Folder, FileText } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";

// Define types for folders and files
type ProjectItemType = "folder" | "file";

interface BaseProjectItem {
  id: string;
  name: string;
  type: ProjectItemType;
}

interface ProjectFile extends BaseProjectItem {
  type: "file";
  description: string;
  content: string;
  lastUpdated: string;
}

interface ProjectFolder extends BaseProjectItem {
  type: "folder";
  children: ProjectItem[]; // Folders can contain other items
}

type ProjectItem = ProjectFile | ProjectFolder;

// Key for localStorage
const PROJECTS_STORAGE_KEY = "projects.data";

// Default project data (used when no saved data exists)
const defaultProjectsData: ProjectItem[] = [
  {
    id: "project-alpha-folder",
    name: "Project Alpha",
    type: "folder",
    children: [
      {
        id: "project-alpha-readme",
        name: "README.md",
        type: "file",
        description: "Project overview and setup instructions",
        content:
          "## Project Alpha\n\nThis is a web development project using React and Next.js.\n\n### Setup\n1. Clone the repo\n2. Run `pnpm install`\n3. Run `pnpm dev`",
        lastUpdated: "2025-04-16",
      },
      {
        id: "project-alpha-notes",
        name: "Development Notes",
        type: "file",
        description: "Ongoing development notes",
        content:
          "**TODO:**\n- Implement authentication\n- Add database integration\n- Design responsive UI components\n\n**Meeting Notes (2025-04-15):**\n- Discussed API design\n- Agreed on state management library",
        lastUpdated: "2025-04-15",
      },
    ],
  },
  {
    id: "research-notes-folder",
    name: "Research Notes",
    type: "folder",
    children: [
      {
        id: "research-ml",
        name: "Machine Learning",
        type: "file",
        description: "Notes on ML concepts",
        content:
          "### Transformers\n- Attention mechanism\n- Vision Transformers (ViT)\n\n### Reinforcement Learning\n- Q-Learning\n- Policy Gradients",
        lastUpdated: "2025-04-27",
      },
      {
        id: "research-papers",
        name: "Papers",
        type: "folder", // Nested folder
        children: [
          {
            id: "paper-transformers-cv",
            name: "Transformers in CV.pdf",
            type: "file",
            description: "Paper summary",
            content:
              "Summary of the paper 'An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale'. Key takeaway: ViT models can achieve state-of-the-art results on image classification tasks.",
            lastUpdated: "2025-04-20",
          },
        ],
      },
    ],
  },
  {
    id: "widget-demo",
    name: "Widget Demo Area",
    type: "file", // This is a top-level file
    description: "Testing area for widget features",
    content:
      "This area is dedicated to testing widget functionality. You can select text here to test the insight feature of the widget.\n\nThe widget will process selected text and provide a summary or analysis. Try selecting this paragraph to see the feature in action.\n\nYou can also minimize the widget by clicking the minimize button, or use the picture-in-picture feature for a floating experience.",
    lastUpdated: "2025-04-30",
  },
];

// Recursive function to render sidebar items
const renderSidebarItem = (
  item: ProjectItem,
  selectedProject: ProjectFile | null,
  setSelectedProject: (project: ProjectFile | null) => void
): React.ReactNode => {
  if (item.type === "folder") {
    return (
      <SidebarGroup key={item.id} className="p-0">
        <SidebarMenuItem>
          <SidebarMenuButton className="font-medium">
            <Folder className="size-4" />
            <span>{item.name}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuSub>
          {item.children.map((child) =>
            renderSidebarItem(child, selectedProject, setSelectedProject)
          )}
        </SidebarMenuSub>
      </SidebarGroup>
    );
  } else {
    // item.type === 'file'
    return (
      <SidebarMenuSubItem key={item.id}>
        <SidebarMenuSubButton
          onClick={() => setSelectedProject(item)}
          isActive={selectedProject?.id === item.id}
          className="pl-4"
        >
          <FileText className="size-3.5" />
          <span>{item.name}</span>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    );
  }
};

export default function Home() {
  // State for projects data
  const [projectsData, setProjectsData] = useState<ProjectItem[]>([]);
  // State for selected file
  const [selectedProject, setSelectedProject] = useState<ProjectFile | null>(
    null
  );
  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);
  // State for content being edited
  const [editContent, setEditContent] = useState("");

  // Load projects from localStorage on initial mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedProjects = localStorage.getItem(PROJECTS_STORAGE_KEY);
        if (savedProjects) {
          const parsedProjects = JSON.parse(savedProjects);
          setProjectsData(parsedProjects);
          console.log("Loaded projects from localStorage");
        } else {
          // If no saved projects, use defaults and save them
          setProjectsData(defaultProjectsData);
          localStorage.setItem(
            PROJECTS_STORAGE_KEY,
            JSON.stringify(defaultProjectsData)
          );
          console.log("No saved projects found, using defaults");
        }
      } catch (error) {
        console.error("Error loading projects:", error);
        // Fall back to defaults if there's an error
        setProjectsData(defaultProjectsData);
      }
    }
  }, []);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    if (projectsData.length > 0 && typeof window !== "undefined") {
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projectsData));
      console.log("Saved projects to localStorage");
    }
  }, [projectsData]);

  // Notify widget when project selection changes
  useEffect(() => {
    if (selectedProject) {
      // Send message to widget (both main window and PiP if active)
      window.postMessage(
        {
          type: "current-project-changed",
          projectId: selectedProject.id,
        },
        "*"
      );
    }
  }, [selectedProject]);

  // Function to update file content when edited
  const updateFileContent = (fileId: string, newContent: string) => {
    // Create a deep copy to avoid direct state mutations
    const updateProjects = (items: ProjectItem[]): ProjectItem[] => {
      return items.map((item) => {
        if (item.type === "folder") {
          // Recursively update children if this is a folder
          return {
            ...item,
            children: updateProjects(item.children),
          };
        } else if (item.type === "file" && item.id === fileId) {
          // Update this file if it matches the ID
          return {
            ...item,
            content: newContent,
            lastUpdated: new Date().toISOString().split("T")[0], // Update date to today
          };
        }
        // Return unchanged item
        return item;
      });
    };

    const updatedProjects = updateProjects(projectsData);
    setProjectsData(updatedProjects);

    // If the selected project is the one being updated, update it too
    if (selectedProject && selectedProject.id === fileId) {
      setSelectedProject({
        ...selectedProject,
        content: newContent,
        lastUpdated: new Date().toISOString().split("T")[0],
      });
    }
  };

  // Enter edit mode
  const handleEdit = () => {
    if (selectedProject) {
      setEditContent(selectedProject.content);
      setIsEditing(true);
    }
  };

  // Save edits
  const handleSave = () => {
    if (selectedProject) {
      updateFileContent(selectedProject.id, editContent);
      setIsEditing(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
    setEditContent("");
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen font-[family-name:var(--font-geist-sans)]">
        <Sidebar side="left" variant="inset" collapsible="icon">
          <SidebarHeader className="p-2">
            <h2 className="font-semibold text-lg group-data-[collapsible=icon]:hidden">
              Projects
            </h2>
          </SidebarHeader>
          <SidebarContent className="p-0">
            <SidebarMenu className="p-2">
              {projectsData.map((item) =>
                renderSidebarItem(item, selectedProject, setSelectedProject)
              )}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-2">{/* Footer content */}</SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <header className="flex justify-between items-center p-4 border-b sticky top-0 bg-background z-10">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="md:hidden" />
              <Image
                className="dark:invert"
                src="/next.svg"
                alt="Next.js logo"
                width={100}
                height={20}
                priority
              />
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm h-8 px-3"
                href="/about"
              >
                Go to About Page
              </Link>
            </div>
          </header>

          <main className="flex-grow p-6">
            {selectedProject ? (
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold">
                      {selectedProject.name}
                    </h1>
                    <p className="text-muted-foreground">
                      {selectedProject.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Last updated: {selectedProject.lastUpdated}
                    </p>
                  </div>
                  {!isEditing && (
                    <Button variant="outline" size="sm" onClick={handleEdit}>
                      Edit
                    </Button>
                  )}
                </div>
                <div className="border-t pt-4 mt-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <textarea
                        className="w-full h-60 p-3 text-sm border rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancel}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={handleSave}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                      {selectedProject.content}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold mb-4">
                  Select a Project File
                </h1>
                <p className="text-muted-foreground">
                  Click on a file in the sidebar to view its notes and details.
                  The widget is still available for text insights and project
                  idea capture.
                </p>
                <p className="text-sm text-muted-foreground mt-6">
                  Try dragging the widget, minimizing it, and then navigating to
                  the About page. The widget will maintain its state and
                  position across navigations. Select text here to test the
                  widget's insight feature.
                </p>
                <a
                  className="mt-4 inline-flex rounded-md border border-solid border-black/[.08] dark:border-white/[.145] transition-colors items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm h-9 px-4"
                  href="https://nextjs.org/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read Next.js docs
                </a>
              </>
            )}
          </main>

          <footer className="p-4 border-t text-center">
            <p className="text-sm text-muted-foreground">
              The widget persists its state using localStorage and React
              Context. Project ideas are stored in localStorage.
            </p>
          </footer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
