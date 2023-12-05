import { useNavigate, useParams } from "react-router-dom";
import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import { Button, TextField } from "@mui/material";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { UserContext } from "../context/UserContext";
import { axiosPrivateInstance } from "../api/apiService";
import { MEAL_BY_ID_ENDPOINT, addPathVariableToUrl } from "../api/apiConstants";

interface Meal {
  name: string;
  calories: number;
  date: Dayjs;
  time: Dayjs;
  userId: number;
}

const defaultMeal: Meal = {
  name: "",
  calories: 0,
  date: dayjs(),
  time: dayjs(),
  userId: 1,
};

export default function EditMealPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meal, setMeal] = useState<Meal>(defaultMeal);
  const user = useContext(UserContext);

  const parseLocalDate = (localDateString: string): Dayjs => {
    const [year, month, day] = localDateString.split("-");
    return dayjs()
      .year(Number(year))
      .month(Number(month) - 1)
      .date(Number(day));
  };

  const parseLocalTime = (localTimeString: string): Dayjs => {
    const [hour, minute, second] = localTimeString.split(":");
    return dayjs()
      .hour(Number(hour))
      .minute(Number(minute))
      .second(Number(second));
  };

  useEffect(() => {
    if (id === undefined) {
      console.error("Error: ID is undefined");
      return;
    }

    axiosPrivateInstance
      .get(addPathVariableToUrl(MEAL_BY_ID_ENDPOINT, id))
      .then((response) => {
        const responseData = response.data;
        const date = parseLocalDate(responseData.date);
        const time = parseLocalTime(responseData.time);

        setMeal({
          ...responseData,
          date,
          time,
        });
      });
  }, [navigate, id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMeal({ ...meal, [e.target.name]: e.target.value });
  };

  const handleEditMeal = () => {
    if (id === undefined) {
      console.error("Error: ID is undefined");
      return;
    }

    const requestBody = JSON.stringify({
      ...meal,
      time: meal.time.format("HH:mm"),
      date: meal.date.format("YYYY-MM-DD"),
      userId: user.id,
    });

    axiosPrivateInstance
      .put(addPathVariableToUrl(MEAL_BY_ID_ENDPOINT, id), requestBody)
      .then(() => {
        navigate("/meals");
      })
      .catch((error) =>
        console.error(`Error while editing meal with ID ${id}:`, error),
      );
  };

  return (
    <div>
      <Header heading="Add Meal" />
      <div className="flex flex-col space-y-4">
        <TextField
          label="Name"
          InputLabelProps={{
            shrink: true,
          }}
          variant="standard"
          name="name"
          onChange={handleChange}
          value={meal.name}
        />
        <TextField
          label="Calories"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          variant="standard"
          name="calories"
          onChange={handleChange}
          value={meal.calories}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date"
            slotProps={{
              textField: {
                variant: "standard",
                InputLabelProps: {
                  shrink: true,
                },
                name: "date",
              },
            }}
            value={meal.date}
            format="DD/MM/YYYY"
            onChange={(newDate) => {
              if (newDate !== null) {
                setMeal({ ...meal, date: newDate });
              }
            }}
          />
          <TimePicker
            label="Time"
            slotProps={{
              textField: {
                variant: "standard",
                InputLabelProps: {
                  shrink: true,
                },
                name: "time",
              },
            }}
            value={meal.time}
            format="HH:mm"
            onChange={(newTime) => {
              if (newTime !== null) {
                setMeal({ ...meal, time: newTime });
              }
            }}
          />
        </LocalizationProvider>
        <Button variant="contained" onClick={handleEditMeal}>
          Save
        </Button>
      </div>
    </div>
  );
}
