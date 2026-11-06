const timer = setInterval(() => {}, 86400000);
const stop = () => {
  clearInterval(timer);
  process.exit(0);
};
process.once("SIGINT", stop);
process.once("SIGTERM", stop);
