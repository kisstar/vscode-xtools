import * as vscode from 'vscode';
import { messageError } from '../lib/utils';

/**
 * Replace selection
 * @param {string} content New content
 * @returns {void}
 */
const insertText = (content: string) => {
  const { window, Range } = vscode;
  const { activeTextEditor } = window;

  if (!activeTextEditor) {
    messageError("Can't insert log because no document is open");
    return;
  }

  const { selection } = activeTextEditor;
  const range = new Range(selection.start, selection.end);

  activeTextEditor.edit((editBuilder) => {
    editBuilder.replace(range, content);
  });
};

/**
 * Print selection
 * @returns {void}
 */
export const log = () => {
  const { window, commands } = vscode;
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

    insertText(content);
  });
};
