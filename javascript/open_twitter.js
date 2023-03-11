// Twitterの画面を開いて, 自動遷移
function open_other_window(score_to_kill_sat) {
    const text = "I killed " + String(score_to_kill_sat) + ".";
    const url = "https://afternoon.kodansha.co.jp/c/ajin.html";
    const hash = "Ajin";
    const account = "anime_ajin";
    window.location.href = "https://twitter.com/intent/tweet?text="+text+"&url="+url+"&hashtags="+hash+"&via="+account;
}
