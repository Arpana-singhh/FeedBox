"use client";

import Link from "next/link";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Input, Select, Button } from "antd";

export type ProjectFormValues = {
  name       : string;
  key        : string;
  description: string;
  type       : "public" | "private";
  projectUrl : string;
};

type Props = {
  initialValues : ProjectFormValues;
  onSubmit      : (values: ProjectFormValues, helpers: { setSubmitting: (v: boolean) => void }) => Promise<void>;
  mode          : "add" | "edit";
};

const projectSchema = Yup.object({
  name       : Yup.string().min(2, "Name must be at least 2 characters").required("Project name is required"),
  key        : Yup.string()
    .min(2, "Key must be at least 2 characters")
    .matches(/^[a-z0-9-]+$/, "Key can only contain lowercase letters, numbers, and hyphens")
    .required("Project key is required"),
  description: Yup.string().min(10, "Description must be at least 10 characters").required("Description is required"),
  type       : Yup.string().oneOf(["public", "private"]).required("Type is required"),
  projectUrl : Yup.string().url("Enter a valid URL (e.g. https://myapp.vercel.app)").nullable().optional(),
});

export default function ProjectForm({ initialValues, onSubmit, mode }: Props) {
  const isEdit = mode === "edit";

  return (
    <div className="fb-auth-wrapper">
      <div className="fb-auth-card" style={{ maxWidth: 500 }}>

        <div className="fb-auth-brand">
          <a href="/" className="fb-brand">Feed<span>Box</span></a>
          <p className="fb-auth-tagline">{isEdit ? "Edit project" : "Create a new project"}</p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={projectSchema}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting, setFieldValue }) => (
            <Form>

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
                  disabled={isEdit}
                />
                {touched.key && errors.key && (
                  <small className="text-danger">{errors.key}</small>
                )}
                {isEdit && (
                  <small style={{ color: "#9CA3AF" }}>Project key cannot be changed after creation.</small>
                )}
                {!isEdit && values.key && !errors.key && (
                  <small style={{ color: "#6B7280" }}>
                    Share link: <code>/feedback?key={values.key}</code>
                  </small>
                )}
              </div>

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

              <div className="fb-form-group">
                <label htmlFor="projectUrl">Project URL <span style={{ color: "#9CA3AF", fontWeight: 400 }}>(optional)</span></label>
                <Input
                  id="projectUrl"
                  name="projectUrl"
                  size="large"
                  placeholder="e.g. https://myapp.vercel.app"
                  value={values.projectUrl}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  status={touched.projectUrl && errors.projectUrl ? "error" : ""}
                />
                {touched.projectUrl && errors.projectUrl && (
                  <small className="text-danger">{errors.projectUrl}</small>
                )}
              </div>

              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={isSubmitting}
              >
                {isEdit ? "Save Changes" : "Create Project"}
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
