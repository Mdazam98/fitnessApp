import { configureStore } from "@reduxjs/toolkit";
import React, { Component } from "react";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: { auth: authReducer },
});
