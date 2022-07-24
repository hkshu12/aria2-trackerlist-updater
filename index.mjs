const JSONRPC_VER = "2.0";
const METHOD = "aria2.changeGlobalOption";

const defaultOptions = {
  method: "post",
  host: "localhost",
  port: "6800",
  token: undefined,
};

const args = process.argv.slice(2);
const cliOptions = (function parseArgs(args) {
  return args.reduce((opt, arg) => {
    const [k, v] = arg.split("=");
    opt[k] = v;
    return opt;
  }, {});
})(args);

const options = {
  ...defaultOptions,
  ...cliOptions,
};
console.log(
  "trying to update tracker list with the following options:\n",
  JSON.stringify(options, null, 2)
);

let trackers = "";
try {
  trackers = await fetch(
    "https://raw.githubusercontent.com/ngosang/trackerslist/master/trackers_all.txt"
  ).then((res) => res.text());
} catch (e) {
  console.error("获取 tracker list 失败，请检查本地到github的网络连接情况");
  console.error(
    "failed to fetch tracker list, check your connection to github"
  );
  console.error(e);
  process.exit(1);
}

const URL = `http://${options.host}:${options.port}/jsonrpc`;
const uuid = Date.now().toString(16);
const params = options.token
  ? [`token:${options.token}`, { "bt-tracker": trackers }]
  : [{ "bt-tracker": trackers }];

try {
  let request;
  switch (options.method.toUpperCase()) {
    case "GET": {
      const paramsStr = JSON.stringify(params);
      const payload = {
        id: uuid,
        jsonrpc: JSONRPC_VER,
        method: METHOD,
        params: Buffer.from(paramsStr, "utf-8").toString("base64"),
      };
      const query = Object.entries(payload)
        .map(([k, v]) => `${k}=${v}`)
        .join("&");
      request = fetch(`${URL}?${query}`, {
        method: options.method,
      }).then((res) => res.json());
      break;
    }
    case "POST": {
      const payload = JSON.stringify({
        id: uuid,
        jsonrpc: JSONRPC_VER,
        method: METHOD,
        params,
      });
      request = fetch(URL, {
        method: options.method,
        body: payload,
      }).then((res) => res.json());
      break;
    }
  }

  const response = await request;
  console.log("Aria2 Reponse: ", response);
  console.log("Aria2 Reponse: ", response.result ?? response.error);
} catch (e) {
  console.error("连接到 aria2 服务器失败，请检查输入的 host, port 是否正确");
  console.error(
    "failed to post message to aria2 rpc interface, check the host & port"
  );
  console.error(e);
  process.exit(1);
}
