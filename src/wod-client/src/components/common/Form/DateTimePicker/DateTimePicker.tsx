import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Datepicker.css';
import Label from '../atoms/Label';
import FormField from '../atoms/FormField';

const DateTimePicker = (props) => {
  const [startDate, setStartDate] = useState(new Date());
  const timeZone = ""  //useUserTimeZone();

  const {
    onDateChange,
    labelText,
    id
  } = props;

  const handleDateChange = (date) => {
    setStartDate(date);
    onDateChange(date, timeZone);
  };

  return (
    <FormField>
      <Label htmlFor={id} labelText="Release date"/>
      <DatePicker
        selected={startDate}
        onChange={handleDateChange}
        showTimeSelect
        dateFormat="Pp"
      />
      <p>Your time zone: {timeZone}</p>
    </FormField>
  );
};

export default DateTimePicker