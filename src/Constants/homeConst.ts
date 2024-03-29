export const DrawerLabel = {
  random: "献立を決める",
  room: "ルーム管理",
  report: "みんなのレポート",
  bookmarked: "お気入り",
  receipe: "マイレシピ",
  profile: "マイプロフィール",
  history: "履歴",
  setting: "設定",
  logout: "ログアウト",
};

export const logoutPopout = {
  title: "ログアウト",
  description: "ログアウトしますか?",
  confirm: "確認",
  cancel: "キャンセル",
};
//for TipsContext, tips pop up display when user click "?" button in the header
export const functionCategory = {
  default: 0,
  random: 1,
  room: 2,
  report: 3,
  favorite: 4,
  receipe: 5,
  profile: 6,
  history: 7,
  setting: 8,
};
export const functionTipsMessage = {
  0: [""],
  1: ["Umakaseはあなたに今晩の料理おすすめできます。真ん中のボタンをクリックして始めましょう。"],
  2: ["Umakaseはルームメイトや家族の料理も提案できます。", "まず、ルームを作成して、プラスボタンをクリックし、ルームメイトを追加してください。"],
  // "未使用ボタンをクリックし、ルームメイトをメッセージをか確認した後、皆の料理で提案できる。"],
  3: ["out of scope"],
  4: [
    "このページに食べないものとお気入り料理を記録されています。Umakaseはこの記録によって料理をおすすめます。",
    "ここの料理はいつでも設定できます。料理を選択し、コミ箱をクリックし、登録データから外す。又はお気入りをクリックしてお気入り料理を設定する。",
    "再設定したい場合、プラスボタンをクリックして、指示を従ってください。",
  ],
  5: ["out of scope"],
  6: [""],
  7: [""],
  8: [""],
};
export const tipCloseStr = "閉じる";
export const registerCheckCategory = {
  default: 0,
  emailInput: 1,
  usernameInput: 2,
  passwordInput: 3,
  confirmPasswordInput: 4,
  emailExist: 5,
  emailInvalid: 6,
  passwordUnmatch: 7,
  passwordMinimum: 8,
};
export const registerCheckMessage = {
  0: "",
  1: "メールアドレスを入力してください。",
  2: "ユーザー名を入力してください。",
  3: "パスワードを入力してください。",
  4: "確認用パスワードを入力ください。",
  5: "メールアドレスが登録されています。別のメールアドレスを入力ください。",
  6: "有効のメールアドレスを入力してください。",
  7: "確認パスワードはパスポートと不一致です。もう一回入力してください。",
  8: "パスワードは5文字以上で入力してください。",
};

export const registerResultTitle = {
  success: "登録成功",
  failure: "登録失敗",
};
export const registerPopUp = {
  registerSuccess: { title: "登録成功", message: "新規会員登録完了しました。" },
  registerFailure: { title: "登録失敗", message: "新規会員登録失敗しました。設定画面で" },
  loginFailure: { title: "ログイン失敗" },
};
