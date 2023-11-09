import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Meal {
  id: number;
  name: String;
}

export default function MealPage() {
  const navigate = useNavigate();
  const [meals, setMeals] = useState<Meal[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const endpointUrl = "http://localhost:8080/meal-planner/api/meals";
    fetch(endpointUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Authentication failed");
        }
        return response.json();
      })
      .then((responseData) => {
        setMeals(responseData.content);
        console.log(responseData);
      })
      .catch((error) => console.log(error));
  }, [navigate]);
  return <div>{meals && meals.map((meal) => <div key={meal.id}>{meal.name}</div>)}</div>;
}
