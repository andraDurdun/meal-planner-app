import { useNavigate, useParams } from "react-router-dom";
import React, { ChangeEvent, useEffect, useState } from "react";
import Header from "../components/Header";
import { Button, TextField } from "@mui/material";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

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
    const endpointUrl = `http://localhost:8080/meal-planner/api/meals/${id}`;

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

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
        const date = parseLocalDate(responseData.date);
        const time = parseLocalTime(responseData.time);

        // Update the meal state
        setMeal({
          ...responseData,
          date,
          time,
        });
      })
      .catch((error) => console.log(error));
  }, [navigate, id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMeal({ ...meal, [e.target.name]: e.target.value });
  };

  const handleAddMeal = () => {
    console.log(meal);
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
        <Button variant="contained" onClick={handleAddMeal}>
          Save
        </Button>
      </div>
    </div>
  );
}
