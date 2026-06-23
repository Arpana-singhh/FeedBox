"use client";

import { useEffect, useState } from "react";
import { getProjects, removeProject } from "@/models/projectModel";
import type { Project } from "@/services/projectService";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import ConfirmModal from "@/app/components/ConfirmModal/ConfirmModal";
import FeedbackListModal from "@/app/components/FeedbackListModal/FeedbackListModal";
import toast from "react-hot-toast";

export default function ProjectsPage() {
  const [projects,       setProjects]       = useState<Project[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [deleteTarget,    setDeleteTarget]    = useState<Project | null>(null);
  const [deleteLoading,   setDeleteLoading]   = useState(false);
  const [feedbackTarget,  setFeedbackTarget]  = useState<Project | null>(null);

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await removeProject(deleteTarget.projectId);
      setProjects((prev) => prev.filter((p) => p.projectId !== deleteTarget.projectId));
      toast.success(`"${deleteTarget.name}" deleted.`, { id: "project-toast" });
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete project.", { id: "project-toast" });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      {/* ── Hero ── */}
      <section className="fb-hero">
        <div className="container">
          <h1 className="fb-hero-title">
            Collect <span>smarter feedback</span><br />for every project
          </h1>
          <p className="fb-hero-subtitle">
            Share a link, let users rate and review, and see all responses in
            one clean dashboard — powered by Firebase.
          </p>
          <div className="d-flex gap-3 flex-wrap">
            <a href="/dashboard" className="fb-btn fb-btn-primary fb-btn-lg">
              View Dashboard
            </a>
            <a href="/add-project" className="fb-btn fb-btn-ghost fb-btn-lg">
              + Add Project
            </a>
          </div>
        </div>
      </section>

      {/* ── Projects grid ── */}
      <section className="fb-section">
        <div className="container">

          <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
            <div>
              <h2 className="fb-section-title mb-0">All Projects</h2>
              <p className="fb-section-subtitle mb-0">
                {loading ? "Loading..." : `${projects.length} projects · collecting feedback`}
              </p>
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="fb-empty">
              <div className="fb-empty-desc">Loading projects...</div>
            </div>
          )}

          {/* Empty state */}
          {!loading && projects.length === 0 && (
            <div className="fb-empty">
              <div className="fb-empty-icon">📁</div>
              <div className="fb-empty-title">No projects yet</div>
              <div className="fb-empty-desc mb-3">Create your first project to start collecting feedback.</div>
              <a href="/add-project" className="fb-btn fb-btn-primary">+ Add Project</a>
            </div>
          )}

          {/* Cards */}
          {!loading && projects.length > 0 && (
            <div className="row g-3">
              {projects.map((project) => (
                <div key={project.projectId} className="col-12 col-md-6 col-lg-4">
                  <div className="fb-card d-flex flex-column">

                    <div className="d-flex align-items-start justify-content-between mb-2">
                      <span className={`fb-badge ${project.type === "public" ? "fb-badge-success" : "fb-badge-gray"}`}>
                        {project.type}
                      </span>
                      <div className="action-icons d-flex gap-2">
                        <a href={`/edit-project?id=${project.projectId}`} className="fb-icon-btn" title="Edit project">
                          <FiEdit2 size={15} />
                        </a>
                        <button
                          className="fb-icon-btn fb-icon-btn-danger"
                          title="Delete project"
                          onClick={() => setDeleteTarget(project)}
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </div>

                    <h3 className="fb-card-title">{project.name}</h3>
                    <p className="fb-card-desc">
                      {project.description || "No description provided."}
                    </p>

                    <div className="fb-card-footer">
                      <a
                        href={project.type === "private" ? "/feedback" : `/feedback?key=${project.key}`}
                        className="fb-btn fb-btn-primary fb-btn-sm"
                      >
                        Share Feedback
                      </a>
                      <button
                        className="fb-btn fb-btn-ghost fb-btn-sm"
                        onClick={() => setFeedbackTarget(project)}
                      >
                        View Responses
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* ── Feedback List Modal ── */}
      <FeedbackListModal
        project={feedbackTarget}
        onClose={() => setFeedbackTarget(null)}
      />

      {/* ── Delete Confirm Modal ── */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Project"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
