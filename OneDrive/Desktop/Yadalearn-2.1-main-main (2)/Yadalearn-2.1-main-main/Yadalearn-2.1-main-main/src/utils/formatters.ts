// String formatting functions for YadaLearn

export const formatTime = (hours: number, minutes: number): string => {
  return `${hours.toString().padStart(2, '0')} Hr ${minutes.toString().padStart(2, '0')}mins`;
};

export const formatHourLabel = (hours: number): string => {
  return `${hours.toFixed(1)} Hr`;
};

export const formatPercentage = (value: number): string => {
  return `${Math.round(value)}%`;
};

export const formatLessonCount = (count: number): string => {
  return `${count} Lesson${count !== 1 ? 's' : ''}`;
};

export const formatSessionTime = (startTime: string, endTime: string): string => {
  return `${startTime} - ${endTime}`;
};

export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

export const formatPriceRange = (min: number, max: number): string => {
  return `$${min}-${max}/hr`;
};

export const formatDayLabel = (day: string): string => {
  return day;
};