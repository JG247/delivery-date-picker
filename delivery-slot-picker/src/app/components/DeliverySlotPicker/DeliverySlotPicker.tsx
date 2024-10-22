'use client'; // Indicates that this file should be treated as a client-side component

import React, { useEffect, useState, useRef } from 'react'; // Import necessary React hooks

import { updateGroupsWithSelectedSlot, scrollToSelectedDate, formatDate,  handleKeyDown, getDayName, handleDateSelect } from '../utils';
import DateSelector from '../DateSelector/DateSelector';
import SlotTable from '../SlotTable/SlotTable';
import Modal from '../Modal/Modal';

// Define the Slot interface
interface Slot {
  slot: string; // The time slot (e.g., "AM", "PM", "EVE")
  full: boolean; // Indicates if the slot is fully booked
}

// Define the Day interface
interface Day {
  date: string; // The date of the day
  slots: Slot[]; // Array of slots for the day
  unavailable?: boolean; // Optional property to indicate if the day is unavailable
}

// Define the SelectedSlot interface
interface SelectedSlot {
  groupIndex: number; // Index of the group
  dayIndex: number; // Index of the day
  slotIndex: number; // Index of the slot
}

// Define the Group interface
interface Group {
  days: Day[]; // Array of days in the group
}

// Define the props for the DeliverySlotPicker component
interface DeliverySlotPickerProps {
  groups: Group[]; // Array of groups
  flag: boolean; // Flag to indicate the special condition
}

// Define the DeliverySlotPicker component
const DeliverySlotPicker: React.FC<DeliverySlotPickerProps> = ({ groups, flag }) => {
  // State to manage the selected slot
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
  // State to manage the sticky header
  const [isStickyActive, setIsStickyActive] = useState(false);
  // State to check if the component is client-side
  const [isClient, setIsClient] = useState(false);
  // State to manage the visibility of the header
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  // State to manage the updated groups
  const [updatedGroups, setUpdatedGroups] = useState(groups);
  // State to manage the visibility of the modal
  const [showModal, setShowModal] = useState(false);
  // State to manage the pending slot selection
  const [pendingSlot, setPendingSlot] = useState<SelectedSlot | null>(null);
  // Refs to manage the group elements
  const groupRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Ref to manage the sticky header element
  const stickyHeaderRef = useRef<HTMLDivElement | null>(null);

  // Effect to set the component as client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Effect to mark Wednesdays as unavailable if the flag is true
  useEffect(() => {
    if (flag) {
      setUpdatedGroups(prevGroups =>
        prevGroups.map(group => ({
          ...group,
          days: group.days.map(day => {
            const date = new Date(day.date);
            if (date.getDay() === 3) { // 3 corresponds to Wednesday
              return { ...day, unavailable: true };
            }
            return day;
          })
        }))
      );
    }
  }, [flag]);

  // Function to handle slot selection
  const handleSlotSelect = (groupIndex: number, dayIndex: number, slotIndex: number) => {
    setPendingSlot({ groupIndex, dayIndex, slotIndex });
    setShowModal(true);
  };

  // Function to confirm slot selection
  const confirmSlotSelect = () => {
    if (pendingSlot) {
        setSelectedSlot(pendingSlot);
        setUpdatedGroups(prevGroups => updateGroupsWithSelectedSlot(prevGroups, pendingSlot));
        setShowModal(false);
        setPendingSlot(null);
      }
  };

  // Function to cancel slot selection
  const cancelSlotSelect = () => {
    setShowModal(false);
    setPendingSlot(null);
  };


  return (
    <div className="slot-picker">
      {/* Sticky header for date selection */}
      <div ref={stickyHeaderRef} className={`fixed top-0 right-0 bg-white z-10 p-2 transition-opacity duration-500 ${isHeaderVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className='flex flex-col gap-4'>
          <p className='mt-1'>Jump to Date</p>
          {isClient && (
            <DateSelector
            updatedGroups={updatedGroups}
            handleDateSelect={(event) => handleDateSelect(event, updatedGroups, groupRefs, scrollToSelectedDate)}
            formatDate={formatDate}
            />
          )}
        </div>
      </div>
      {/* Main content for displaying slots */}
      <div className={isStickyActive ? 'mt-24' : ''}>
        {Array.isArray(updatedGroups) && updatedGroups.map((group, groupIndex) => (
          <div
            key={groupIndex}
            className="group"
            ref={el => { groupRefs.current[groupIndex] = el; }}
          >
            <SlotTable
            key={groupIndex}
            group={group}
            groupIndex={groupIndex}
            selectedSlot={selectedSlot}
            handleSlotSelect={handleSlotSelect}
            handleKeyDown={(event, dayIndex, slotIndex) => handleKeyDown(event, groupIndex, dayIndex, slotIndex, updatedGroups, handleSlotSelect)}
            getDayName={getDayName}
            formatDate={formatDate}
            />
          </div>
        ))}
      </div>
      {/* Modal for confirming slot selection */}
      {showModal && (
        <Modal confirmSlotSelect={confirmSlotSelect} cancelSlotSelect={cancelSlotSelect} />
      )}
    </div>
  );
};

export default DeliverySlotPicker;