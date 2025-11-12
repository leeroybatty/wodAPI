import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Link from './Link'

export default {
  title: 'General/Links',
  component: Link,
} as ComponentMeta<typeof Link>

const Template: ComponentStory<typeof Link> = (args) => <Link {...args} />
const InlineTemplate: ComponentStory<typeof ReactNode> = (args) => (
  <p>hamburgefonstiv handgloves <Link {...args} /> hamburgefontsiv
  </p>)

export const DefaultLink = InlineTemplate.bind({})
DefaultLink.args = {
  href: "#",
  children: "click me!"
}

export const NavLink = Template.bind({})
NavLink.args = {
  href: "#",
  type: "navigation",
  children: "click me!"
}

export const ButtonLink = Template.bind({})
ButtonLink.args = {
  href: "#",
  type: "button",
  children: "click me!"
}
