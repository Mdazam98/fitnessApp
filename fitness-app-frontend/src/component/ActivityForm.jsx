import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  TextField,
  MenuItem,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { addActivity } from "../services/api";

const ActivityForm = ({ onActivityAdded }) => {
  const [activity, setActivity] = useState({
    type: "RUNNING",
    duration: "",
    caloriesBurned: "",
    additionalMetrics: {},
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addActivity(activity);
      onActivityAdded();
      setActivity({
        type: "RUNNING",
        duration: "",
        caloriesBurned: "",
        additionalMetrics: {},
      });
    } catch (error) {
      console.error("Error adding activity:", error);
    }
  };

  const handleTypeChange = (e) => {
    setActivity({
      type: e.target.value,
      duration: "",
      caloriesBurned: "",
      additionalMetrics: {},
    });
  };

  const handleMetricChange = (key, value) => {
    setActivity((prev) => ({
      ...prev,
      additionalMetrics: {
        ...prev.additionalMetrics,
        [key]: value,
      },
    }));
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Activity Type</InputLabel>
        <Select
          value={activity.type}
          onChange={handleTypeChange}
        >
          <MenuItem value="WALKING">Walking</MenuItem>
          <MenuItem value="RUNNING">Running</MenuItem>
          <MenuItem value="CYCLING">Cycling</MenuItem>
          <MenuItem value="SWIMMING">Swimming</MenuItem>
          <MenuItem value="WEIGHT_TRAINING">Weight Training</MenuItem>
          <MenuItem value="YOGA">Yoga</MenuItem>
          <MenuItem value="HIIT">HIIT</MenuItem>
          <MenuItem value="CARDIO">Cardio</MenuItem>
          <MenuItem value="STRETCHING">Stretching</MenuItem>
          <MenuItem value="OTHER">Other</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        label="Duration (minutes)"
        type="number"
        value={activity.duration}
        onChange={(e) => setActivity({ ...activity, duration: e.target.value })}
        sx={{ mb: 2 }}
        required
      />
      <TextField
        fullWidth
        label="Calories Burned"
        type="number"
        value={activity.caloriesBurned}
        onChange={(e) =>
          setActivity({ ...activity, caloriesBurned: e.target.value })
        }
        sx={{ mb: 2 }}
        required
      />

      <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1, mt: 2 }}>
        Additional Metrics
      </Typography>

      <TextField
        fullWidth
        label="Average Heart Rate (bpm)"
        type="number"
        value={activity.additionalMetrics.heartRate || ""}
        onChange={(e) => handleMetricChange("heartRate", e.target.value)}
        sx={{ mb: 2 }}
      />

      {(activity.type === "RUNNING" || activity.type === "WALKING") && (
        <>
          <TextField
            fullWidth
            label="Distance (km)"
            type="number"
            slotProps={{ htmlInput: { step: "0.1" } }}
            value={activity.additionalMetrics.distance || ""}
            onChange={(e) => handleMetricChange("distance", e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Pace (min/km)"
            placeholder="e.g. 5:30"
            value={activity.additionalMetrics.pace || ""}
            onChange={(e) => handleMetricChange("pace", e.target.value)}
            sx={{ mb: 2 }}
          />
        </>
      )}

      {activity.type === "CYCLING" && (
        <>
          <TextField
            fullWidth
            label="Distance (km)"
            type="number"
            slotProps={{ htmlInput: { step: "0.1" } }}
            value={activity.additionalMetrics.distance || ""}
            onChange={(e) => handleMetricChange("distance", e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Average Speed (km/h)"
            type="number"
            slotProps={{ htmlInput: { step: "0.1" } }}
            value={activity.additionalMetrics.speed || ""}
            onChange={(e) => handleMetricChange("speed", e.target.value)}
            sx={{ mb: 2 }}
          />
        </>
      )}

      {activity.type === "SWIMMING" && (
        <>
          <TextField
            fullWidth
            label="Laps"
            type="number"
            value={activity.additionalMetrics.laps || ""}
            onChange={(e) => handleMetricChange("laps", e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Stroke Type</InputLabel>
            <Select
              value={activity.additionalMetrics.strokeType || ""}
              onChange={(e) => handleMetricChange("strokeType", e.target.value)}
            >
              <MenuItem value="Freestyle">Freestyle</MenuItem>
              <MenuItem value="Breaststroke">Breaststroke</MenuItem>
              <MenuItem value="Backstroke">Backstroke</MenuItem>
              <MenuItem value="Butterfly">Butterfly</MenuItem>
              <MenuItem value="Mixed">Mixed</MenuItem>
            </Select>
          </FormControl>
        </>
      )}

      {activity.type === "WEIGHT_TRAINING" && (
        <>
          <TextField
            fullWidth
            label="Weight Lifted (kg)"
            type="number"
            slotProps={{ htmlInput: { step: "0.5" } }}
            value={activity.additionalMetrics.weight || ""}
            onChange={(e) => handleMetricChange("weight", e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Sets"
            type="number"
            value={activity.additionalMetrics.sets || ""}
            onChange={(e) => handleMetricChange("sets", e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Reps"
            type="number"
            value={activity.additionalMetrics.reps || ""}
            onChange={(e) => handleMetricChange("reps", e.target.value)}
            sx={{ mb: 2 }}
          />
        </>
      )}

      {["YOGA", "HIIT", "CARDIO", "STRETCHING", "OTHER"].includes(activity.type) && (
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Intensity</InputLabel>
          <Select
            value={activity.additionalMetrics.intensity || ""}
            onChange={(e) => handleMetricChange("intensity", e.target.value)}
          >
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </Select>
        </FormControl>
      )}

      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
        Add Activity
      </Button>
    </Box>
  );
};

export default ActivityForm;
