const comMsg = {
  appErrTitle: "アプリエラー",
  loginFailTitle: "ログイン失敗",
  registerSuccessTitle: "登録成功",
  registerFailTitle: "登録失敗",
  notificationTitle: "処理確認",
  networkErrorTitle: "ネットワークエラー",
  appErrMessage: "エラー発生しています。リポートでお問い合わせてください。",
  noLocalRefreshTokenMessage: `エラー発生しています。リポートでお問い合わせてください。\n(Error: local refresh token)`,
  passwordUnmatchMessage: `確認パスワードはパスポートと不一致です。もう一度入力してください。`,
  registerMemberMessage: "新規会員登録完了しました。",
};
export const errorMessages = [
  { Code: "E0100", Title: comMsg.appErrTitle, Message: comMsg.noLocalRefreshTokenMessage },
  { Code: "E0101", Title: comMsg.appErrTitle, Message: "下記の資料を入力してください。" },

  { Code: "E0102", Title: comMsg.appErrTitle, Message: `${comMsg.appErrMessage}\n(Error: No current room been set)` },
  { Code: "E0103", Title: comMsg.appErrTitle, Message: comMsg.noLocalRefreshTokenMessage },
  { Code: "E0104", Title: comMsg.appErrTitle, Message: `${comMsg.appErrMessage}\n(Error: logout process failed)` },

  { Code: "E0105", Title: comMsg.loginFailTitle, Message: `メールとパスワードを入力してください。` },
  { Code: "E0106", Title: comMsg.loginFailTitle, Message: `${comMsg.appErrMessage}\n` },

  { Code: "E0107", Title: comMsg.registerFailTitle, Message: comMsg.passwordUnmatchMessage },
  { Code: "E0108", Title: comMsg.registerFailTitle, Message: `${comMsg.appErrMessage}\n` },

  { Code: "E0109", Title: comMsg.appErrTitle, Message: `${comMsg.appErrMessage}\n(Error: cannot get default room)` },
  { Code: "E0110", Title: comMsg.appErrTitle, Message: comMsg.noLocalRefreshTokenMessage },
  { Code: "E0111", Title: comMsg.appErrTitle, Message: `${comMsg.appErrMessage}\n(Error: cannot list rooms)` },
  { Code: "E0112", Title: "ルーム登録失敗", Message: `${comMsg.appErrMessage}\n` },

  { Code: "E0113", Title: comMsg.registerFailTitle, Message: "新規会員登録失敗しました。設定画面でレポートしてください。" },
  { Code: "E0114", Title: comMsg.loginFailTitle, Message: `${comMsg.appErrMessage}\n` },
  { Code: "E0115", Title: comMsg.registerFailTitle, Message: comMsg.passwordUnmatchMessage },
  { Code: "E0116", Title: comMsg.registerFailTitle, Message: `${comMsg.appErrMessage}\n` },

  { Code: "E0117", Title: comMsg.networkErrorTitle, Message: "インターネットに接続されていません。" },
  { Code: "E0118", Title: comMsg.networkErrorTitle, Message: "不明なエラーが発生してます。連絡してください。" },

  { Code: "E0117", Title: comMsg.networkErrorTitle, Message: "設定が保存されています。アプリを再起動ください。" },
  { Code: "E0118", Title: comMsg.networkErrorTitle, Message: "インターネットに接続されていません。" },
];

export const infoMessages = [
  { Code: "I0001", Title: "ログアウト", Message: "ログアウトしますか？" },
  { Code: "I0002", Title: comMsg.registerSuccessTitle, Message: comMsg.registerMemberMessage },
  { Code: "I0003", Title: comMsg.notificationTitle, Message: "料理を削除しますか？" },
  { Code: "I0004", Title: comMsg.notificationTitle, Message: "使用ルームを変更しました。" },
  { Code: "I0005", Title: comMsg.notificationTitle, Message: "前回の設定を使用しますか？" },
  { Code: "I0006", Title: comMsg.registerSuccessTitle, Message: comMsg.registerMemberMessage },
];
