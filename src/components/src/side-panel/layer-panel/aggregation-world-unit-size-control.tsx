// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Layer, estimateAggregationCellCount, isAggregationCellCountSlow} from '@kepler.gl/layers';
import AggregationSizeWarning from './aggregation-size-warning';
import VisConfigSliderFactory from './vis-config-slider';

type VisConfigSlider = ReturnType<typeof VisConfigSliderFactory>;

type AggregationWorldUnitSizeControlProps = {
  layer: Layer;
  VisConfigSlider: VisConfigSlider;
  visConfiguratorProps: any;
  pointCount?: number;
};

export default function AggregationWorldUnitSizeControl({
  layer,
  VisConfigSlider,
  visConfiguratorProps,
  pointCount = 0
}: AggregationWorldUnitSizeControlProps) {
  const committed = layer.config.visConfig.worldUnitSize as number;
  const kind = (layer.type === 'hexagon' ? 'hexagon' : 'grid') as 'grid' | 'hexagon';
  const bounds = layer.meta?.bounds as number[] | undefined;

  const [draft, setDraft] = useState(committed);
  const [pendingConfirm, setPendingConfirm] = useState(false);

  useEffect(() => {
    setDraft(committed);
    setPendingConfirm(false);
  }, [committed]);

  const cellCount = useMemo(
    () => estimateAggregationCellCount(bounds, draft, kind, pointCount || undefined),
    [bounds, draft, kind, pointCount]
  );

  const sliderLayer = useMemo(
    () => ({
      config: {
        ...layer.config,
        visConfig: {
          ...layer.config.visConfig,
          worldUnitSize: draft
        }
      }
    }),
    [layer.config, draft]
  );

  const onSliderChange = useCallback(
    (v: Record<string, number | string | number[] | string[]>) => {
      const next = v.worldUnitSize as number;
      setDraft(next);
      const nextCount = estimateAggregationCellCount(bounds, next, kind, pointCount || undefined);
      const committedCount =
        estimateAggregationCellCount(bounds, committed, kind, pointCount || undefined) || 0;
      if (
        isAggregationCellCountSlow(nextCount, pointCount) &&
        (nextCount as number) > committedCount
      ) {
        setPendingConfirm(true);
        return;
      }
      setPendingConfirm(false);
      visConfiguratorProps.onChange({worldUnitSize: next});
    },
    [bounds, kind, committed, pointCount, visConfiguratorProps]
  );

  const onCancel = useCallback(() => {
    setDraft(committed);
    setPendingConfirm(false);
  }, [committed]);

  const onConfirm = useCallback(() => {
    setPendingConfirm(false);
    visConfiguratorProps.onChange({worldUnitSize: draft});
  }, [draft, visConfiguratorProps]);

  return (
    <>
      <VisConfigSlider
        {...layer.visConfigSettings.worldUnitSize}
        {...visConfiguratorProps}
        layer={sliderLayer as Layer}
        onChange={onSliderChange}
      />
      {pendingConfirm ? (
        <AggregationSizeWarning
          cellCount={cellCount ?? 0}
          requireConfirm
          onCancel={onCancel}
          onConfirm={onConfirm}
        />
      ) : null}
    </>
  );
}
