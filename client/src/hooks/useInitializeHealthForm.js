import { useEffect, useRef } from 'react';

export const useInitializeHealthForm = ({ form, records, nameFromQuery, todayStr }) => {
  const initialized = useRef(false); // 初回だけ実行するためのフラグ

  useEffect(() => {
    if (initialized.current) return;
    if (!nameFromQuery || records.length === 0) return;

    const existing = records.find(
      (record) =>
        record.name.trim() === nameFromQuery.trim() &&
        record.date === todayStr
    );

    console.log("★既存記録", existing);

    if (existing) {
      form.setTask(existing.task || '');
      form.setKy(existing.ky || '');
      form.setCondition(existing.condition || '');
      form.setBreakfast(existing.breakfast || '');
      form.setConditionReason(existing.conditionReason || '');
    }

    initialized.current = true;
  }, [records, nameFromQuery, todayStr, form]);
};
