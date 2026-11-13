// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {screen} from '@testing-library/react';
import {renderWithTheme} from 'test/helpers/component-jest-utils';
import RadiusLegend from './radius-legend';

const props: React.ComponentProps<typeof RadiusLegend> = {
  width: 180,
  scaleType: 'sqrt',
  domain: [0, 100],
  range: [0, 50],
  fieldType: 'real'
};

const circles = (container: HTMLElement) => Array.from(container.querySelectorAll('circle'));

describe('RadiusLegend', () => {
  test('renders square-root radii with matching labels and guide lines', () => {
    const {container} = renderWithTheme(<RadiusLegend {...props} />);
    // A quarter of the maximum value has half its radius, not a quarter.
    const label = screen.getByText('20');
    const labels = Array.from(label.parentElement?.children || []);
    const renderedCircles = circles(container);
    const index = labels.indexOf(label);
    expect(Number(renderedCircles[index].getAttribute('r'))).toBeCloseTo(Math.sqrt(0.2) * 50 - 1);
    expect(renderedCircles[0]).toHaveAttribute('r', '0');
    expect(renderedCircles[renderedCircles.length - 1]).toHaveAttribute('r', '49');
    expect(container.querySelectorAll('line')).toHaveLength(labels.length);
    expect(renderedCircles).toHaveLength(labels.length);
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  test('includes non-round domain endpoints when there is room for them', () => {
    renderWithTheme(<RadiusLegend {...props} domain={[3, 97]} range={[2, 100]} />);
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('97')).toBeInTheDocument();
  });

  test('removes crowded ticks while retaining the maximum', () => {
    const {container} = renderWithTheme(<RadiusLegend {...props} />);
    const maximum = screen.getByText('100');
    const labels = Array.from(maximum.parentElement?.children || []) as HTMLElement[];
    expect(labels.length).toBeLessThan(11); // The unfiltered 0..100 ticks have step 10.
    for (let index = 1; index < labels.length; index++) {
      const gap = Math.abs(
        parseFloat(labels[index].style.top) - parseFloat(labels[index - 1].style.top)
      );
      expect(gap).toBeGreaterThan(9);
    }
    expect(circles(container)).toHaveLength(labels.length);
  });

  test('formats labels by field type and updates when domain, range or type changes', () => {
    const {container, rerender} = renderWithTheme(
      <RadiusLegend {...props} domain={[1.25, 9.75]} range={[2, 100]} />
    );
    expect(screen.getByText('1.25')).toBeInTheDocument();
    expect(screen.getByText('9.75')).toBeInTheDocument();
    rerender(
      <RadiusLegend {...props} domain={[1000, 9000]} range={[10, 80]} fieldType="integer" />
    );
    expect(screen.queryByText('9.75')).not.toBeInTheDocument();
    expect(screen.getByText('1,000')).toBeInTheDocument();
    expect(screen.getByText('9,000')).toBeInTheDocument();
    const updated = circles(container);
    expect(updated[0]).toHaveAttribute('r', '9');
    expect(updated[updated.length - 1]).toHaveAttribute('r', '79');
  });

  test('renders a single value without duplicate labels for a constant domain', () => {
    const {container} = renderWithTheme(<RadiusLegend {...props} domain={[5, 5]} />);
    expect(screen.getAllByText('5')).toHaveLength(1);
    expect(circles(container)).toHaveLength(1);
    expect(circles(container)[0]).toHaveAttribute('r', '24');
  });

  test.each([NaN, Infinity, -Infinity])('does not render a non-finite domain (%s)', invalid => {
    const {container} = renderWithTheme(<RadiusLegend {...props} domain={[0, invalid]} />);
    expect(container).toBeEmptyDOMElement();
  });

  test('warns for an unsupported scale and recovers when changed to sqrt', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    try {
      const {container, rerender} = renderWithTheme(<RadiusLegend {...props} scaleType="linear" />);
      expect(container).toBeEmptyDOMElement();
      expect(warn).toHaveBeenCalledWith('Unsupported radius scale type: linear');
      rerender(<RadiusLegend {...props} />);
      expect(screen.getByText('100')).toBeInTheDocument();
    } finally {
      warn.mockRestore();
    }
  });

  test('omits the legend when the radius range has no room for ticks', () => {
    const {container} = renderWithTheme(<RadiusLegend {...props} range={[0, 0]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
