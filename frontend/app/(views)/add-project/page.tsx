"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Input, Select, Button } from "antd";
import toast from "react-hot-toast";
import { insertProject } from "@/services/projectService";

// ── Validation schema ─────────────────────────────────────────────────────────
const projectSchema = Yup.object({
  name       : Yup.string().min(2, "Name must be at least 2 characters").required("Project name is required"),
  key        : Yup.string()
    .min(2, "Key must be at least 2 characters")
    .matches(/^[a-z0-9-]+$/, "Key can only contain lowercase letters, numbers, and hyphens")
    .required("Project key is required"),
  description: Yup.string().min(10, "Description must be at least 10 characters").required("Description is required"),
  type       : Yup.string().oneOf(["public", "private"]).required("Type is required"),
});

export default function AddProjectPage() {
  const router = useRouter();

  const handleSubmit = async (
    values: { name: string; key: string; description: string; type: "public" | "private" },
    { setSubmitting }: { setSubmitting: (v: boolean) => void }
  ) => {
    try {
      await insertProject({
        name       : values.name.trim(),
        key        : values.key.trim(),
        description: values.description.trim(),
        type       : values.type,
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

  return (
    <div className="fb-auth-wrapper">
      <div className="fb-auth-card" style={{ maxWidth: 500 }}>

        {/* Header */}
        <div className="fb-auth-brand">
          <a href="/" className="fb-brand">Feed<span>Box</span></a>
          <p className="fb-auth-tagline">Create a new project</p>
        </div>

        <Formik
          initialValues={{ name: "", key: "", description: "", type: "public" as "public" | "private" }}
          validationSchema={projectSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting, setFieldValue }) => (
            <Form>

              {/* Project Name */}
              <div className="fb-form-group">
                <label htmlFor="name">Project Name</label>
                <Input
                  id="name"
                  name="name"
                  size="large"
                  placeholder="e.g. Notify App"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  status={touched.name && errors.name ? "error" : ""}
                />
                {touched.name && errors.name && (
                  <small className="text-danger">{errors.name}</small>
                )}
              </div>

              {/* Project Key */}
              <div className="fb-form-group">
                <label htmlFor="key">Project Key</label>
                <Input
                  id="key"
                  name="key"
                  size="large"
                  placeholder="e.g. notify-app"
                  value={values.key}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  status={touched.key && errors.key ? "error" : ""}
                  prefix={<span style={{ color: "#9CA3AF", fontSize: "0.8rem" }}>/feedback?key=</span>}
                />
                {touched.key && errors.key && (
                  <small className="text-danger">{errors.key}</small>
                )}
                {values.key && !errors.key && (
                  <small style={{ color: "#6B7280" }}>
                    Share link: <code>/feedback?key={values.key}</code>
                  </small>
                )}
              </div>

              {/* Description */}
              <div className="fb-form-group">
                <label htmlFor="description">Description</label>
                <Input.TextArea
                  id="description"
                  name="description"
                  size="large"
                  placeholder="What is this project about?"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  status={touched.description && errors.description ? "error" : ""}
                  rows={3}
                />
                {touched.description && errors.description && (
                  <small className="text-danger">{errors.description}</small>
                )}
              </div>

              {/* Project Type */}
              <div className="fb-form-group">
                <label htmlFor="type">Project Type</label>
                <Select
                  id="type"
                  size="large"
                  style={{ width: "100%" }}
                  value={values.type}
                  onChange={(val) => setFieldValue("type", val)}
                  options={[
                    { value: "public",  label: "Public — anyone with the link can submit feedback" },
                    { value: "private", label: "Private — only invited users can submit feedback" },
                  ]}
                />
                {touched.type && errors.type && (
                  <small className="text-danger">{errors.type}</small>
                )}
              </div>

              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={isSubmitting}
              >
                Create Project
              </Button>

              <p className="fb-auth-footer">
                <Link href="/">← Back to Projects</Link>
              </p>

            </Form>
          )}
        </Formik>

      </div>
    </div>
  );
}
