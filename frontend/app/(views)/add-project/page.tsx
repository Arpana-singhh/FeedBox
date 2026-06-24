"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal, Button } from "antd";
import toast from "react-hot-toast";
import { FiCopy, FiCheck } from "react-icons/fi";
import { insertProject, type Project } from "@/services/projectService";
import ProjectForm, { type ProjectFormValues } from "@/app/components/ProjectForm/ProjectForm";

const empty: ProjectFormValues = { name: "", key: "", description: "", type: "public", projectUrl: "" };

export default function AddProjectPage() {
  const router = useRouter();
  const [created,   setCreated]   = useState<Project | null>(null);
  const [copied,    setCopied]    = useState(false);

  const handleSubmit = async (
    values: ProjectFormValues,
    { setSubmitting }: { setSubmitting: (v: boolean) => void }
  ) => {
    try {
      const project = await insertProject({
        name       : values.name.trim(),
        key        : values.key.trim(),
        description: values.description.trim(),
        type       : values.type,
        projectUrl : values.projectUrl?.trim() || undefined,
      });
      setCreated(project);
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error?.message || "Failed to create project.", { id: "project-toast" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopy = () => {
    if (!created) return;
    navigator.clipboard.writeText(created.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDone = () => {
    setCreated(null);
    router.push("/");
  };

  return (
    <>
      <ProjectForm initialValues={empty} onSubmit={handleSubmit} mode="add" />

      <Modal
        open={!!created}
        onCancel={handleDone}
        footer={null}
        centered
        width={460}
        closable
      >
        <div style={{ padding: "8px 0" }}>

          {/* Icon */}
          <div style={{ fontSize: "2.5rem", textAlign: "center", marginBottom: "0.75rem" }}>🎉</div>

          <h3 style={{ textAlign: "center", fontWeight: 700, fontSize: "1.1rem", margin: "0 0 4px" }}>
            Project Created!
          </h3>
          <p style={{ textAlign: "center", color: "#6B7280", fontSize: "0.875rem", margin: "0 0 1.5rem" }}>
            Share the key below to start collecting feedback for <strong>{created?.name}</strong>.
          </p>

          {/* Key box */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "#F9FAFB", border: "1.5px solid #E5E7EB",
            borderRadius: 10, padding: "0.75rem 1rem", marginBottom: "1rem",
          }}>
            <div>
              <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "#C3110C", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>Project Key</div>
              <code style={{ fontSize: "1rem", fontWeight: 700, color: "#111827", fontFamily: "monospace" }}>{created?.key}</code>
            </div>
            <button
              onClick={handleCopy}
              style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: copied ? "#10B981" : "#6B7280", fontWeight: 600, fontSize: "0.8rem" }}
            >
              {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          {/* Feedback URL */}
          <div style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 8, padding: "0.6rem 1rem", marginBottom: "1rem", fontSize: "0.8rem", color: "#6B7280" }}>
            Share link: <code style={{ color: "#111827" }}>/feedback?key={created?.key}</code>
          </div>

          {/* Private warning */}
          {created?.type === "private" && (
            <div style={{ background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 8, padding: "0.75rem 1rem", marginBottom: "1rem", fontSize: "0.85rem", color: "#92400E" }}>
              🔒 <strong>Private project</strong> — only people you share this key with can submit feedback. Don&apos;t lose it!
            </div>
          )}

          <Button type="primary" block size="large" onClick={handleDone}>
            Go to Projects
          </Button>

        </div>
      </Modal>
    </>
  );
}
