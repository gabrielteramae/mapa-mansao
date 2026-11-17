/** Dummy Nitro entry so the static GitHub Pages build has a server input. */
export default {
  fetch() {
    return new Response("ok");
  },
};
