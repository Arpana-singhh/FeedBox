"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Input, Button } from "antd";
import { signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "@/lib/firebase";
import AuthService from "@/services/authService";
import toast from "react-hot-toast";

// ── Yup validation schema ─────────────────────────────────────────────────────
const registerSchema = Yup.object({
  name           : Yup.string().min(2, "Name must be at least 2 characters").required("Name is required"),
  email          : Yup.string().email("Invalid email").required("Email is required"),
  password       : Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
});

export default function RegisterPage() {
  const router = useRouter();

  const handleSubmit = async (
    values: { name: string; email: string; password: string; confirmPassword: string },
    { setSubmitting }: { setSubmitting: (v: boolean) => void }
  ) => {
    try {
      // Step 1 — Backend (Admin SDK) creates the user in Firebase
      await AuthService.register(values.name, values.email, values.password);

      // Step 2 — Sign in with Client SDK to get the user object (needed for sendEmailVerification)
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);

      // Step 3 — Send verification email via Firebase Client SDK
      await sendEmailVerification(userCredential.user);

      // Step 4 — Redirect to login with success message in query param
      router.push("/login?registered=true");

    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      const message = error?.response?.data?.message || error?.message || "Registration failed. Please try again.";
      toast.error(message, { id: "auth-toast" });
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
          <p className="fb-auth-tagline">Create your free account</p>
        </div>

        <Formik
          initialValues={{ name: "", email: "", password: "", confirmPassword: "" }}
          validationSchema={registerSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form>

              {/* Name */}
              <div className="fb-form-group">
                <label htmlFor="name">Full name</label>
                <Input
                  id="name"
                  name="name"
                  size="large"
                  placeholder="John Doe"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  status={touched.name && errors.name ? "error" : ""}
                  autoComplete="name"
                />
                {touched.name && errors.name && (
                  <small className="text-danger">{errors.name}</small>
                )}
              </div>

              {/* Email */}
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

              {/* Password */}
              <div className="fb-form-group">
                <label htmlFor="password">Password</label>
                <Input.Password
                  id="password"
                  name="password"
                  size="large"
                  placeholder="Min. 6 characters"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  status={touched.password && errors.password ? "error" : ""}
                  autoComplete="new-password"
                />
                {touched.password && errors.password && (
                  <small className="text-danger">{errors.password}</small>
                )}
              </div>

              {/* Confirm Password */}
              <div className="fb-form-group">
                <label htmlFor="confirmPassword">Confirm password</label>
                <Input.Password
                  id="confirmPassword"
                  name="confirmPassword"
                  size="large"
                  placeholder="Re-enter your password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  status={touched.confirmPassword && errors.confirmPassword ? "error" : ""}
                  autoComplete="new-password"
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <small className="text-danger">{errors.confirmPassword}</small>
                )}
              </div>

              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={isSubmitting}
              >
                Create Account
              </Button>

              <p className="fb-auth-footer">
                Already have an account?{" "}
                <Link href="/login">Sign in</Link>
              </p>

            </Form>
          )}
        </Formik>

      </div>
    </div>
  );
}
