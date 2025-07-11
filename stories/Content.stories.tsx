import type { Meta, StoryObj } from '@storybook/react-vite';

import { Attributes, Content, Markup, String } from '../src/components/Content.js';
import { ResonanceContext } from '../src/context/ResonanceContext.js';

const meta = {
  title: 'Example/Content',
  component: Content,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    children: { control: ({ a, b }) => 'hello' },
  },
  decorators: [
    Story => (
      <ResonanceContext
        value={{
          'strings-are-great': {
            a: 'friends',
            b: 'How are things?',
            c: `<span>This text is <span style="color:green;font-weight:bold;">GREEN</span>!</span>`,
            imageSrc: 'https://picsum.photos/200/300',
            imageHeight: '200px',
          },
        }}
      >
        <Story />
      </ResonanceContext>
    ),
  ],
  // Use `fn` to spy on the children arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { children: <String attribute="a">Hello</String> },
} satisfies Meta<typeof Content>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Strings: Story = {
  args: {
    contentName: 'strings-are-great',
    children: (
      <div>
        Hello, <String attribute="a">world</String>! <String attribute="b">How are you?</String>
        <div>
          <Markup attribute="c">
            <span>
              This is some <strong>bold</strong> text.
            </span>
          </Markup>
          <Attributes
            attributes={{
              imageSrc:
                'https://media.licdn.com/dms/image/v2/D5603AQFor5CRN78frA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1727924378899?e=1757548800&v=beta&t=DCzKQvE6BVfiRigT4tIeBFiulG38xwML5ZUVex8GVYo',
              imageHeight: '300px',
            }}
          >
            {({ imageSrc, imageHeight }) => (
              <img
                src={imageSrc}
                alt="A random image"
                style={{ width: '200px', height: imageHeight, objectFit: 'cover' }}
              />
            )}
          </Attributes>
        </div>
      </div>
    ),
  },
};
