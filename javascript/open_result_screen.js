function open_other_window(score_to_kill_sat) {
    const limit_break_id = "Betrayal Game";
    var username = new URLSearchParams(window.location.search).get("username");
    sessionStorage.setItem('limit_break', limit_break_id);
    //localStorage.setItem('limit_break', limit_break_id);
    //window.location.href = "result.html?value="+score_to_kill_sat+"&username="+username; // safariでやると, 戻った時に前の記録が残ったままだった
    window.location.replace("result.html?value="+score_to_kill_sat+"&username="+username);
}
