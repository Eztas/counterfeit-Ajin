// リロード, 進む, 戻るでこの画面に遷移したときは強制的にindex.htmlに戻す.
window.addEventListener('pageshow', () => { // いらんけど無駄ではないしおいとこ
    switch(performance.getEntriesByType("navigation")[0].type) {
        case "reload":
            window.location.replace("index.html");
            break;
        case "back_forward":
            window.location.replace("index.html");
            break;
        default: // navigate, prerender(prerenderの検知ほとんどないけど)
            send_answers_to_google_form();
            break;
    }
});

function send_answers_to_google_form(){
    var limit_break_id = sessionStorage.getItem('limit_break');
    //localStorage.getItem('limit_break');
    sessionStorage.clear();

    const this_url = new URL(window.location.href);
    const params = this_url.searchParams;
    const value_score = params.get("value");
    const value_username = params.get("username");
    const url_form = "https://docs.google.com/forms/d/e/1FAIpQLSeaUJsa97gQH_0_p8pcYm-X1xLHP6rDbfz-PIIN5u3ZCO-S5Q/formResponse";

    document.getElementById("field_name").value = value_username;
    document.getElementById("field_score").value = value_score;
    document.getElementById("field_bf").value = "Boom Boom Back";

    document.getElementById("name_id").textContent = String(value_username);
    document.getElementById("score_id").textContent = String(value_score);
    document.getElementById("bf_id").textContent = "If you reload, you can back to the first screen.";

    if(limit_break_id == "Betrayal Game"){
        const form = document.forms["score_form"];
        const formData = new FormData(form);
        const xhr = new XMLHttpRequest();
    
        xhr.open("POST", url_form);
        xhr.send(formData);
    }
}