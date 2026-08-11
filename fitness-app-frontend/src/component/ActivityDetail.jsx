import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { getActivity, getActivityDetail } from "../services/api";
import { Box, Card, CardContent, Divider, Typography, Button } from "@mui/material";

const ActivityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [recLoading, setRecLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const activityRes = await getActivity(id);
        setActivity(activityRes.data);
      } catch (error) {
        console.error("Failed to fetch activity", error);
      }
    };

    fetchActivity();
  }, [id]);

  useEffect(() => {
    let intervalId = null;

    const fetchRecommendation = async () => {
      try {
        const recRes = await getActivityDetail(id);
        setRecommendation(recRes.data);
        setRecLoading(false);
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      } catch (recError) {
        console.log("Recommendation not ready yet, retrying...");
      }
    };

    fetchRecommendation();

    intervalId = setInterval(fetchRecommendation, 3000);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [id]);

  if (!activity) {
    return <Typography>Loading...</Typography>;
  }
  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, "@media print": { display: "none" } }}>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Back
        </Button>
        <Button variant="contained" onClick={() => window.print()}>
          Print Recommendation
        </Button>
      </Box>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Activity Details
          </Typography>
          <Typography sx={{ mb: 0.5 }}>Type: {activity.type}</Typography>
          <Typography sx={{ mb: 0.5 }}>Duration: {activity.duration} minutes</Typography>
          <Typography sx={{ mb: 0.5 }}>Calories Burned: {activity.caloriesBurned}</Typography>
          <Typography sx={{ mb: 0.5 }}>
            Date: {new Date(activity.createdAt).toLocaleString()}
          </Typography>
          {activity.additionalMetrics && Object.keys(activity.additionalMetrics).length > 0 && (
            <>
              <Divider sx={{ my: 1.5 }} />
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                Additional Metrics
              </Typography>
              {Object.entries(activity.additionalMetrics).map(([key, value]) => {
                if (value === null || value === undefined || value === "") return null;
                const formattedKey = key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase());
                 let displayValue = value;
                if (key === "heartRate") displayValue = `${value} bpm`;
                if (key === "distance") displayValue = `${value} km`;
                if (key === "speed") displayValue = `${value} km/h`;
                if (key === "weight") displayValue = `${value} kg`;
                if (key === "pace") displayValue = `${value} min/km`;
                return (
                  <Typography key={key} sx={{ mb: 0.5 }}>
                    {formattedKey}: {displayValue}
                  </Typography>
                );
              })}
            </>
          )}
        </CardContent>
      </Card>

      {recLoading ? (
        <Card>
          <CardContent sx={{ py: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Generating AI Recommendation...
            </Typography>
            <Typography variant="body2" color="textSecondary" align="center">
              Please wait while our AI analyzes your activity details and prepares personalized feedback.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        recommendation && (
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                AI Recommendation
              </Typography>
              <Typography variant="h6">Analysis</Typography>
              {recommendation.recommendation?.split("\n").filter(line => line.trim()).map((line, index) => {
                const colonIndex = line.indexOf(":");
                if (colonIndex !== -1) {
                  const header = line.substring(0, colonIndex);
                  const content = line.substring(colonIndex + 1);
                  return (
                    <Typography key={index} sx={{ mb: 2 }}>
                      <strong>{header}:</strong> {content.trim()}
                    </Typography>
                  );
                }
                return (
                  <Typography key={index} sx={{ mb: 2 }}>
                    {line}
                  </Typography>
                );
              })}

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6">Improvements</Typography>
              {recommendation.improvements?.map((improvement, index) => {
                const parts = improvement.split(",");
                if (parts.length > 1) {
                  return (
                    <Typography key={index} sx={{ mb: 2 }}>
                      <strong>• {parts[0]}</strong>: {parts.slice(1).join(",")}
                    </Typography>
                  );
                }
                return (
                  <Typography key={index} sx={{ mb: 2 }}>
                    • {improvement}
                  </Typography>
                );
              })}

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6">Suggestions</Typography>
              {recommendation.suggestions?.map((suggestion, index) => {
                const parts = suggestion.split(",");
                if (parts.length > 1) {
                  return (
                    <Typography key={index} sx={{ mb: 2 }}>
                      <strong>• {parts[0]}</strong>: {parts.slice(1).join(",")}
                    </Typography>
                  );
                }
                return (
                  <Typography key={index} sx={{ mb: 2 }}>
                    • {suggestion}
                  </Typography>
                );
              })}

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6">Safety Guidelines</Typography>
              {recommendation.safety?.map((safety, index) => (
                <Typography key={index} sx={{ mb: 2 }}>
                  • {safety}
                </Typography>
              ))}
            </CardContent>
          </Card>
        )
      )}
    </Box>
  );
};

export default ActivityDetail;
