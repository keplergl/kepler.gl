import {useEffect} from 'react';
import {generateHashId} from 'utils/utils';

export default function RequestMapStyle({
  defaultMapStyles,
  mapStyles,
  loadMapStyles,
  requestMapStyles
}) {
  useEffect(
    () => {
      const defaultStyles = Object.values(defaultMapStyles);
      // add id to custom map styles if not given
      const customStyles = (mapStyles || []).map(ms => ({
        ...ms,
        id: ms.id || generateHashId()
      }));

      const allStyles = [...customStyles, ...defaultStyles].reduce(
        (accu, style) => {
          const hasStyleObject = style.style && typeof style.style === 'object';
          accu[hasStyleObject ? 'toLoad' : 'toRequest'][style.id] = style;

          return accu;
        },
        {toLoad: {}, toRequest: {}}
      );
      loadMapStyles(allStyles.toLoad);
      // TODO: Make the side effect here and then call loadMapStyles
      requestMapStyles(allStyles.toRequest);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      // This is intentional. This effect is only called once, on mount.
    ]
  );
  return null;
}
