/**
 * @description Delay the execution of the code
 * @param {*} ms
 * @returns
 */
export async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
