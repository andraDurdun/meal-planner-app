import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

interface MealResponse {
  content: Meal[];
  page: number;
  pageSize: number;
  totalNumberOfElements: number;
}
interface Meal {
  id: number;
  name: String;
  calories: number;
  date: String;
  time: String;
}

export default function MealPage() {
  const navigate = useNavigate();
  const [mealResponse, setMealResponse] = useState<MealResponse>();
  const [searchParams, setSearchParams] = useSearchParams({
    page: "0",
    pageSize: "2",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    console.log(searchParams.get("pageSize"));
    const page = parseInt(searchParams.get("page") || "0");
    const pageSize = parseInt(searchParams.get("pageSize") || "2");

    const endpointUrl = `http://localhost:8080/meal-planner/api/meals?page=${page}&pageSize=${pageSize}`;
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
        setMealResponse(responseData);
        console.log(responseData);
      })
      .catch((error) => console.log(error));
  }, [navigate, searchParams]);

  const handlePreviousPage = () => {
    let page = parseInt(searchParams.get("page") || "0");
    if (page > 0) {
      const newPage = page - 1;
      const pageSize = parseInt(searchParams.get("pageSize") || "2");
      setSearchParams({
        page: newPage.toString(),
        pageSize: pageSize.toString(),
      });
    }
  };

  const handleNextPage = () => {
    let page = parseInt(searchParams.get("page") || "0");
    const pageSize = parseInt(searchParams.get("pageSize") || "2");
    if (
      mealResponse &&
      (page + 1) * pageSize < mealResponse.totalNumberOfElements
    ) {
      const newPage = page + 1;
      setSearchParams({
        page: newPage.toString(),
        pageSize: pageSize.toString(),
      });
    }
  };

  return (
    <div>
      {mealResponse?.content.map((meal) => (
        <div key={meal.id} className="flex">
          <div className="p-2">{meal.name}</div>
          <div className="p-2">{meal.calories}</div>
          <div className="p-2">{meal.date}</div>
          <div className="p-2">{meal.time}</div>
        </div>
      ))}
      <div className="flex">
        <div onClick={handlePreviousPage}>{"<"}</div>
        <div>{mealResponse && mealResponse?.page + 1}</div>
        <div onClick={handleNextPage}>{">"}</div>
      </div>
    </div>
  );
}
