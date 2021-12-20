/**
 * @description Display a message box to the user
 */

import * as vscode from 'vscode';

const { showInformationMessage, showErrorMessage } = vscode.window;

export const messageInfo = (message: string) => showInformationMessage(message);

export const messageError = (message: string) => showErrorMessage(message);
