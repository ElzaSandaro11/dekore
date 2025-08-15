ignore "patches/@react-native__community-cli-plugin.patch" because it no need anymore.

using fnm to switch node version cuurently using 22:
add this to zshrc or your stuff file : eval "$(fnm env --use-on-cd)"
this will switch version of your node when launch project as a workspace

Error: Invalid loadShareSync function call from runtime #RUNTIME-006: loadShareSync failed!: "eager: true" in rspack.config.mjs. response from chatGPT: Short version: loadShareSync is a Module Federation runtime call that synchronously grabs a shared dependency (like react). You only get to call it if that dependency was marked eager: true (so it’s already loaded). If it wasn’t, the runtime expects you to load it asynchronously behind an async boundary—and throws the error you’re seeing.