document.addEventListener("DOMContentLoaded", loadLinks);
// Snabblänkar-------------------------
        function openModal() {
            document.getElementById("link-modal").style.display = "flex";
        }
        
        function closeModal() {
            document.getElementById("link-modal").style.display = "none";
        }

        function loadLinks() {
            const linksList = document.getElementById("links-list");
            linksList.innerHTML = "";
            const savedLinks = JSON.parse(localStorage.getItem("links")) || [];
            savedLinks.forEach(({ title, url }) => addLinkToDOM(title, url));
        }

        function addLink() {
            const title = document.getElementById("link-title").value;
            const url = document.getElementById("link-url").value;
            if (!title || !url) return alert("Du måste fylla i länk och url!");

            addLinkToDOM(title, url);
            saveLink(title, url);
            document.getElementById("link-title").value = "";
            document.getElementById("link-url").value = "";
            closeModal();
        }

        function addLinkToDOM(title, url) {
            const linksList = document.getElementById("links-list");
        
            const div = document.createElement("div");
            div.classList.add("link");
        
            const li = document.createElement("li");
            li.classList.add("link-item");
        
            li.innerHTML = `
                <a href="${url}" target="_blank">${title}</a>
                <span class="material-icons-outlined remove-icon" onclick="removeLink(this, '${title}')">
                    remove_circle_outline
                </span>
            `;
        
            div.appendChild(li);
            linksList.appendChild(div);
        }
        

        function saveLink(title, url) {
            const savedLinks = JSON.parse(localStorage.getItem("links")) || [];
            savedLinks.push({ title, url });
            localStorage.setItem("links", JSON.stringify(savedLinks));
        }

        function removeLink(button, title) {
            const linkDiv = button.closest(".link");
            if (linkDiv) {
                linkDiv.remove(); // Tar bort hela div-linken
            }
        
            // Uppdatera localStorage
            let savedLinks = JSON.parse(localStorage.getItem("links")) || [];
            savedLinks = savedLinks.filter(link => link.title !== title);
            localStorage.setItem("links", JSON.stringify(savedLinks));
        }
        

// API väder-prognos OpenWeather-----------------------------
document.addEventListener('DOMContentLoaded', () => {
    console.log("Hämtar väderdata...");
    getWeather();
});

function getWeather() {
    // Kontrollera om geolocation stöds
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
        alert("Geolocation stöds inte av din webbläsare.");
    }
}

function successCallback(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // Hämta väderdata från OpenWeatherMap
    const apiKey = "97f5b86b80214d978d0b06b64a3db01a";
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&lang=sv&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => updateWeather(data))
        .catch(error => console.error("Fel vid hämtning av väderdata:", error));
}

function errorCallback(error) {
    alert("Kunde inte hämta din plats: " + error.message);
}

function updateWeather(data) {
    const weatherCard = document.querySelector('.card:nth-child(2)'); // Väderkortet
    const days = weatherCard.querySelectorAll('.day');

    // Uppdatera vädret för de första tre dagarna
    const weatherData = [
        { day: "Idag", index: 0 },
        { day: "Imorgon", index: 8 },
        { day: "Övermorgon", index: 16 }
    ];
    weatherData.forEach((info, idx) => {
        const temp = Math.round(data.list[info.index].main.temp);
        const description = data.list[info.index].weather[0].description;
        const icon = data.list[info.index].weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

        days[idx].innerHTML = `
            <h4>${info.day}</h4>
            <img src="${iconUrl}" alt="${description}" style="width:50px;">
            <p>${temp}°C</p>
            <p>${description}</p>
        `;
    });
}

// Senaste nyheter API ----------------------------------
document.addEventListener("DOMContentLoaded", getNews);

// hämtar senaste sport nyheterna
function getNews() {
    const apiKey = "660e178fc39a4c3895beebf994551808";
    const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&category=sports&apiKey=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => updateNews(data.articles))
        .catch(error => console.error("Fel vid hämtning av nyheter:", error));
}

