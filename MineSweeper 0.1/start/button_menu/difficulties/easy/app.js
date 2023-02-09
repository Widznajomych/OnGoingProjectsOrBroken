var mapa = [];
var wiersze = 7;
var kolumny = 7;
var miny = 5;
var miny_localizacja = [];
var klikniete_plytki = 0;
var wlaczone_flagi = false;
var porazka = false;

window.onload = function () {
    startGry();
};

function polozenie_min() {
    miny_localizacja.push("1-1");
    miny_localizacja.push("0-6");
    miny_localizacja.push("5-5");
    miny_localizacja.push("2-3");
    miny_localizacja.push("1-5");
}

function startGry() {
    document.getElementById('ilosc_min').innerText = miny;
    document.getElementById('flagi').addEventListener ("click", wlacz_flage);
    polozenie_min();

    for (let w = 0; w < wiersze; w++) {
        let wiersz = [];
        for (let k = 0; k < kolumny; k++) {
            let plytka = document.createElement('div');
            plytka.id = w.toString() + "-" + k.toString();
            plytka.addEventListener('click', kliknieta_plytka_animacja);

            document.getElementById("mapa").append(plytka);
            wiersz.push(plytka);
        }
        mapa.push(wiersz);
    }
}

function kliknieta_plytka_animacja() {
    let plytka = this;
    if (wlaczone_flagi) {
        if (plytka.innerText === "") {
            plytka.innerText = "🚩";
            plytka.style.backgroundColor = 'rgb(177, 192, 123)';
        }
        else if (plytka.innerText === "🚩") {
            plytka.innerText = "";
            plytka.style.backgroundColor = 'rgb(51, 51, 51)';
        }
        return;
    }

    if (miny_localizacja.includes(plytka.id)) {
        alert('Wtedy nałączyłeś na mine - Koniec Gry');
        pokaz_miny();
        porazka = true;
        return;
    }
    let lokalizacja = plytka.id.split('-');
    let w = parseInt(lokalizacja[0]);
    let k = parseInt(lokalizacja[1]);
    sprawdz_mine(w, k);
}

function wlacz_flage() {
    if (wlaczone_flagi) {
        wlaczone_flagi = false;
        document.getElementById('flagi').style.backgroundColor = "crimson";
    }
    else {
        wlaczone_flagi = true
        document.getElementById('flagi').style.backgroundColor = "green";
    }
}

function pokaz_miny() {
    for (let w = 0; w < wiersze; w++) {
        for (let k = 0; k < kolumny; k++) {
            let plytka = mapa[w][k];
            if (miny_localizacja.includes(plytka.id)) {
                plytka.innerText = '💣';
                plytka.style.backgroundColor = 'crimson';
            }
        }
    }
}

function sprawdz_mine(w, k) {
    if(w < 0 || w >= wiersze || k < 0 || k >= kolumny) {
        return;
    }
    if (mapa[w][k].classList.contains('kliknieta_plytka')) {
        return;
    }

    mapa[w][k].classList.add('kliknieta_plytka');

    let znalezione_miny = 0;
    // GÓRNE PŁYTKI
    znalezione_miny += sprawdz_plytke (w - 1, k - 1); // Lewa
    znalezione_miny += sprawdz_plytke (w - 1, k); // Środkowa
    znalezione_miny += sprawdz_plytke (w - 1, k + 1); // Prawa
    //DOLNE PŁYTKI
    znalezione_miny += sprawdz_plytke (w + 1, k - 1); // Lewa
    znalezione_miny += sprawdz_plytke (w + 1, k); // Środkowa
    znalezione_miny += sprawdz_plytke (w + 1, k + 1); // Prawa
    // BOCZNE PŁYTKI
    znalezione_miny += sprawdz_plytke (w, k - 1); // Lewa
    znalezione_miny += sprawdz_plytke (w, k + 1); // Prawa

    function sprawdz_plytke(w, k) {
        if(w < 0 || w >= wiersze || k < 0 || k >= kolumny) {
            return;
        }
        
        let znalezione_miny = 0;
        if (miny_localizacja.includes(w.toString() + '-' + k.toString())) {
            mapa[w][k].innerText = 'X';
            return;
        }
        
        // GÓRNE PŁYTKI
        znalezione_miny += sprawdz_mine (w - 1, k - 1); // Lewa
        znalezione_miny += sprawdz_mine (w - 1, k); // Środkowa
        znalezione_miny += sprawdz_mine (w - 1, k + 1); // Prawa
        //DOLNE PŁYTKI
        znalezione_miny += sprawdz_mine (w + 1, k - 1); // Lewa
        znalezione_miny += sprawdz_mine (w + 1, k); // Środkowa
        znalezione_miny += sprawdz_mine (w + 1, k + 1); // Prawa
        // BOCZNE PŁYTKI
        znalezione_miny += sprawdz_mine (w, k - 1); // Lewa
        znalezione_miny += sprawdz_mine (w, k + 1); // Prawa
    
        mapa[w][k].innerText = znalezione_miny;
        mapa[w][k].classList.add('x' + znalezione_miny.toString());
    }