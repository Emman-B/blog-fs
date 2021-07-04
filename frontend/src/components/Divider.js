
/**
 * Simple divider, using a border-top style and the <hr> element
 * @param {object} props style of divider
 * @returns JSX object for divider
 */
function Divider(props) {
  const style = (props.style)?props.style: {
    borderTop: '1px solid grey'
  };

  // component return function
  return (
    <hr style={style} />
  );
}

export default Divider;
