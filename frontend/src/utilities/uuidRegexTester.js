
// regex used from the following site: https://www.uuidtools.com/what-is-uuid
const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

/**
 * Tests if a string is a valid uuid.
 * @param {string} uuid input to test if it is a valid uuid
 * @returns {boolean} uuid regex match result
 */
export function uuidIsValid(uuid) {
  // return true if the uuid parameter contains the uuid 
  if (uuidRegex.test(uuid)) {
    return true;
  }
  // otherwise, return false
  return false;
}
