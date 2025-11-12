import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import TabGroup from "./TabGroup";
export default {
  title: "General/Tabgroup",
  component: TabGroup,
} as ComponentMeta<typeof Tab>;

const Template: ComponentStory<typeof Tab> = (args) => <TabGroup {...args} />;

export const Default = Template.bind({});
Default.args = {
  id: "example-id",
  tabs: [{ name: "foo", content: <div>"lol1"</div>}, { name: "bar", content: <div>"lol2"</div>} ],
};
