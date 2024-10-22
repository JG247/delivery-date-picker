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

interface SlotTableProps {
  group: Group;
  groupIndex: number;
  selectedSlot: { groupIndex: number; dayIndex: number; slotIndex: number } | null;
  handleSlotSelect: (groupIndex: number, dayIndex: number, slotIndex: number) => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLDivElement>, groupIndex: number, dayIndex: number, slotIndex: number) => void;
  getDayName: (dateString: string) => string;
  formatDate: (dateString: string) => string;
}

const SlotTable: React.FC<SlotTableProps> = ({
  group,
  groupIndex,
  selectedSlot,
  handleSlotSelect,
  handleKeyDown,
  getDayName,
  formatDate,
}) => {
  return (
    <table className="slot-table">
      <thead>
        <tr>
          {group.days.map((day, dayIndex) => (
            <th key={day.date} className="text-base">
              <span className="text-xs">{getDayName(day.date)}</span>
              <p>{formatDate(day.date)}</p>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {group.days.map((day, dayIndex) => (
            <td key={day.date}>
              {day.unavailable ? (
                <div
                  className="slot unavailable"
                  style={{
                    padding: '10px',
                    backgroundColor: '#f0f0f0',
                    marginBottom: '5px',
                    border: '1px solid #ccc',
                    cursor: 'not-allowed',
                  }}
                >
                  Unavailable
                </div>
              ) : (
                day.slots.map((slot, slotIndex) => (
                  <div
                    key={slot.slot}
                    className={`slot ${slot.full ? 'full' : ''} ${
                      selectedSlot &&
                      selectedSlot.groupIndex === groupIndex &&
                      selectedSlot.dayIndex === dayIndex &&
                      selectedSlot.slotIndex === slotIndex
                        ? 'selected bg-green'
                        : ''
                    }`}
                    onClick={() =>
                      !slot.full && handleSlotSelect(groupIndex, dayIndex, slotIndex)
                    }
                    onKeyDown={(event) =>
                      handleKeyDown(event, groupIndex, dayIndex, slotIndex)
                    }
                    tabIndex={slot.full ? -1 : 0}
                    role="button"
                    aria-pressed={
                      selectedSlot &&
                      selectedSlot.groupIndex === groupIndex &&
                      selectedSlot.dayIndex === dayIndex &&
                      selectedSlot.slotIndex === slotIndex
                        ? true
                        : false
                    }
                    style={{
                      padding: '10px',
                      backgroundColor: slot.full ? '#ccc' : '#84e290', // Green background for available slots
                      cursor: slot.full ? 'not-allowed' : 'pointer',
                      marginBottom: '5px',
                      border: '1px solid #ccc',
                    }}
                  >
                    {slot.slot}
                  </div>
                ))
              )}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
};

export default SlotTable;