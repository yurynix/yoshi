import { Engine } from 'velocity';

import velocityData from './velocity.data.json';
import velocityDataPrivate from './velocity.private.data.json';

export default (
  url: string,
  data: {
    widgetName?: string;
    clientTopology?: Partial<
      Record<'staticsDomain' | 'staticsBaseUrl', string>
    >;
  } = {},
) =>
  new Engine({ template: url }).render({
    ...velocityData,
    ...velocityDataPrivate,
    ...data,
    clientTopology: {
      ...(velocityData.clientTopology ? velocityData.clientTopology : {}),
      ...(data.clientTopology ? data.clientTopology : {}),
    },
  });
