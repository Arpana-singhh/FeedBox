"use client";

import { useEffect, useState } from "react";
import { getProjects } from "@/controllers/projectController";
import type { Project } from "@/services/projectService";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

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
                    </div>

                    <h3 className="fb-card-title">{project.name}</h3>
                    <p className="fb-card-desc" style={{ fontFamily: "monospace", fontSize: "0.8rem" }}>
                      /feedback?key={project.key}
                    </p>

                    <div className="fb-card-footer">
                      <a
                        href={`/feedback?key=${project.key}`}
                        className="fb-btn fb-btn-primary fb-btn-sm"
                      >
                        Share Feedback
                      </a>
                      <a
                        href={`/dashboard?key=${project.key}`}
                        className="fb-btn fb-btn-ghost fb-btn-sm"
                      >
                        View Responses
                      </a>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>
    </>
  );
}
