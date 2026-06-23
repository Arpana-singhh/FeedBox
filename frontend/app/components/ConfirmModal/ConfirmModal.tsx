"use client";

import { Modal, Button } from "antd";

type Props = {
  open       : boolean;
  title      : string;
  description: string;
  loading    : boolean;
  onConfirm  : () => void;
  onCancel   : () => void;
};

export default function ConfirmModal({ open, title, description, loading, onConfirm, onCancel }: Props) {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      closable={!loading}
      mask={{ closable: !loading }}
      width={420}
    >
      <div style={{ padding: "8px 0 4px" }}>
        <h3 style={{ margin: "0 0 8px", fontSize: "1.05rem", fontWeight: 600 }}>{title}</h3>
        <p style={{ margin: "0 0 24px", color: "#6B7280", fontSize: "0.9rem" }}>{description}</p>

        <div className="d-flex justify-content-end gap-2">
          <Button onClick={onCancel} disabled={loading}>
            No
          </Button>
          <Button
            type="primary"
            danger
            loading={loading}
            onClick={onConfirm}
          >
            Yes, Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
