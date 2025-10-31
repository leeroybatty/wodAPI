import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Accordion from './Accordion'

export default {
  title: 'Components/Accordion',
  component: Accordion,
} as ComponentMeta<typeof Accordion>

const Template: ComponentStory<typeof Accordion> = (args) => <Accordion {...args} />

export const Default = Template.bind({})
Default.args = {
  title: "Accordion",
  children: <p>Lorem ipsum sit dolor amet</p>
}
