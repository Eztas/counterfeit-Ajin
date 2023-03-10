// Twitterの画面を開いて, 自動遷移
//open_report_Twitter("I killed " + String(kill_sat_num) + "." ,"https://eztas.github.io/","Ajin","anime_ajin");
function open_other_window(score_to_kill_sat) {
    const text = "I killed " + String(score_to_kill_sat) + ".";
    const url = "https://eztas.github.io/";
    const hash = "Ajin";
    const account = "anime_ajin";
    window.location.href = "https://twitter.com/intent/tweet?text="+text+"&url="+url+"&hashtags="+hash+"&via="+account;
    //document.write(text); // Twitterに飛ぶのがうざいとき
}