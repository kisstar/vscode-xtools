import * as vscode from 'vscode';
import {
  LOG_PRE_REGEX,
  LOG_REGEX,
  messageError,
  messageInfo
} from '../lib/utils';

/**
 * Insert print statement
 * @returns {void}
 */
export const addLog = () => {
  const { window, commands, Range } = vscode;
  const { activeTextEditor } = window;
  const { executeCommand } = commands;

  if (!activeTextEditor) {
    messageError("Can't insert log because no document is open");
    return;
  }

  const { document, selection } = activeTextEditor;
  const text = document.getText(selection);

  if (!text.trim()) {
    return;
  }

  executeCommand('editor.action.insertLineAfter').then(() => {
    const content = `console.log('${text}: ', ${text});`;
    const range = new Range(selection.start, selection.end);

    activeTextEditor.edit((editBuilder) => {
      editBuilder.replace(range, content);
    });
  });
};

/**
 * Convert content to print statement
 * @returns {void}
 */
export const convertLog = () => {
  const { window, commands } = vscode;
  const { activeTextEditor } = window;
  const { executeCommand } = commands;

  if (!activeTextEditor) {
    messageError("Can't convert content because no document is open");
    return;
  }

  const { document, selection } = activeTextEditor;
  const { getWordRangeAtPosition } = document;
  const position = getWordRangeAtPosition(selection.anchor, LOG_PRE_REGEX);

  if (!position) {
    messageError("Can't convert because there is no matching content");
    return;
  }

  const content = document.getText(position);
  const matchResult = content.match(LOG_PRE_REGEX);
  const logContent = matchResult![1];

  activeTextEditor
    .edit((editBuilder) => {
      editBuilder.replace(
        position,
        `console.log('${logContent}: '${logContent})`
      );
    })
    .then(() => {
      // Move cursor position
      executeCommand('cursorMove', {
        to: 'wrappedLineEnd'
      });
    });
};

/**
 * Remove print statement
 * @returns {void}
 */
export const removeLog = () => {
  const { window, workspace, WorkspaceEdit } = vscode;
  const { activeTextEditor } = window;

  if (!activeTextEditor) {
    messageError("Can't remove log because no document is open");
    return;
  }

  const { document } = activeTextEditor;
  const { lineCount } = document;
  const workspaceEdit = new WorkspaceEdit();
  let logCount = 0;

  for (let row = 0; row < lineCount; row++) {
    const line = document.lineAt(row);
    const { text } = line;

    LOG_REGEX.lastIndex = 0;

    if (!LOG_REGEX.test(text)) {
      continue;
    }

    workspaceEdit.delete(document.uri, line.range);
    logCount++;
  }

  if (!logCount) {
    return;
  }

  workspace.applyEdit(workspaceEdit).then(() => {
    messageInfo(
      `${logCount} print statement${logCount > 1 ? 's' : ''} removed`
    );
  });
};
