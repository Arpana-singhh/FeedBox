"use client";

import Link from "next/link";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Input, Button } from "antd";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import toast from "react-hot-toast";

// ── Yup validation schema ─────────────────────────────────────────────────────
const forgotSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

export default function ForgotPasswordPage() {

  const handleSubmit = async (
    values: { email: string },
    { setSubmitting, resetForm }: { setSubmitting: (v: boolean) => void; resetForm: () => void }
  ) => {
    try {
      // Firebase sends the reset email — no backend needed
      await sendPasswordResetEmail(auth, values.email);

      toast.success("Reset link sent! Check your inbox.", { id: "auth-toast", duration: Infinity });
      resetForm();

    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error?.message || "Failed to send reset link. Try again.", { id: "auth-toast" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fb-auth-wrapper">
      <div className="fb-auth-card">

        {/* Brand */}
        <div className="fb-auth-brand">
          <a href="/" className="fb-brand">Feed<span>Box</span></a>
          <p className="fb-auth-tagline">Reset your password</p>
        </div>

        <Formik
          initialValues={{ email: "" }}
          validationSchema={forgotSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form>

              <div className="fb-form-group">
                <label htmlFor="email">Email address</label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  size="large"
                  placeholder="you@example.com"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  status={touched.email && errors.email ? "error" : ""}
                  autoComplete="email"
                />
                {touched.email && errors.email && (
                  <small className="text-danger">{errors.email}</small>
                )}
              </div>

              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={isSubmitting}
              >
                Send Reset Link
              </Button>

              <p className="fb-auth-footer">
                Remember your password?{" "}
                <Link href="/login">Sign in</Link>
              </p>

            </Form>
          )}
        </Formik>

      </div>
    </div>
  );
}
