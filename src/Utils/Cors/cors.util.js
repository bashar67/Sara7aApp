export function corsOption() {
  const whiteList = process.env.WHITELIST.split(",");

  const corsOptions = {
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (whiteList.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`DON'T ALLOW THIS ORIGIN ${origin}`));
      }
    },

    method: ["GET", "POST", "PATCH", "DELETE"],
  };

  return corsOptions;
}
