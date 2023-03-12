// counterfeit-Ajin
// 今後の発展と課題
// document.getElementById('sat_team').classList.toggle('hide')を使って, 視界悪化と視界明瞭を再現したかったが, 絶対に殺せないのに相手に一方的に撃たれる状況になるのでやめた
// 移動ボタンを使って, 実際の回避動作を再現するか検討中(こっちのページではいいかな, 別ページで実装)
// 自殺の方法が雑
// 想定が佐藤vs研究員の戦闘シーン(戦ってるのSATだけど)なので, フォージ戦などの戦略までもは反映できない悲しみ
// 本来360度方向から狙撃が来るので, その要素も加わるとより面白くなりそう
// この課題はunityでの実装時に補う(JavaScriptじゃかなりきつい), 企業からのバックアップがほしい

// constant

// 元となるsat1のクローン, これによりonloadイベントにおける関数などを逐一呼び出さなくても使用できる.
const original_sat_element = document.getElementById("sat1");
// blood_layerのid要素を格納.
const blood_pool = document.getElementById("blood_layer");
// 1マガジンにある最大の弾数, 最初だけ21という良心(?)設計
const MAX_BULLET_NUM = 21;
// 追加でわきでてくる最大のSATの人数
const MAX_SAT_NUM = 100;

// let

// SATが動く周期
let period_sat_motion = 600;
// SATが現れる周期
let period_sat_appearance = 1700;
// 麻酔銃を撃たれてから寝るまでの時間
let period_my_sleepness = 1400;
// SATが動く横範囲(縦画面での操作が理想なので, スマホ版は横移動範囲を狭める)
let sat_width_of_moving = 340;

// global variable

// SATが存在する時間, 課題:個別の時間として管理できない. 発展: クラスを作り生成したSAT一人一人にこれを付与すれば, 1人1人の存在時間を把握できる.
var exist_time = 0;
// 殺したSAT隊員の数, 最終的なスコアになる.
var kill_sat_num = 0;
// 今までに出現したSATの数, 上限は32767(予定), id番号の代わりにもなる.
var sat_num_in_team = 1;
// ここに新たなSATを生成するたびに, その要素を格納する.
var sat_element;
// setIntervalに用いるタイマ-
var add_sat_timer = null;
// 周りを血で赤くするときの度合いを示す. 初期値は255.
var blood_red = 255;
// プレイヤーが発砲できる銃弾の数, 8発にしたかったけど, ちょっとどころかかなりきつすぎるので, 50発
var bullet_num = 20;

// declared function

// モバイルからアクセスされたのか, PCからアクセスされたかによって, パラメータの値を変更する.
function Mobile_or_PC_environment() {
    var md = new MobileDetect(window.navigator.userAgent);
    if(md.mobile()){
        period_sat_motion = 500;
        period_sat_appearance = 1600;
        period_my_sleepness = 1200;
        sat_width_of_moving = 300;
    }else{
        period_sat_motion = 600;
        period_sat_appearance = 1700;
        period_my_sleepness = 1400;
        sat_width_of_moving = 340;
    }
}

// SATをsetIntervalで非同期で動かす. 死んでいれば血を非表示, 一定時間以上動けば麻酔銃を撃つ(必中なのが問題)
function move_SAT(number_of_sat){
    setInterval(    function (){
        (document.getElementById(number_of_sat)).style.left = sat_width_of_moving * Math.random(); // ランダムな横移動
        (document.getElementById(number_of_sat)).style.top = 50 + 250 * Math.random(); // ランダムな縦移動
        if((document.getElementById(number_of_sat).src).indexOf("blood.png") > -1){ // SATが血である, つまり死んでるならその血の表示を消す.
            (document.getElementById(number_of_sat)).style.display = "none";
            if(number_of_sat != "sat1"){ // sat1はコピー元なので, これが消えると何もできない
                document.getElementById("sat_team").removeChild(document.getElementById(number_of_sat));
            }
        }
        if (document.getElementById('suicide_reset').style.display == "none") { // 自殺ボタンが消えてるときに, 自殺までの条件を徐々に満たす.
            exist_time += 1;
            if(exist_time >= 15){ // 一定時間後に確定なので, 避けられない
                sleep_me();
            }
        }
        if(document.getElementById('imvisible_black_matter').style.display == "inline"){ // IBM消えた後も爪痕残してる厄介者かも
            if(ibm_to_sat_check(document.getElementById('imvisible_black_matter'), document.getElementById(number_of_sat))){
                kill_SAT(number_of_sat);
            }
        }
    }, period_sat_motion);
}

