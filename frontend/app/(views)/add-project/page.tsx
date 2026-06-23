"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { insertProject } from "@/services/projectService";
import ProjectForm, { type ProjectFormValues } from "@/app/components/ProjectForm/ProjectForm";

const empty: ProjectFormValues = { name: "", key: "", description: "", type: "public", projectUrl: "" };

export default function AddProjectPage() {
  const router = useRouter();

  const handleSubmit = async (
    values: ProjectFormValues,
    { setSubmitting }: { setSubmitting: (v: boolean) => void }
  ) => {
    try {
      await insertProject({
        name       : values.name.trim(),
        key        : values.key.trim(),
        description: values.description.trim(),
        type       : values.type,
        projectUrl : values.projectUrl?.trim() || undefined,
      });
      toast.success("Project created successfully!", { id: "project-toast" });
      router.push("/");
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error?.message || "Failed to create project.", { id: "project-toast" });
    } finally {
      setSubmitting(false);
    }
  };

  return <ProjectForm initialValues={empty} onSubmit={handleSubmit} mode="add" />;
}
