import { Button, TextField } from "@mui/material";
import Header from "../components/Header";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React, { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function AddMealPage() {
  const navigate = useNavigate();
  const [meal, setMeal] = useState<Meal>(defaultMeal);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMeal({ ...meal, [e.target.name]: e.target.value });
  };

  const handleAddMeal = () => {
    console.log(meal);
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const addMealEndpointUrl = "http://localhost:8080/meal-planner/api/meals";
    fetch(addMealEndpointUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...meal,
        time: meal.time.format("HH:mm"),
        date: meal.date.format("YYYY-MM-DD"),
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Authentication failed");
        }
        return response.json();
      })
      .then((responseData) => {
        navigate("/meals");
      })
      .catch((error) => console.log(error));
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