// 自殺して麻酔を消す.
function suicide_me(){
    document.getElementById('gun_audio').currentTime = 0;
    document.getElementById('gun_audio').play();
    document.getElementById('suicide_reset').style.display = "none";
    exist_time = 0; // SATの存在時間をリセットして, 麻酔銃狙撃までの時間を稼ぐ
}

// 麻酔銃を撃たれると, 一定時間以内に自殺できなければプレイヤーは眠らされる.
function sleep_me(){
    let timeout_id = null;

    document.getElementById('suicide_reset').style.display = "inline"; // 眠ると自殺ボタンが出現して, 自殺の準備を始める.
    audio_tranquilizer_gun();

    timeout_id = setTimeout(() => {
        open_other_window(kill_sat_num); // google form or twitter
    }, period_my_sleepness);
    document.getElementById('suicide_reset').addEventListener('click', () => {
        if(bullet_num > 0){
            clearTimeout(timeout_id);
            timeout_id = null;
            suicide_me();
        }
    });
}

// SATを殺す.
function kill_SAT(number_of_sat) {
    if(bullet_num > 0 || document.getElementById('imvisible_black_matter').style.display == "inline"){ // 裏技として, IBMを出してるときは弾がなくてもSATを殺せる.
        audio_bark();
        exist_time = exist_time - 5; // こうしないと復活した直後にまた麻酔銃撃たれるとかになる
        document.getElementById(number_of_sat).src = "img/blood.png"; // 殺す=血の画像に変更する.
        upgrade_kill_num();
    }
}

// 殺されたSATの断末魔
function audio_bark() {
    document.getElementById('kill_audio').currentTime = 0;
    document.getElementById('kill_audio').play();
}

// 銃声を常に出したかったが, 麻酔銃などの音が聞こえにくいので, 自殺時のみに音声出力
function audio_gun() {
    if(bullet_num > 0){
        bullet_num--;
        document.getElementById('rest_bullet').textContent = bullet_num; // 銃弾をWebページに表示
    }
    else{
        document.getElementById('no_gun_audio').currentTime = 0;
        document.getElementById('no_gun_audio').play();
    }
    document.getElementById('reload_magnum').addEventListener('click', reload_bullet, false); // 銃弾をリロード
}

// SATが麻酔銃を撃った時に出る射出音
function audio_tranquilizer_gun() {
    document.getElementById('tranquilizer_gun_audio').currentTime = 0;
    document.getElementById('tranquilizer_gun_audio').play();
}

// プレイヤーの銃弾をリロード
function reload_bullet(){ // 少し間を開けてからリロードするか迷ってる
    bullet_num = MAX_BULLET_NUM; // 1発余分にしないと, 一発少なくリロードされる
    document.getElementById('rest_bullet').textContent = bullet_num;
}

// 殺したSATの数を更新
function upgrade_kill_num() {
    kill_sat_num += 1;
    document.getElementById('kill_point').textContent = kill_sat_num;
    dead_blood();
}

// 血のような赤いフィルターをかけることで, 戦場に血が増えた雰囲気(だけ)を演出
function dead_blood(){
    blood_pool.style.visibility = "visible";
    blood_pool.style.opacity = 0.2;

    if(blood_red > 0){
        blood_red = blood_red - 9;
        blood_pool.style.backgroundColor = "rgb(255," + blood_red + "," + blood_red  + ")";
    }
    else if(blood_red >= -255 && blood_red <= 0){
        blood_red = blood_red - 9;
        blood_pool.style.backgroundColor = "rgb(" + (255+blood_red) + ", 0, 0)";
    }
    else{
        blood_pool.style.backgroundColor = "rgb(255," + blood_red + "," + blood_red  + ")";
    }
}

