// src/hooks/useFormState.js
import { useState } from "react";

export const useFormState = (initialName, todayStr) => {
    const [name, setName] = useState(initialName);
    const [condition, setCondition] = useState("〇");
    const [conditionReason, setConditionReason] = useState("");
    const [task, setTask] = useState("");
    const [ky, setKy] = useState("");
    const [breakfast, setBreakfast] = useState("〇");
    const [date, setDate] = useState(todayStr);

    const reset = () => {
        setCondition("〇");
        setConditionReason("");
        setTask("");
        setKy("");
        setBreakfast("〇");
    };

    return {
        name, setName,
        condition, setCondition,
        conditionReason, setConditionReason,
        task, setTask,
        ky, setKy,
        breakfast, setBreakfast,
        date, setDate,
        reset,
    };
};
