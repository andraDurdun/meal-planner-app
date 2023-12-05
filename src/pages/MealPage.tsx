import React, { useCallback, useContext, useEffect, useState } from "react";
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
import { axiosPrivateInstance } from "../api/apiService";
import {
  MEAL_BY_ID_ENDPOINT,
  addPathVariableToUrl,
  QueryParams,
  addQueryParamsToUrl,
  MEALS_ENDPOINT,
} from "../api/apiConstants";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import MyAccount from "../components/MyAccount";

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

interface MealFilter {
  dateFrom?: Dayjs;
  dateTo?: Dayjs;
  timeFrom?: Dayjs;
  timeTo?: Dayjs;
}

export default function MealPage() {
  const navigate = useNavigate();
  const [mealResponse, setMealResponse] = useState<MealResponse>();
  const [mealFilter, setMealFilter] = useState<MealFilter>();
  const [searchParams, setSearchParams] = useSearchParams({
    page: "0",
    pageSize: "10",
  });
  const fetchMeals = useCallback(() => {
    const queryParams: QueryParams = {};
    searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });

    axiosPrivateInstance
      .get(addQueryParamsToUrl(MEALS_ENDPOINT, queryParams))
      .then((response) => {
        setMealResponse(response.data);
      })
      .catch((error) => console.error(`Error retrieving meal page.`, error));
  }, [searchParams]);

  useEffect(() => {
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const timeFrom = searchParams.get("timeFrom");
    const timeTo = searchParams.get("timeTo");

    if (dateFrom || dateTo || timeFrom || timeTo) {
      setMealFilter({
        dateFrom: dateFrom ? dayjs(dateFrom) : undefined,
        dateTo: dateTo ? dayjs(dateTo) : undefined,
        timeFrom: timeFrom ? dayjs(timeFrom, "HH:mm") : undefined,
        timeTo: timeTo ? dayjs(timeTo, "HH:mm") : undefined,
      });
    }

    fetchMeals();
  }, [searchParams, fetchMeals]);

  const handlePageChange = (event: unknown, newPage: number) => {
    const pageSize = searchParams.get("pageSize") || "10";
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
      .delete(addPathVariableToUrl(MEAL_BY_ID_ENDPOINT, id))
      .then(() => {
        fetchMeals();
      })
      .catch((error) =>
        console.error(`Error while deleting meal with ID ${id}:`, error),
      );
  };

  const handleAddMeal = () => {
    navigate("/add-meal");
  };

  const handleSearch = () => {
    const page = searchParams.get("page") || "0";
    const pageSize = searchParams.get("pageSize") || "10";

    const queryParams: QueryParams = {
      page,
      pageSize,
    };

    if (mealFilter) {
      if (mealFilter.dateFrom) {
        queryParams.dateFrom = mealFilter.dateFrom.format("YYYY-MM-DD");
      }
      if (mealFilter.dateTo) {
        queryParams.dateTo = mealFilter.dateTo.format("YYYY-MM-DD");
      }
      if (mealFilter.timeFrom) {
        queryParams.timeFrom = mealFilter.timeFrom.format("HH:mm");
      }
      if (mealFilter.timeTo) {
        queryParams.timeTo = mealFilter.timeTo.format("HH:mm");
      }
    }

    const newUrl = addQueryParamsToUrl(MEALS_ENDPOINT, queryParams);
    navigate(newUrl);
  };

  return (
    <div>
      <MyAccount />
      <div className="flex flex-col space-y-4 mt-10">
        <div className="flex items-center space-x-6">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="From"
              slotProps={{
                textField: {
                  variant: "standard",
                  InputLabelProps: {
                    shrink: true,
                  },
                  name: "date-from",
                },
                actionBar: {
                  actions: ["clear"],
                },
              }}
              format="DD/MM/YYYY"
              value={mealFilter?.dateFrom}
              onChange={(newDateFrom) => {
                setMealFilter({
                  ...mealFilter,
                  dateFrom: newDateFrom || undefined,
                });
              }}
              className="mr-8"
            />
            <DatePicker
              label="To"
              slotProps={{
                textField: {
                  variant: "standard",
                  InputLabelProps: {
                    shrink: true,
                  },
                  name: "date-to",
                },
                actionBar: {
                  actions: ["clear"],
                },
              }}
              format="DD/MM/YYYY"
              value={mealFilter?.dateTo}
              onChange={(newDateTo) =>
                setMealFilter({ ...mealFilter, dateTo: newDateTo || undefined })
              }
              className="mr-8"
            />
            <TimePicker
              label="From"
              slotProps={{
                textField: {
                  variant: "standard",
                  InputLabelProps: {
                    shrink: true,
                  },
                  name: "timeFrom",
                },
                actionBar: {
                  actions: ["clear"],
                },
              }}
              value={mealFilter?.timeFrom}
              format="HH:mm"
              onChange={(newDateFrom) =>
                setMealFilter({
                  ...mealFilter,
                  timeFrom: newDateFrom || undefined,
                })
              }
              className="mr-8"
            />
            <TimePicker
              label="To"
              slotProps={{
                textField: {
                  variant: "standard",
                  InputLabelProps: {
                    shrink: true,
                  },
                  name: "timeTo",
                },
                actionBar: {
                  actions: ["clear"],
                },
              }}
              value={mealFilter?.timeTo}
              format="HH:mm"
              onChange={(newTimeTo) => {
                setMealFilter({
                  ...mealFilter,
                  timeTo: newTimeTo || undefined,
                });
              }}
              className="mr-8"
            />
          </LocalizationProvider>
          <Button variant="contained" onClick={handleSearch}>
            Search
          </Button>
        </div>
        <div>
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
        <div className="flex justify-end">
          <Button variant="contained" onClick={handleAddMeal}>
            + Add Meal
          </Button>
        </div>
      </div>
    </div>
  );
}
