import { useCallback } from "react";
import { EXCLUDED_CONDITIONS } from "../constants/excludedConditions";

export const useHealthSubmit = (form, postRecord) => {
  const handleSubmit = useCallback(async () => {
    const isExcluded = EXCLUDED_CONDITIONS.includes(form.condition);

    await postRecord({
      name: form.name,
      condition: form.condition,
      conditionReason: form.conditionReason,
      breakfast: isExcluded ? "" : form.breakfast,
      task: isExcluded ? form.condition : form.task,
      ky: isExcluded ? form.condition : form.ky,
      date: form.date,
    });

    form.reset();
  }, [form, postRecord]);

  return { handleSubmit };
};
