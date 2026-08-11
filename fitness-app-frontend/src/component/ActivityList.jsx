import { Card, CardContent, Grid, Typography, Button } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { getActivities, deleteActivity, deleteRecommendation } from "../services/api";

const ActivityList = () => {
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();

  const fetchActivities = async () => {
    try {
      const response = await getActivities();
      setActivities(response.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this activity and its recommendation?")) {
      try {
        await deleteActivity(id);
        try {
          await deleteRecommendation(id);
        } catch (recError) {
          console.warn("Could not delete recommendation:", recError);
        }
        setActivities(activities.filter((act) => act.id !== id));
      } catch (error) {
        console.error("Failed to delete activity:", error);
        alert("Failed to delete activity: " + (error.response?.data?.message || error.message));
      }
    }
  };

  return (
    <Grid
      container
      spacing={{ xs: 2, md: 3 }}
      columns={{ xs: 4, sm: 8, md: 12 }}
    >
      {activities.map((activity) => (
        <Grid
          xs={12}
          key={activity.id}
        >
          <Card
            sx={{ 
              cursor: "pointer", 
              width: "100%", 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              mb: 1
            }}
            onClick={() => navigate(`/activities/${activity.id}`)}
          >
            <CardContent>
              <Typography variant="h6">{activity.type}</Typography>
              <Typography>Duration: {activity.duration} minutes</Typography>
              <Typography>Calories: {activity.caloriesBurned}</Typography>
            </CardContent>
            <Button
              variant="outlined"
              color="error"
              sx={{ mr: 3 }}
              onClick={(e) => handleDelete(e, activity.id)}
            >
              Delete
            </Button>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ActivityList;
