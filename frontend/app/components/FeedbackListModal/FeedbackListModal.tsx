"use client";

import { useEffect, useState } from "react";
import { Modal } from "antd";
import { getProjectFeedbacks } from "@/models/feedbackModel";
import type { Feedback } from "@/services/feedbackService";
import type { Project } from "@/services/projectService";
import { getInitials } from "@/utils/helper";
import { StarDisplay } from "@/utils/feedbackUtils";

type Props = {
  project : Project | null;
  onClose : () => void;
};

export default function FeedbackListModal({ project, onClose }: Props) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading,   setLoading]   = useState(false);

  useEffect(() => {
    if (!project) return;

    setLoading(true);
    setFeedbacks([]);

    getProjectFeedbacks(project.key)
      .then(setFeedbacks)
      .finally(() => setLoading(false));
  }, [project]);

  return (
    <Modal
      open={!!project}
      onCancel={onClose}
      footer={null}
      centered
      width={640}
      title={
        <div>
          <div style={{ fontWeight: 600, fontSize: "1rem" }}>{project?.name}</div>
          <div style={{ fontWeight: 400, fontSize: "0.8rem", color: "#6B7280" }}>
            {loading ? "Loading..." : `${feedbacks.length} response${feedbacks.length !== 1 ? "s" : ""}`}
          </div>
        </div>
      }
    >
      <div style={{ maxHeight: 480, overflowY: "auto", paddingRight: 4 }}>

        {loading && (
          <div className="fb-empty" style={{ padding: "2rem 0" }}>
            <div className="fb-empty-desc">Loading feedbacks...</div>
          </div>
        )}

        {!loading && feedbacks.length === 0 && (
          <div className="fb-empty" style={{ padding: "2rem 0" }}>
            <div className="fb-empty-icon">💬</div>
            <div className="fb-empty-title">No feedback yet</div>
            <div className="fb-empty-desc">No one has submitted feedback for this project.</div>
          </div>
        )}

        {!loading && feedbacks.length > 0 && (
          <div className="d-flex flex-column gap-3 mt-2">
            {feedbacks.map((fb) => (
              <div key={fb.feedbackId} className="fb-feedback-card">
                <div className="fb-feedback-header">
                  <div className="fb-feedback-user">
                    <div className="fb-avatar">{getInitials(fb.userName)}</div>
                    <div>
                      <div className="fb-feedback-name">{fb.userName}</div>
                      <div className="fb-feedback-date">
                        {fb.createdAt
                          ? new Date((fb.createdAt as { seconds: number }).seconds * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                          : "Just now"}
                      </div>
                    </div>
                  </div>
                  <StarDisplay rating={fb.rating} />
                </div>
                <p className="fb-feedback-msg">{fb.message}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </Modal>
  );
}
