function searchCategories() {
    const search = document.getElementById("search").value.toLowerCase().trim();

    if (search.length > 1) {
        document.getElementById("hits").innerHTML = "";
        document.getElementById("search-results").innerHTML = "";

        fetch('category.json')
            .then(response => response.json())
            .then(data => {
                const matchingCategories = data.filter(item =>
                    item.name.toLowerCase() === search.toLowerCase() ||
                    item.name.toLowerCase().includes(search.toLowerCase())
                );

                document.getElementById("hits").innerHTML = matchingCategories.length + " Treffer";

                matchingCategories.forEach(item => {
                    document.getElementById("search-results").innerHTML += `
                    <div class="category" onclick='window.location.href="start.html?category=${item.name}"'>
                        <div class="justify-middle">
                            <img src="img/category/${item.id}.jpg" alt="Kategorie Bild" class="category-icon">
                        </div>
                        <br>
                        <div class="justify-middle text">
                            ${item.name}
                        </div>
                    </div>
                    `;
                });
            })
            .catch(error => console.error("Fehler beim Laden der JSON:", error));
    } else {
        document.getElementById("hits").innerHTML = "";
        document.getElementById("search-results").innerHTML = "";
    }
}



function LoadAll() {
    fetch('category.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                if (item.category === "popular") {
                    document.getElementById("popular").innerHTML += `
                    <div class="category" onclick='window.location.href="start.html?category=${item.name}"'>
                        <div class="justify-middle">
                            <img src="img/category/${item.id}.jpg" alt="Kategorie Bild" class="category-icon">
                        </div>
                        <br>
                        <div class="justify-middle text">
                            ${item.name}
                        </div>
                    </div>
                    `;
                } else if (item.category === "new") {
                    document.getElementById("new").innerHTML += `
                    <div class="category" onclick='window.location.href="start.html?category=${item.name}"'>
                        <div class="justify-middle">
                            <img src="img/category/${item.id}.jpg" alt="Kategorie Bild" class="category-icon">
                        </div>
                        <br>
                        <div class="justify-middle text">
                            ${item.name}
                        </div>
                    </div>
                    `;
                } else if (item.category === "other") {
                    document.getElementById("other").innerHTML += `
                    <div class="category" onclick='window.location.href="start.html?category=${item.name}"'>
                        <div class="justify-middle">
                            <img src="img/category/${item.id}.jpg" alt="Kategorie Bild" class="category-icon">
                        </div>
                        <br>
                        <div class="justify-middle text">
                            ${item.name}
                        </div>
                    </div>
                    `;
                }
            });
        })
        .catch(error => console.error("Fehler beim Laden der JSON:", error));
    LoadOwnCategories();
};


function LoadOwnCategories() {
    const savedDataContainer = document.getElementById("own");

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        if (key && key.startsWith("Category")) {
            const savedData = JSON.parse(localStorage.getItem(key));

            savedDataContainer.innerHTML += `
                    <div class="category" onclick='window.location.href="start.html?category=OWN${savedData.category}"'>
                        <div class="justify-middle">
                            <img src="${savedData.image}" alt="Kategorie Bild" class="category-icon">
                        </div>
                        <br>
                        <div class="justify-middle text">
                            ${savedData.category}
                        </div>
                        <div class="justify-middle">
                            <img src="img/edit.png" alt="Edit" class="edit-icon" onclick="Edit(event, '${savedData.category}');">
                        </div>
                    </div>`
        }
    }
}



function Edit(event, name) {
    event.stopPropagation();
    window.location.href = "edit.html?category=" + name;
}


function handleFormSubmit(event) {
    event.preventDefault();

    const fileInput = document.getElementById('file');
    const categoryInput = document.getElementById('category');

    if (fileInput.files.length === 0 || categoryInput.value.trim() === "") {
        return;
    }

    if (categoryInput.value.trim().length < 3 || categoryInput.value.trim().length > 20) {
        alert("Die Kategorie muss zwischen 3 und 20 Zeichen lang sein.");
        document.getElementById("category").value = "";
        return;
    }

    saveData(fileInput.files[0], categoryInput.value);
}


function saveData(file, category) {
    if (!Quellcode(category)) {
        const reader = new FileReader();

        reader.onloadend = function () {
            const imageData = reader.result;

            const savedData = {
                category: category,
                image: imageData
            };

            localStorage.setItem("Category:" + category, JSON.stringify(savedData));
            window.location.href = "index.html";
        };

        reader.readAsDataURL(file);
    } else {
        alert("Quellcode ist nicht erlaubt.");
        document.getElementById("category").value = "";
    }
}


document.getElementById('uploadForm').addEventListener('submit', handleFormSubmit);


function Delete() {
    const urlParams = new URLSearchParams(window.location.search);
    category = urlParams.get("category");

    if (category) {
        const key = "Category:" + category;
        localStorage.removeItem(key);
        window.location.href = "index.html";
    } else {
        console.error("Kategorie nicht gefunden.");
    }
}


function AddWord() {
    const urlParams = new URLSearchParams(window.location.search);
    category = urlParams.get("category");
    const word = document.getElementById("word").value.trim();

    if (!Quellcode(word)) {
        if (word.length > 0 && word.length < 20) {
            const key = "Category:" + category;
            const savedData = JSON.parse(localStorage.getItem(key));

            if (savedData) {
                const words = savedData.words || [];
                words.push(word);
                savedData.words = words;

                localStorage.setItem(key, JSON.stringify(savedData));
                document.getElementById("word").value = "";
                window.location.href = "edit.html?category=" + category;
            } else {
                console.error("Kategorie nicht gefunden.");
            }
        } else {
            alert("Das Wort muss zwischen 1 und 20 Zeichen lang sein.");
            document.getElementById("word").value = "";
        }
    } else {
        alert("Quellcode ist nicht erlaubt.");
        document.getElementById("word").value = "";
    }
}

function LoadWords() {
    const urlParams = new URLSearchParams(window.location.search);
    category = urlParams.get("category");

    if (category) {
        const key = "Category:" + category;
        const savedData = JSON.parse(localStorage.getItem(key));

        if (savedData) {
            const words = savedData.words || [];
            const wordListContainer = document.getElementById("all-words");
            wordListContainer.innerHTML = "";

            words.forEach((word, index) => {
                wordListContainer.innerHTML += `
                    <div class="align-middle">
                        ${word}
                        <img src="img/delete.png" class="delete-button" onclick="DeleteWord(${index})"></img>
                    </div>
                `;
            });
        } else {
            console.error("Kategorie nicht gefunden.");
        }
    }
}


function DeleteWord(index) {
    const urlParams = new URLSearchParams(window.location.search);
    category = urlParams.get("category");

    if (category) {
        const key = "Category:" + category;
        const savedData = JSON.parse(localStorage.getItem(key));

        if (savedData) {
            const words = savedData.words || [];
            words.splice(index, 1);
            savedData.words = words;

            localStorage.setItem(key, JSON.stringify(savedData));
            LoadWords();
        } else {
            console.error("Kategorie nicht gefunden.");
        }
    }
}


function Quellcode(variable) {
    return typeof variable === "string" && (variable.includes("<") || variable.includes(">"));
}