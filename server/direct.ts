/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2022 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import { resolve } from "path";
import { runPythonServer } from "./main.js";
import { getLocalDirectory } from "./fs-utils.js";
import { startFileWatcher } from "./file-watcher.js";

const baseDir = resolve(getLocalDirectory(import.meta.url));
const relativeDir =
  "../node_modules/pyright/dist/pyright-langserver.js";
runPythonServer(baseDir, relativeDir);

startFileWatcher();