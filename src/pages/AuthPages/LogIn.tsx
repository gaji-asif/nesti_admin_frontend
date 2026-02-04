import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import LogInForm from "../../components/auth/LogInForm";

export default function LogIn() {
  return (
    <>
      <PageMeta
        title="React.js LogIn Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js LogIn Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <AuthLayout>
        <LogInForm />
      </AuthLayout>
    </>
  );
}
