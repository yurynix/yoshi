import React from 'react';
import { render } from '@testing-library/react';
import { IWixStatic } from '@wix/native-components-infra/dist/src/types/wix-sdk';
import { Settings } from './Settings';

jest.mock('@wix/wix-base-ui', () => ({
  ...jest.requireActual('@wix/wix-base-ui'),
  Slider: () => <div data-testid="base-ui-slider" />,
  ColorPickerColorSpace: () => <div data-testid="base-ui-color-picker" />,
}));

describe('Settings', () => {
  const styleParams = {
    colors: {
      backgroundColor: {
        value: '#F8EE28',
      },
    },
    fonts: {
      fontSize: {
        size: 16,
      },
    },
  };

  const Wix: IWixStatic = {
    // @ts-ignore we're only partially mocking Wix object
    Styles: {
      getStyleParams: (callback: Function) => callback(styleParams),
      setFontParam: () => {},
      setColorParam: () => {},
    },
  };

  it('should render a color picker component', () => {
    const { getAllByTestId } = render(<Settings Wix={Wix} />);
    expect(getAllByTestId('base-ui-color-picker')).not.toBeNull();
  });

  it('should render a font size picker', () => {
    const { getByTestId } = render(<Settings Wix={Wix} />);
    expect(getByTestId('base-ui-slider')).not.toBeNull();
  });
});
