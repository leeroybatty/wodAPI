import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Checkbox from './Checkbox'
export default {
  title: 'Form Components/Checkbox',
  component: Checkbox,
   argTypes: {
    checked: {
      control: { type: 'boolean' }
    }
  }
} as ComponentMeta<typeof Checkbox>

const Template: ComponentStory<typeof Checkbox> = (args) => <Checkbox {...args} />

let isChecked = false;

const handleChange = function () {
  isChecked = !isChecked;
}

export const Default = Template.bind({})
Default.args = {
  id: "example-id",
  labelText: "Label",
  helperText: "Optional helper text goes here.",
  defaultValue: "Default Value",
  type: "password",
  checked: isChecked,
  onChange: handleChange
}