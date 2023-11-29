export const BASE_URL = "http://localhost:8080/meal-planner/api";
export const MEALS_ENDPOINT = "/meals";
export const MEALS_WITH_PAGINATION_ENDPOINT =
  "/meals?page=:page&pageSize=:pageSize";
export const MEAL_BY_ID_ENDPOINT = "/meals/:id";
export const USERS_ME_ENDPOINT = "/users/me";
export const SING_IN_ENDPOINT = "/auth/signin";
export const SIGN_UP_ENDPOINT = "/auth/signup";

export const urlWithPathVariable = (url: string, id: string): string => {
  return url.replace(":id", id);
};

export const urlWithPagination = (
  url: string,
  page: string,
  pageSize: string,
): string => {
  return url.replace(":page", page).replace(":pageSize", pageSize);
};
