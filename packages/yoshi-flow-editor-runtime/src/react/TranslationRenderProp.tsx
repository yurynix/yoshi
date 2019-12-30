import React from 'react';
import PropTypes, { InferProps } from 'prop-types';
import { translate } from 'react-i18next';

class TranslateComponent extends React.Component<
  InferProps<typeof TranslateComponent.propTypes>
> {
  static propTypes = {
    children: PropTypes.func.isRequired,
  };

  render() {
    const { children } = this.props;
    return translate()(children);
  }
}

export const Translation = TranslateComponent;
