import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@moveup_points_v1";

const PointsContext = createContext(null);

const defaultState = {
  currentPoints: 0,
  lifetimePoints: 0,
  level: 1,
  nextRewardAt: 100,
  rewards: [],
};

function calculateLevelAndNextReward(lifetimePoints) {
  const level = Math.floor(lifetimePoints / 100) + 1;
  const nextRewardAt = level * 100;
  return { level, nextRewardAt };
}

export function PointsProvider({ children }) {
  const [state, setState] = useState(defaultState);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          const { level, nextRewardAt } = calculateLevelAndNextReward(parsed.lifetimePoints || 0);
          setState({
            ...defaultState,
            ...parsed,
            level,
            nextRewardAt,
          });
        }
      } catch (e) {
        console.warn("Error loading points", e);
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  const persist = async (newState) => {
    setState(newState);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (e) {
      console.warn("Error saving points", e);
    }
  };

  const addPoints = (amount, reason, isProUser) => {
    if (!isProUser || !amount || amount <= 0) return;

    setState((prev) => {
      const lifetimePoints = (prev.lifetimePoints || 0) + amount;
      const currentPoints = (prev.currentPoints || 0) + amount;
      const { level, nextRewardAt } = calculateLevelAndNextReward(lifetimePoints);

      const newState = {
        ...prev,
        lifetimePoints,
        currentPoints,
        level,
        nextRewardAt,
      };

      if (reason) {
        newState.rewards = [
          ...(prev.rewards || []),
          {
            id: Date.now().toString(),
            type: "points_earned",
            reason,
            amount,
            createdAt: new Date().toISOString(),
          },
        ];
      }

      persist(newState);
      return newState;
    });
  };

  const redeemReward = (cost, rewardName, isProUser) => {
    if (!isProUser) return { success: false, message: "Solo para usuarios Pro" };

    let success = false;
    setState((prev) => {
      if (prev.currentPoints < cost) {
        success = false;
        return prev;
      }
      const newState = {
        ...prev,
        currentPoints: prev.currentPoints - cost,
        rewards: [
          ...(prev.rewards || []),
          {
            id: Date.now().toString(),
            type: "reward_redeemed",
            name: rewardName,
            cost,
            createdAt: new Date().toISOString(),
          },
        ],
      };
      persist(newState);
      success = true;
      return newState;
    });

    return { success, message: success ? "Recompensa canjeada" : "Puntos insuficientes" };
  };

  const value = {
    ...state,
    isReady,
    addPoints,
    redeemReward,
  };

  return <PointsContext.Provider value={value}>{children}</PointsContext.Provider>;
}

export function usePoints() {
  const ctx = useContext(PointsContext);
  if (!ctx) {
    throw new Error("usePoints debe usarse dentro de PointsProvider");
  }
  return ctx;
}
