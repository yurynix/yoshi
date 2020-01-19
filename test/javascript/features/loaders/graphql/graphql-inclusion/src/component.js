import React from 'react';
import query from './query.graphql';

export default () => (
  <div
    id="graphql-inclusion"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(query) }}
  />
);
