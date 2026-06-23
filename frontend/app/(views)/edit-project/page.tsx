"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getProjectById, editProject } from "@/models/projectModel";
import ProjectForm, { type ProjectFormValues } from "@/app/components/ProjectForm/ProjectForm";

export default function EditProjectPage() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const projectId    = searchParams.get("id") || "";

  const [initialValues, setInitialValues] = useState<ProjectFormValues | null>(null);

  // Load existing project data to pre-fill the form
  useEffect(() => {
    if (!projectId) {
      toast.error("No project ID provided.", { id: "project-toast" });
      router.push("/");
      return;
    }

    getProjectById(projectId).then((project) => {
      if (!project) {
        toast.error("Project not found.", { id: "project-toast" });
        router.push("/");
        return;
      }
      setInitialValues({
        name       : project.name,
        key        : project.key,
        description: project.description,
        type       : project.type,
        projectUrl : project.projectUrl || "",
      });
    });
  }, [projectId, router]);

  const handleSubmit = async (
    values: ProjectFormValues,
    { setSubmitting }: { setSubmitting: (v: boolean) => void }
  ) => {
    try {
      await editProject(projectId, {
        name       : values.name.trim(),
        key        : values.key.trim(),
        description: values.description.trim(),
        type       : values.type,
        projectUrl : values.projectUrl?.trim() || undefined,
      });
      toast.success("Project updated successfully!", { id: "project-toast" });
      router.push("/");
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error?.message || "Failed to update project.", { id: "project-toast" });
    } finally {
      setSubmitting(false);
    }
  };

  if (!initialValues) {
    return (
      <div className="fb-empty" style={{ marginTop: "4rem" }}>
        <div className="fb-empty-desc">Loading project...</div>
      </div>
    );
  }

  return <ProjectForm initialValues={initialValues} onSubmit={handleSubmit} mode="edit" />;
}
