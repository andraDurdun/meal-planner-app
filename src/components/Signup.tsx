import { signupFields } from "../constants/formFields";
import { ChangeEvent, FormEvent, useState } from "react";
import Input from "./Input";
import FormAction from "./FormAction";
import { axiosPublicInstance } from "../api/apiService";
import { SIGN_UP_ENDPOINT } from "../api/apiConstants";
import { useNavigate } from "react-router-dom";

interface Field {
  labelText: string;
  labelFor: string;
  name: string;
  type: string;
  autoComplete: string;
  isRequired: boolean;
  placeholder: string;
}

const fields: Field[] = signupFields;
let fieldsState: Record<string, string> = {};
fields.forEach((field) => (fieldsState[field.name] = ""));

export default function Signup() {
  const [signupState, setSignupState] = useState(fieldsState);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSignupState({ ...signupState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signupUser();
  };

  const signupUser = () => {
    const requestBody = JSON.stringify(signupState);
    axiosPublicInstance
      .post(SIGN_UP_ENDPOINT, requestBody)
      .then(() => navigate("/"))
      .catch((error) => {
        console.log("Sign up failed ", error);
      });
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div>
        {fields.map((field) => (
          <Input
            key={field.name}
            handleChange={handleChange}
            value={signupState[field.name]}
            labelText={field.labelText}
            labelFor={field.labelFor}
            name={field.name}
            type={field.type}
            isRequired={field.isRequired}
            placeholder={field.placeholder}
          />
        ))}
      </div>
      <FormAction text="Signup" />
    </form>
  );
}
