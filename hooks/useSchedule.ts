import { useEffect, useState } from 'react';
import { ScheduleMode } from '../types/preferences';
import { usePreferencesStore } from '../store/usePreferencesStore';
import { getActiveSchedule } from '../services/scheduleService';

export function useSchedule(): ScheduleMode | null {
  const schedules = usePreferencesStore((s) => s.schedules);
  const [activeSchedule, setActiveSchedule] = useState<ScheduleMode | null>(null);

  useEffect(() => {
    const check = () => setActiveSchedule(getActiveSchedule(schedules));
    check();
    const interval = setInterval(check, 60000);
    return () => clearInterval(interval);
  }, [schedules]);

  return activeSchedule;
}
