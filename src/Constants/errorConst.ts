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
const errorMessage = [
  { Key: "E0100", Title: comMsg.appErrTitle, Message: comMsg.noLocalRefreshTokenMessage },
  { Key: "E0101", Title: comMsg.appErrTitle, Message: "下記の資料を入力してください。" },

  { Key: "E0102", Title: comMsg.appErrTitle, Message: `${comMsg.appErrMessage}\n(Error: No current room been set)` },
  { Key: "E0103", Title: comMsg.appErrTitle, Message: comMsg.noLocalRefreshTokenMessage },
  { Key: "E0104", Title: comMsg.appErrTitle, Message: `${comMsg.appErrMessage}\n(Error: logout process failed)` },

  { Key: "E0105", Title: comMsg.loginFailTitle, Message: `メールとパスワードを入力してください。` },
  { Key: "E0106", Title: comMsg.loginFailTitle, Message: `${comMsg.appErrMessage}\n` },

  { Key: "E0107", Title: comMsg.registerFailTitle, Message: comMsg.passwordUnmatchMessage },
  { Key: "E0108", Title: comMsg.registerFailTitle, Message: `${comMsg.appErrMessage}\n` },

  { Key: "E0109", Title: comMsg.appErrTitle, Message: `${comMsg.appErrMessage}\n(Error: cannot get default room)` },
  { Key: "E0110", Title: comMsg.appErrTitle, Message: comMsg.noLocalRefreshTokenMessage },
  { Key: "E0111", Title: comMsg.appErrTitle, Message: `${comMsg.appErrMessage}\n(Error: cannot list rooms)` },
  { Key: "E0112", Title: "ルーム登録失敗", Message: `${comMsg.appErrMessage}\n` },

  { Key: "E0113", Title: comMsg.registerFailTitle, Message: "新規会員登録失敗しました。設定画面でレポートしてください。" },
  { Key: "E0114", Title: comMsg.loginFailTitle, Message: `${comMsg.appErrMessage}\n` },
  { Key: "E0115", Title: comMsg.registerFailTitle, Message: comMsg.passwordUnmatchMessage },
  { Key: "E0116", Title: comMsg.registerFailTitle, Message: `${comMsg.appErrMessage}\n` },

  { Key: "E0117", Title: comMsg.networkErrorTitle, Message: "インターネットに接続されていません。" },
  { Key: "E0118", Title: comMsg.networkErrorTitle, Message: "不明なエラーが発生してます。連絡してください。" },

  { Key: "E0117", Title: comMsg.networkErrorTitle, Message: "設定が保存されています。アプリを再起動ください。" },
  { Key: "E0118", Title: comMsg.networkErrorTitle, Message: "インターネットに接続されていません。" },
];
const infoMessage = [
  { Key: "I0001", Title: "ログアウト", Message: "ログアウトしますか？" },
  { Key: "I0002", Title: comMsg.registerSuccessTitle, Message: comMsg.registerMemberMessage },
  { Key: "I0003", Title: comMsg.notificationTitle, Message: "料理を削除しますか？" },
  { Key: "I0004", Title: comMsg.notificationTitle, Message: "使用ルームを変更しました。" },
  { Key: "I0005", Title: comMsg.notificationTitle, Message: "前回の設定を使用しますか？" },
  { Key: "I0006", Title: comMsg.registerSuccessTitle, Message: comMsg.registerMemberMessage },
];
