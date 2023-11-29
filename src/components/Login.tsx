import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { loginFields } from "../constants/formFields";
import Input from "./Input";
import FormAction from "./FormAction";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { axiosPrivateInstance } from "../api/apiService";
import { SING_IN_ENDPOINT } from "../api/apiConstants";

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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginState({ ...loginState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    authenticateUser();
  };

  const authenticateUser = () => {
    const requestBody = JSON.stringify(loginState);

    axiosPrivateInstance
      .post(SING_IN_ENDPOINT, requestBody)
      .then((response) => {
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          navigate("/meals");
        }
      })
      .catch((error) => {
        console.log("Authentication failed ", error);
      });
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
