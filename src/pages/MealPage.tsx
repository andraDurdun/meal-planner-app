import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  Button,
} from "@mui/material";
import { UserContext } from "../context/UserContext";
import { axiosPrivateInstance } from "../api/apiService";
import {
  MEAL_BY_ID_ENDPOINT,
  MEALS_ENDPOINT,
  MEALS_WITH_PAGINATION_ENDPOINT,
  urlWithPagination,
  urlWithPathVariable,
} from "../api/apiConstants";

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
  const user = useContext(UserContext);
  const [mealResponse, setMealResponse] = useState<MealResponse>();
  const [searchParams, setSearchParams] = useSearchParams({
    page: "0",
    pageSize: "2",
  });

  useEffect(() => {
    const page = searchParams.get("page") || "0";
    const pageSize = searchParams.get("pageSize") || "2";

    axiosPrivateInstance
      .get(urlWithPagination(MEALS_WITH_PAGINATION_ENDPOINT, page, pageSize))
      .then((response) => {
        setMealResponse(response.data);
      })
      .catch((error) => console.error(`Error retrieving meal page.`, error));
  }, [navigate, searchParams]);

  const handlePageChange = (event: unknown, newPage: number) => {
    const pageSize = searchParams.get("pageSize") || "2";
    setSearchParams({
      ...searchParams,
      page: newPage.toString(),
      pageSize: pageSize,
    });
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchParams({
      ...searchParams,
      page: "0",
      pageSize: event.target.value,
    });
  };

  const handleEditMeal = (e: React.MouseEvent<HTMLButtonElement>) => {
    const mealId = e.currentTarget.name;
    navigate(`/edit-meal/${mealId}`);
  };

  const handleDeleteMeal = (e: React.MouseEvent<HTMLButtonElement>) => {
    const id = e.currentTarget.name;

    axiosPrivateInstance
      .delete(urlWithPathVariable(MEAL_BY_ID_ENDPOINT, id))
      .then(() => {
        const page = searchParams.get("page") || "0";
        const pageSize = searchParams.get("pageSize") || "2";

        setSearchParams({
          ...searchParams,
          page: page,
          pageSize: pageSize,
        });
      })
      .catch((error) =>
        console.error(`Error while deleting meal with ID ${id}:`, error),
      );
  };

  const handleAddMeal = () => {
    navigate("/add-meal");
  };

  return (
    <div>
      <div>Hello {user.lastName}</div>
      <Button
        variant="contained"
        onClick={handleAddMeal}
        className="mb-8 float-right"
      >
        + Add Meal
      </Button>
      <TableContainer component={Paper}>
        <Table style={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Calories</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mealResponse?.content.map((meal) => (
              <TableRow key={meal.id}>
                <TableCell>{meal.id}</TableCell>
                <TableCell>{meal.name}</TableCell>
                <TableCell>{meal.calories}</TableCell>
                <TableCell>{meal.date}</TableCell>
                <TableCell>{meal.time}</TableCell>
                <TableCell>
                  <IconButton
                    name={meal.id.toString()}
                    onClick={handleEditMeal}
                    aria-label="edit"
                    size="small"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton
                    name={meal.id.toString()}
                    onClick={handleDeleteMeal}
                    aria-label="delete"
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[2, 5, 10]}
        component="div"
        count={mealResponse?.totalNumberOfElements || 0}
        rowsPerPage={parseInt(searchParams.get("pageSize") || "2")}
        page={parseInt(searchParams.get("page") || "0")}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </div>
  );
}