// IBMを出現させて, 動かして, 崩壊させる.
function move_IBM(){
    let ibm_timer_id;
    let ibm_collapse = 0 // 崩壊するまでの間隔, IBMもずっと入れるわけじゃないからね, 仕様上原作より消滅はくっそ速い

    document.getElementById('imvisible_black_matter').style.display = "inline";
    
    ibm_timer_id = setInterval(    function (){
        (document.getElementById('imvisible_black_matter')).style.left = sat_width_of_moving * Math.random();
        (document.getElementById('imvisible_black_matter')).style.top = 50 + 250 * Math.random();
        ibm_collapse++;
        if(ibm_collapse == 8){
            document.getElementById('imvisible_black_matter').classList.toggle('hide'); // 途中から姿を隠させて, 消滅してる感を演出
        }
        else if(ibm_collapse > 9){
            document.getElementById('create_ibm').style.display = "none";
            document.getElementById('imvisible_black_matter').style.display = "none";
            (document.getElementById("sat_team")).removeChild(document.getElementById('imvisible_black_matter'));
            clearInterval(ibm_timer_id); // setIntervalの中でclearする例は見つからなかったけど, 上手く動作してるから多分問題ない
            ibm_timer_id = null;
        }
    }, 900);
}

// IBMとSATの座標を取得して, それが一致すれば, IBMがSATを殺すようにする. (実際そんなことが余裕なくらい強い)
function ibm_to_sat_check(elm_ibm, elm_sat) {
    var posi_ibm = elm_ibm.getBoundingClientRect(); // IBMの座標を取得
    var posi_sat = elm_sat.getBoundingClientRect(); // SATの座標を取得
    return !(
        posi_ibm.top > posi_sat.bottom ||
        posi_ibm.right < posi_sat.left ||
        posi_ibm.bottom < posi_sat.top ||
        posi_ibm.left > posi_sat.right
    ); // 座標が一致したらIBMがSATを確殺
}

// called function

// 読み込み時にモバイル版かPC版なのかを判定, 俺個人の感想としてモバイルでやる方がダントツで簡単なので, モバイルは時間設定などを多少難しくする.
window.addEventListener('load', () => {
    Mobile_or_PC_environment();
});

// setInterval関数で一定時間おきにSATを生成
add_sat_timer = setInterval(    function (){
    if(sat_num_in_team > 0 && sat_num_in_team < MAX_SAT_NUM){ // javascript整数値の限界?
        sat_element = original_sat_element.cloneNode(true); // sat1のコピーを作成, これでonloadやonclickの関数までも複製
        sat_num_in_team++;
        sat_element.id = "sat" + String(sat_num_in_team); // idを変えることで, 関数の競合をなくす.
        sat_element.style.position = "absolute";
        document.getElementById("sat_team").appendChild(sat_element); // 画面にコピーSATを追加
        sat_element.style.display = "inline";
        sat_element.src = "img/SAT.png"; // たまにsat1が血の画像になっていることがあり, それが複製される場合があるので, SAT画像を貼り直す.
    }
    else{ // あれ? MAXこえても普通にゲーム続くんだが?
        //open_report_Twitter("Congratulations. I killed all sat member of " + String(kill_sat_num) + "." ,"http://www.ajin.net/","Ajin","anime_ajin");
        open_other_window("all member, " + kill_sat_num);
    }
}, period_sat_appearance);

// Webサイトのどこでもクリックしたら銃弾が減る
document.addEventListener('click', audio_gun, false);

// ダブルタップと2本指以上の操作におけるズーム禁止, かつ1人に対して2キルが取れる
document.addEventListener("dblclick", function(e){ e.preventDefault();}, { passive: false });

// 2本指以上の操作を禁止にしたことで, 下手したらスマホ環境くそ説ある
document.body.addEventListener('touchmove', (e) => {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
}, {passive: false});
