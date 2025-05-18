let category;
let timeGame;
let words = [];
let right;
let wrong;
let isTiled = true;
let gamma;

function GetCategory() {
    const urlParams = new URLSearchParams(window.location.search);
    category = urlParams.get("category");

    document.title = category + " | Stirnraten";
    let time = 6;

    let timer = setInterval(function () {
        if (time < 0) {
            clearInterval(timer);
            FirstWord();
        } else {
            PlaySound("click");
            document.getElementById("content").innerHTML = time;
            time--;
        }
    }, 1000);
}

function PlaySound(name) {
    const audio = new Audio('sounds/' + name + '.wav');
    audio.play();
}

function StartTime() {
    timeGame = 60;

    let timer = setInterval(function () {
        if (timeGame < 0) {
            clearInterval(timer);
            document.getElementById("content").innerHTML = "Ende";
            PlaySound("stop");
            ShowResult();
        } else {
            timeGame--;
        }
    }, 1000);
}


function FirstWord() {
        StartTime();
        right = 0;
        wrong = 0;

    if (!category.startsWith("OWN")) {
        fetch('category.json')
            .then(response => response.json())
            .then(data => {
                const match = data.find(item => item.name.toLowerCase() === category.toLowerCase());

                if (match) {
                    words = match.words;
                    NextWord();
                } else {
                    console.log("Keine Kategorie gefunden mit dem Namen:", category);
                }
            })
            .catch(error => console.error("Fehler beim Laden der JSON:", error));
    } else {
        const ownCategory = category.replace("OWN", "");
        const savedData = JSON.parse(localStorage.getItem("Category:" + ownCategory));

        if (savedData && savedData.words.length >= 5) {
            words = savedData.words;
            NextWord();
        } else {
            alert("Die Kategorie " + ownCategory + " existiert nicht oder hat nicht genügend Wörter.");
            window.location.href = "index.html";
        }
    }
}


function NextWord() {
    if (words.length === 0) {
        timeGame = 2;
    } else {
        let randomIndex = Math.floor(Math.random() * words.length);
        let word = words[randomIndex];
        words.splice(randomIndex, 1);
        document.getElementById("content").innerHTML = word;
        isTiled = false;
    }
}


function Right() {
    PlaySound("true");
    right++;
    NextWord();
}

function Wrong() {
    PlaySound("false");
    wrong++;
    NextWord();
}


if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission().then(response => {
        if (response === 'granted') {
            window.addEventListener('deviceorientation', handler);
        }
    });
}

window.addEventListener('deviceorientation', function (event) {
    gamma = event.gamma;
});


setInterval(function () {
    if (gamma < -60 && gamma > -70 && timeGame > 1 && isTiled === false) {
        isTiled = true;
        Right();
    } else if (gamma > 60 && gamma < 70 && timeGame > 1 && isTiled === false) {
        isTiled = true;
        Wrong();
    }
}, 300);


let keysPressed = {
    ArrowUp: false,
    ArrowDown: false
};

document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        keysPressed[event.key] = true;
    }
});

document.addEventListener('keyup', function (event) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        keysPressed[event.key] = false;
    }
});


setInterval(function () {
    if (keysPressed.ArrowUp && isTiled === false && timeGame > 1) {
        isTiled = true;
        Right();
    }
    if (keysPressed.ArrowDown && isTiled === false && timeGame > 1) {
        isTiled = true;
        Wrong();
    }
}, 100);


function ShowResult() {
    document.getElementById("content").innerHTML += `<br><br><div class="text">Richtig: ${right}<br>Übersprungen: ${wrong}</div>`;

    setTimeout(function () {
        window.location.href = "index.html";
    }, 6000);
}