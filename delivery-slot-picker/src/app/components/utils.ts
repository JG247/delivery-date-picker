interface Slot {
    slot: string;
    full: boolean;
  }
  
  interface Day {
    date: string;
    slots: Slot[];
  }
  
  interface Group {
    days: Day[];
  }
  
  interface PendingSlot {
    groupIndex: number;
    dayIndex: number;
    slotIndex: number;
  }
  
  export function updateGroupsWithSelectedSlot(groups: Group[], pendingSlot: PendingSlot): Group[] {
    const { groupIndex, dayIndex, slotIndex } = pendingSlot;
    return groups.map((group, gIndex) => {
      if (gIndex === groupIndex) {
        return {
          ...group,
          days: group.days.map((day, dIndex) => {
            if (dIndex === dayIndex) {
              return {
                ...day,
                slots: day.slots.map((slot, sIndex) => {
                  if (sIndex === slotIndex) {
                    return { ...slot, full: true };
                  }
                  return slot;
                })
              };
            }
            return day;
          })
        };
      }
      return group;
    });
  }


  export function scrollToSelectedDate(
    selectedDate: string,
    updatedGroups: Group[],
    groupRefs: React.RefObject<(HTMLDivElement | null)[]>
  ): void {
    for (let groupIndex = 0; groupIndex < updatedGroups.length; groupIndex++) {
      const group = updatedGroups[groupIndex];
      for (let dayIndex = 0; dayIndex < group.days.length; dayIndex++) {
        if (group.days[dayIndex].date === selectedDate) {
          const element = groupRefs.current?.[groupIndex];
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          return;
        }
      }
    }
  }

  // Function to format a date string
export  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'long' });

    const getOrdinalSuffix = (day: number) => {
      if (day > 3 && day < 21) return 'th'; // Handle 11th to 20th
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };

    return `${day}${getOrdinalSuffix(day)} ${month}`;
  };



  // Function to handle key down events for slot selection
export const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    groupIndex: number,
    dayIndex: number,
    slotIndex: number,
    updatedGroups: Group[],
    handleSlotSelect: (groupIndex: number, dayIndex: number, slotIndex: number) => void
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!updatedGroups[groupIndex].days[dayIndex].slots[slotIndex].full) {
        handleSlotSelect(groupIndex, dayIndex, slotIndex);
      }
    }
  };
  
  // Function to get the day name from a date string
  export const getDayName = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };
  
  // Function to handle date selection from the dropdown
  export const handleDateSelect = (
    event: React.ChangeEvent<HTMLSelectElement>,
    updatedGroups: Group[],
    groupRefs: React.RefObject<(HTMLDivElement | null)[]>,
    scrollToSelectedDate: (selectedDate: string, updatedGroups: Group[], groupRefs: React.RefObject<(HTMLDivElement | null)[]>) => void
  ) => {
    const selectedDate = event.target.value;
    scrollToSelectedDate(selectedDate, updatedGroups, groupRefs);
  };