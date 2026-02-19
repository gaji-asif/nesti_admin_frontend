import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import LogInForm from "../../components/auth/LogInForm";

export default function LogIn() {
  return (
    <>
      <PageMeta
        title="Nesti — Log In"
        description="Log in to the Nesti admin dashboard"
      />
      <AuthLayout>
        <LogInForm />
      </AuthLayout>
    </>
  );
}