// uppdaterar listan på sidan
function updateNews(articles) {
    const newsList = document.getElementById("news-list");
    newsList.innerHTML = ""; // Rensa listan innan ny data läggs till

    articles.slice(0, 3).forEach(article => {
        const newsItem = document.createElement("div");
        newsItem.classList.add("news-item");

        newsItem.innerHTML = `
            <div class="news-content">
                <h4><a href="${article.url}" target="_blank">${article.title}</a></h4>
                <p>${article.source.name}</p>
            </div>`;
            
        newsList.appendChild(newsItem);
    });
}

// Anteckningar --------------------------------
function saveNotes() {
    const notes = document.getElementById("notes").value;
    localStorage.setItem("notes", notes);
}

// Funktion för att läsa anteckningarna från localStorage när sidan laddas
function loadNotes() {
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
        document.getElementById("notes").value = savedNotes;
    }
}

// Ladda anteckningarna när sidan laddas
window.onload = function() {
    loadNotes();
};

// Klockan --------------------------------------

// Funktion för att uppdatera klocka och datum varje sekund
function updateDateTime() {
    const timeElement = document.getElementById('time');
    const dateElement = document.getElementById('date');

    const now = new Date();

    let hours = now.getHours();
    let minutes = now.getMinutes();

    // Om minuter är mindre än 10, lägg till en ledande nolla
    minutes = minutes < 10 ? '0' + minutes : minutes;
    
    timeElement.textContent = hours + ':' + minutes;

    // Hämta och formatera dagens datum
    const options = {year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = now.toLocaleDateString('sv-SE', options); // Svenska formatet

    // Uppdatera datumet på sidan
    dateElement.textContent = formattedDate;
}

// Uppdatera datum och klocka varje sekund
setInterval(updateDateTime, 1000);

// Kör en första gång för att sätta initialt värde när sidan laddas
updateDateTime();

// Ändra rubriken-------------------------------
document.getElementById('header').addEventListener('click', function() {
    const headerElement = this;
    headerElement.contentEditable = true;
    headerElement.focus();
});

// Funktion för att spara rubriken i localStorage när användaren slutar redigera
document.getElementById('header').addEventListener('blur', function() {
    const headerElement = this;
    const newHeaderText = headerElement.textContent.trim();

    // Spara rubrikens text i localStorage
    localStorage.setItem('headerText', newHeaderText);

    // Ta bort redigerbar status från rubriken
    headerElement.contentEditable = false;
});

// Funktion för att läsa och sätta den sparade rubriken från localStorage när sidan laddas
window.onload = function() {
    const savedHeaderText = localStorage.getItem('headerText');
    if (savedHeaderText) {
        document.getElementById('header').textContent = savedHeaderText;
    }
};


// Byta bakgrundsbild ------------------------------

const randomBackgroundButton = document.getElementById('random-background-button');
const dashboard = document.querySelector('.dashboard');

// Funktion för att ställa in bakgrundsbilden
function setBackground(imageUrl) {
    document.body.style.backgroundImage = `url(${imageUrl})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.height = '100vh';
}

// Kolla om det finns en sparad bakgrund i localStorage
const savedImageUrl = localStorage.getItem('backgroundImage');
if (savedImageUrl) {
    setBackground(savedImageUrl);
}

randomBackgroundButton.addEventListener('click', async () => {
    try {
        const response = await fetch('https://api.unsplash.com/photos/random?client_id=KXJfBM51DV0eOeJeRocGzpVHaE-emTD-Q1Jn48Oe7V0');
        if (!response.ok) {
            throw new Error('Kunde inte hämta en bild från Unsplash');
        }
        const data = await response.json();
        const imageUrl = data.urls.full;

        if (imageUrl) {
            setBackground(imageUrl);  // Uppdatera bakgrunden
            localStorage.setItem('backgroundImage', imageUrl);  // Spara URL i localStorage
        } else {
            console.error('Bild-URL saknas i svaret från Unsplash API.');
        }
    } catch (error) {
        console.error('Fel vid hämtning av bakgrundsbild:', error);
    }
});








