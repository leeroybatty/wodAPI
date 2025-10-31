import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Icon from './Icon'
import navigation from './paths/navigation'
import operation from './paths/operation'

export default {
  title: 'General/Icon',
  component: Icon,
} as ComponentMeta<typeof Icon>

const Template: ComponentStory<typeof Icon> = (args) => {
  return (
    <>
      <h1>Navigation icons</h1>
      {Object.keys(navigation).map((icon, i) => {
        return <Icon key={i} name={icon} {...args} />
      })}

      <h1>Operation icons</h1>
      {Object.keys(operation).map((icon, i) => {
        return <Icon key={i} name={icon} {...args} />
      })}
    </>
  )
}

export const Default = Template.bind({})
Default.args = {
  id: 'example',
  viewbox: '0 0 16 16',
  width: 36
}