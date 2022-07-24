# Aria2 Trackerlist Updater

## TOC

- [Aria2 Trackerlist Updater](#aria2-trackerlist-updater)
  - [TOC](#toc)
  - [Description](#description)
  - [Example](#example)
  - [Configuration](#configuration)

## Description

update aria2 trackerlist through rpc interface.

only tested with Node.js v18.6.0, you may encounter something unexpected with other Node.js version since Fetch API is not stable.

## Example

```bash
# start it with npm (or any other node package manager you're using)
npm run update token=$$secret$$
# or just use node
node ./index.mjs token=$$secret$$
```

## Configuration
| Key    | Default Value | Description                                                                                                                       |
| ------ | :-----------: | :-------------------------------------------------------------------------------------------------------------------------------- |
| host   |  "localhost"  | the host your aria2 server running on                                                                                             |
| method |    "post"     | "post" / "get", case-insensitive                                                                                                  |
| port   |    "6800"     | the port your aria2 rpc server listening, by default it is 6800                                                                   |
| token  |      ""       | see [aria2 secret token](https://aria2.github.io/manual/en/html/aria2c.html#rpc-auth), leave it empty if you didn't configure one |

You can both configure them in the command line (`key=value`) or modify `defaultOption` in index.mjs

Notice that **configuration in the command line will override the `defaultOption`**.