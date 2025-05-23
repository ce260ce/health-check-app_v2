// hooks/useInitializeHealthForm.js
import { useEffect } from 'react'
import { EXCLUDED_CONDITIONS } from '../constants/excludedConditions'

export const useInitializeHealthForm = ({ form, records, nameFromQuery, todayStr }) => {
  useEffect(() => {
    if (!nameFromQuery || records.length === 0) return

    const existing = records.find(
      (record) =>
        record.name.trim() === nameFromQuery.trim() &&
        record.date === todayStr,
    )

    if (existing) {
      if (!EXCLUDED_CONDITIONS.includes(existing.condition)) {
        form.setTask(existing.task || '')
        form.setKy(existing.ky || '')
      } else {
        form.setTask(existing.condition)
        form.setKy(existing.condition)
      }
    }
  }, [records, nameFromQuery, todayStr, form])
}
