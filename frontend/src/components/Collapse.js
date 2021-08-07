// style import
import { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import useMeasure from 'react-use-measure';
import './Collapse.css';

/**
 * Explanation of implementation (for future reference):
 *    A problem I came across was using react-use-measure with a collapsing
 * component, because it would measure the collapsed height (which is 0).
 * This results in the collapse only working when collapsing, but not
 * uncollapsing (It knows how to go from 100 -> 0, but not from 0 -> 100 since
 * the 100 gets overwritten with a 0). A fix will look something like this:
 *
 *    <animated.div style={style} className={'YOUR_CLASS_HERE'}>
 *      <div ref={ref} children={children}/>
 *    </animated.div>
 * 
 * This requires the following style:
 *    .YOUR_CLASS_HERE {
 *        overflow: hidden;
 *    }
 * 
 *    The animated.div will accept the style that the react-spring useSpring
 * hook returns. Then inside the animated.div, it accepts the ref and children.
 * The ref is from useMeasure so that it can measure the entire div. The
 * entire div would then have the children to render.
 *    The reason why this works is because the only thing that happens when
 * collapsing is the animated.div shrinks its height to 0. However, the inner
 * div is actually the same size. The way to keep it from still appearing
 * is having the "overflow: hidden" style set.
*/

/**
 * This is a Collapse component, animated using react-spring, to
 * vertically list its children and have it collapse or not collapse.
 * @param {object} param0 properties to pass, accepts children property
 * @return JSX of the Collapse component
 */
export default function Collapse ({children}) {
  // state to keep track of
  const [isCollapsed, setIsCollapsed] = useState(true);

  // measure the height of the collapsible
  const [collapsibleRef, {height: viewHeight}] = useMeasure();

  // handles toggling the colllapse state
  const handleCollapseClick = () => {
    setIsCollapsed(!isCollapsed);
  };

  // react-spring hook for animating the height change and opacity change
  const { height, opacity } = useSpring({
    // before state (starts with no height and invisible)
    from: { height: 0, opacity: 0 },
    // after state
    to: {
      height: isCollapsed ? 0 : viewHeight,
      opacity: isCollapsed ? 0 : 1,
    },
  });

  // component return function
  return (
    <div className={'collapse'}>
      <button className={'collapse-button'} onClick={handleCollapseClick}>Menu</button>

      {/* Animated div to have its height and opacity animated */}
      <animated.div className={'collapse-animated-div'} style={{
          // pass in the opacity and height to the animated div's style
          opacity,
          height,
        }}>

        {/* 
          Render the children of the collapsible below.
            - It also uses a ref for the react-use-measure to measure the height of the
            entire content.
        */}
        <div ref={collapsibleRef} children={children} className={'collapse-content'} />
      </animated.div>
    </div>
  );
}

