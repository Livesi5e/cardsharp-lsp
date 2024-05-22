import * as path from "path";
import { workspace, ExtensionContext } from "vscode";
import * as net from "net";

import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  StreamInfo,
  Trace,
} from "vscode-languageclient/node";

let client: LanguageClient;

export function activate(context: ExtensionContext) {
  let connectionInfo ={
    port: 5007
  };

  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the run options are used
  const serverOptions: ServerOptions = () => {
    let socket = net.connect(5007, "h3001372.stratoserver.net");
    let result: StreamInfo = {
      writer: socket,
      reader: socket
    }
    return Promise.resolve(result);
  };

  // Options to control the language client
  const clientOptions: LanguageClientOptions = {
    // Register the server for all documents by default
    documentSelector: [{ scheme: "file", language: "cardsharp" }],
    synchronize: {
      // Notify the server about file changes to '.clientrc files contained in the workspace
      fileEvents: workspace.createFileSystemWatcher("**/.clientrc"),
    },
  };

  // Create the language client and start the client.
  client = new LanguageClient(
    "Cardsharp Server",
    serverOptions,
    clientOptions
  );

  client.setTrace(Trace.Verbose)
  client.start();
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}
