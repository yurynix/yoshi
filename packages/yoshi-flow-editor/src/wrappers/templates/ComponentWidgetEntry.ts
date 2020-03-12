import t from './template';

type Opts = Record<
  'widgetWrapperPath' | 'componentFileName' | 'componentName',
  string
>;

export default t<Opts>`
  import WidgetWrapper from '${({ widgetWrapperPath }) => widgetWrapperPath}';
  import Widget from '${({ componentFileName }) => componentFileName}';

  export default { component: WidgetWrapper(Widget, '${({ componentName }) =>
    componentName}')};
`;
