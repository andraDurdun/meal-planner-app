export const BASE_URL = "http://localhost:8080/meal-planner/api";
export const MEALS_ENDPOINT = "/meals";
export const MEAL_BY_ID_ENDPOINT = "/meals/:id";

export const urlWithPathVariable = (url: string, id: string): string => {
  return url.replace(":id", id);
};
