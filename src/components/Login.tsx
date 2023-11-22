import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { loginFields } from "../constants/formFields";
import Input from "./Input";
import FormAction from "./FormAction";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

interface Field {
  labelText: string;
  labelFor: string;
  name: string;
  type: string;
  autoComplete: string;
  isRequired: boolean;
  placeholder: string;
}

const fields: Field[] = loginFields;
let fieldsState: Record<string, string> = {};
fields.forEach((field) => (fieldsState[field.name] = ""));

export default function Login() {
  const [loginState, setLoginState] = useState(fieldsState);
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginState({ ...loginState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    authenticateUser();
  };

  const authenticateUser = () => {
    const endpointUrl = "http://localhost:8080/meal-planner/api/auth/signin";
    fetch(endpointUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginState),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Authentication failed");
        }
        return response.json();
      })
      .then((responseData) => {
        if (responseData.token) {
          setUser({ ...user, token: responseData.token });
          localStorage.setItem("token", responseData.token);
          navigate("/meals");
        }
        console.log("Authentication successful");
      })
      .catch((error) => console.log(error));
    console.log("auth user");
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="-space-y-px">
        {fields.map((field) => (
          <Input
            key={field.name}
            handleChange={handleChange}
            value={loginState[field.name]}
            labelText={field.labelText}
            labelFor={field.labelFor}
            name={field.name}
            type={field.type}
            isRequired={field.isRequired}
            placeholder={field.placeholder}
          />
        ))}
      </div>
      <FormAction text="Login" />
    </form>
  );
}
