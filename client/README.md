BrowserQuest client documentation
=================================

Local Development
-----------------

The validated local path is the unbuilt client at `/client/`, served from the repository root.

Example from the repository root:

```powershell
python -m http.server 9090
```

Then open:

```text
http://localhost:9090/client/
```

Do not run the static server from inside `client/`; the browser loads `../shared/js/gametypes.js`.


Production Build
----------------

The original deployment flow builds `client-build/`, but that path has not been revalidated in this modernization baseline.

Original deployment steps:

1) Configure the websocket host/port:

In the client/config/ directory, copy config_build.json-dist to a new config_build.json file.
Edit the contents of this file to change host/port settings.

2) Run the following commands from the project root:

(Note: nodejs is required to run the build script)

* cd bin
* chmod +x build.sh
* ./build.sh

This will use the RequireJS optimizer tool to create a client-build/ directory containing a production-ready version of BrowserQuest. 

A build log file will also be created at bin/build.txt.

The client-build directory can be renamed and deployed anywhere. It has no dependencies to any other file/folder in the repository.

Important: the optimized build uses the old RequireJS optimizer and production host pragmas. Validate `client-build/` separately before relying on it.
