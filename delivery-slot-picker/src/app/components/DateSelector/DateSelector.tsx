import React from 'react';

interface Slot {
  slot: string;
  full: boolean;
}

interface Day {
  date: string;
  slots: Slot[];
  unavailable?: boolean;
}

interface Group {
  days: Day[];
}

interface DateSelectorProps {
  updatedGroups: Group[];
  handleDateSelect: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  formatDate: (dateString: string) => string;
}

const DateSelector: React.FC<DateSelectorProps> = ({ updatedGroups, handleDateSelect, formatDate }) => {
  return (
    <select onChange={handleDateSelect} className="mb-4 p-2 border rounded">
      <option value="">Select a date</option>
      {updatedGroups.map((group, groupIndex) =>
        group.days.map((day, dayIndex) => (
          <option key={day.date} value={day.date} disabled={day.unavailable}>
            {formatDate(day.date)} {day.unavailable ? '(Unavailable)' : ''}
          </option>
        ))
      )}
    </select>
  );
};

export default DateSelector;