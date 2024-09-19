import vscode from "vscode";

export enum StatusBarStatus {
  Disabled,
  Enabled,
  Paused,
}

export class StatusBar {
  private _status?: StatusBarStatus;
  private _statusBarItem: vscode.StatusBarItem;

  loading = false;

  constructor(align?: vscode.StatusBarAlignment, priority?: number) {
    this._statusBarItem = vscode.window.createStatusBarItem(
      align || 2,
      priority,
    );
    this.toggleLoading(false, StatusBarStatus.Enabled);
  }

  show() {
    this._statusBarItem.show();
  }
  hide() {
    this._statusBarItem.hide();
  }
  dispose() {
    this._statusBarItem.dispose();
  }
  get statusBarItem() {
    return this._statusBarItem;
  }
  toggleLoading(bool?: boolean, status?: StatusBarStatus) {
    bool && (this.loading = bool);
    status && (this._status = status);
    if (bool) {
      this._statusBarItem.text = this.loading
        ? "$(loading~spin) CodeAid"
        : this.getStatusBarItemText();
      this._statusBarItem.tooltip = this.getStatusBarItemTooltip();
    } else {
      this._statusBarItem.text = "$(code-aid) CodeAid";
    }
    this.show();
  }
  getStatusBarItemTooltip() {
    switch (this._status) {
      case undefined:
      case StatusBarStatus.Disabled:
        return "点击启用代码辅助功能";
        break;
      case StatusBarStatus.Enabled:
        return "代码辅助功能已启用";
        break;
      case StatusBarStatus.Paused:
        return "代码辅助功能已暂停";
        break;
    }
  }
  getStatusBarItemText() {
    switch (this._status) {
      case undefined:
      case StatusBarStatus.Disabled:
        return "$(circle-slash) CodeAid";
        break;
      case StatusBarStatus.Enabled:
        return "$(check) CodeAid";
        break;
      case StatusBarStatus.Paused:
        return "$(debug-pause) CodeAid";
        break;
    }
  }
}
