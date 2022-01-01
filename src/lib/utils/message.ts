/**
 * @description Display a message box to the user
 */

import * as vscode from 'vscode';

const { showInformationMessage, showErrorMessage } = vscode.window;

export const messageInfo = (message: string, ...items: string[]) =>
  showInformationMessage(message, ...items);

export const messageError = (message: string, ...items: string[]) =>
  showErrorMessage(message, ...items);
