import Header from "../components/Header";
import Login from "../components/Login";

export default function LoginPage() {
  return (
    <div className="max-w-md w-full space-y-8">
      <Header
        heading="Login to your account"
        paragraph="Don't have an account yet? "
        linkName="Signup"
        linkUrl="/signup"
      />
      <Login />
    </div>
  );
}
