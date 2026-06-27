import { ScheduleMode } from '../types/preferences';

export function getActiveSchedule(schedules: ScheduleMode[]): ScheduleMode | null {
  const now = new Date();
  const currentDay = now.getDay();
  const currentHour = now.getHours();

  return (
    schedules.find(
      (s) =>
        s.enabled &&
        s.days.includes(currentDay) &&
        currentHour >= s.startHour &&
        currentHour < s.endHour
    ) ?? null
  );
}
