// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { addLog, removeLog } from './commands';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Register commands
  const disposableLog = vscode.commands.registerCommand('xtools.log', addLog);
  const disposableRemoveLog = vscode.commands.registerCommand(
    'xtools.remove_log',
    removeLog
  );

  context.subscriptions.push(disposableLog);
  context.subscriptions.push(disposableRemoveLog);
}

// this method is called when your extension is deactivated
export function deactivate() {}
