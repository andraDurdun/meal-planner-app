import Header from "../components/Header";
import Signup from "../components/Signup";

export default function SignupPage() {
  return (
    <div>
      <Header
        heading="Signup to create a new account"
        paragraph="Already have an account?"
        linkName="Login"
        linkUrl="/"
      />
      <Signup />
    </div>
  );
}
