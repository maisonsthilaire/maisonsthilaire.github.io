// Définir la relation parent-enfant basée sur la hiérarchie
const hierarchy = {
    "metro": "transports",
    "bus": "transports",
    "taxis": "transports",
    "aeroports": "transports",
    "trains": "transports",
    "transports": "autourDeMoi",
    "activitésPourLesEnfants": "activites",
    "karting": "activites",
    "equitation": "activites",
    "activitesEnPleineNature": "activites",
    "golf": "activites",
    "activitesNautiques": "activites",
    "cinemas": "activites",
    "activites": "autourDeMoi",
    "superettes": "alimentation",
    "supermarches": "alimentation",
    "boulangeries": "alimentation",
    "fromages": "alimentation",
    "spiritueux": "alimentation",
    "bouchers": "alimentation",
    "alimentation": "autourDeMoi",
    "nosAdresses": "shopping",
    "centresCommerciaux": "shopping",
    "shopping": "autourDeMoi",
    "restaurants": "restauration",
    "cafes": "restauration",
    "pizzeria": "restauration",
    "restaurationRapide": "restauration",
    "brunch": "restauration",
    "restauration": "autourDeMoi",
    "bars": "sortir",
    "discotheques": "sortir",
    "sortir": "autourDeMoi",
    "pharmacies": "sante",
    "hopitaux": "sante",
    "veterinaires": "sante",
    "dentistes": "sante",
    "cabinet_medical": "sante",
    "sante": "autourDeMoi",
    "autourDeMoi": null,
    "numeros_utiles": null,
    "infos_pratiques": null,
    "infos_arrivee": null,
    "infos_depart": null
};

// Variable globale pour suivre la section actuellement visible
let currentVisibleSection = null;

function animateElement(element, startStyles, endStyles, duration = 300) { // Fonction d'animation avec promesse
    return new Promise(resolve => {
        Object.assign(element.style, startStyles); // Appliquer les styles de départ
        element.offsetHeight; // Forcer le recalcul de la propriété pour appliquer correctement la transition
        // Ajouter la transition et les styles de fin
        element.style.transition = `all ${duration}ms ease`;
        Object.assign(element.style, endStyles);
        element.addEventListener('transitionend', () => { // Attendre la fin de l'animation
            element.style.transition = ''; // Supprime la transition après l'animation
            element.style.transform = '';
            element.style.opacity = '';
            resolve(); // Marque la fin de l'animation
        }, { once: true });
    });
}

async function showSection(targetId) { // Fonction pour afficher une section
    const container = document.querySelector('.container'); // Page d'accueil
    const content = document.querySelector('.content'); // Conteneur des sections
    const currentSection = document.getElementById(currentVisibleSection); // Section visible actuelle
    const newSection = document.getElementById(targetId); // Nouvelle section cible

    document.body.classList.add('no-scroll');

    if (targetId && targetId !== currentVisibleSection) {
        // Mettre à jour l'icône et le texte du header
        updateHeader(targetId);
        if (content.style.display === 'block') {
            // Pas d'animation si on est entre sections secondaires
            currentSection.style.display = 'none';
            newSection.style.display = 'block';
        } else {
            // Avec animation pour autres transitions
            await animateElement(container, 
                { transform: 'translateY(0)', opacity: '1' },
                { transform: 'translateY(-100%)', opacity: '0' },
                300
            );
            container.style.display = 'none';
            newSection.style.display = 'block';
            content.style.display = 'block';
            await animateElement(content, 
                { transform: 'translateY(100%)', opacity: '0' },
                { transform: 'translateY(0)', opacity: '1' },
                300
            );
        }
        currentVisibleSection = targetId;
    } else {// Quand on revient à la page d'accueil
        // Anime la div `content` pour la masquer
        await animateElement(content, 
            { transform: 'translateY(0)', opacity: '1' }, // Styles initiaux
            { transform: 'translateY(100%)', opacity: '0' }, // Styles finaux
            300
        );
        content.style.display = 'none'; // Masquer tout le conteneur des sections
        currentSection.style.display = 'none'; // Masque la section actuelle au besoin
        container.style.display = 'flex'; // Réafficher la page d'accueil
        await animateElement(container, 
            { transform: 'translateY(-100%)', opacity: '0' },
            { transform: 'translateY(0)', opacity: '1' },
            300
        );
        currentVisibleSection = null;
    }
    setTimeout(() => {
        document.body.classList.remove('no-scroll');
    }, 300)
}

document.querySelectorAll('.menu-item').forEach(item => { // Gestion des clics sur les éléments du menu
    item.addEventListener('click', event => {
        event.preventDefault(); // Empêche le comportement par défaut
        const targetId = event.currentTarget.getAttribute('data-target');
        if (targetId) {
            showSection(targetId); // Affiche la section correspondante
        }
    });
});

document.getElementById('back-button').addEventListener('click', () => { // Gestion du clic sur le bouton "Retour"
    if (currentVisibleSection) {
        const parentId = hierarchy[currentVisibleSection]; // Trouve la page parent
        if (parentId) {
            showSection(parentId); // Navigue vers la page parent
        } else {
            showSection(null); // Retourne à l'accueil
        }
    }
});

document.addEventListener('DOMContentLoaded', () => { // Affichage initial basé sur le hash dans l'URL
    const initialId = location.hash ? location.hash.substring(1) : null;
    if (initialId) {
        showSection(initialId); // Affiche la section correspondant au hash
    } else {
        showSection(null); // Par défaut, aucune section affichée (ou accueil)
    }
});


let translations = {};
let currentLanguage = "fr"; // Langue par défaut

// Fonction pour charger les traductions depuis le fichier JSON
async function loadTranslations() {
  try {
    const response = await fetch('translations.json');
    translations = await response.json();
    applyTranslations(); // Applique les traductions par défaut
  } catch (error) {
    console.error("Erreur lors du chargement des traductions :", error);
  }
}

// Fonction pour appliquer les traductions à la page
function applyTranslations() {
    document.querySelectorAll('[data-translate]').forEach(el => {
      const key = el.getAttribute('data-translate'); // Récupère la clé
      const keys = key.split('.'); // Découpe les clés imbriquées (ex. : "wifi.title")
      let translation = translations[currentLanguage];
  
      // Navigue dans l'objet JSON pour trouver la traduction
      keys.forEach(k => {
        if (translation) {
          translation = translation[k];
        }
      });
  
      // Applique la traduction si elle existe
      if (translation) {
        el.innerHTML = translation;
      }
    });
  }

// Gestion du changement de langue
document.getElementById('language-selector').addEventListener('change', event => {
  currentLanguage = event.target.value;
  applyTranslations();
});

// Charger les traductions au démarrage
document.addEventListener('DOMContentLoaded', () => {
  loadTranslations();
});



const sectionParents = {// Sert a ne pas charger pour rien l'image en haut a chaque affichage de section
    "wifi": "wifi",
    "digicode": "digicode",
    "autourDeMoi": "autourDeMoi",
    "transports": "autourDeMoi",
    "metro": "autourDeMoi",
    "bus": "autourDeMoi",
    "taxis": "autourDeMoi",
    "aeroports": "autourDeMoi",
    "trains": "autourDeMoi",
    "activites": "autourDeMoi",
    "numeros_utiles": "numeros_utiles",
    "infos_pratiques": "infos_pratiques",
    "infos_arrivee": "infos_arrivee",
    "infos_depart": "infos_depart"
};
// Contenu des icônes et textes pour chaque catégorie principale
const headerContent = {
    "wifi": { icon: "imagesEtVideos/wifi-icon.svg", text: "WiFi" },
    "digicode": { icon: "imagesEtVideos/digicode-icon.svg", text: "Digicode" },
    "autourDeMoi": { icon: "imagesEtVideos/autourDeMoi-icon.svg", text: "Autour de Moi" },
    "numeros_utiles": { icon: "imagesEtVideos/numeros_utiles-icon.svg", text: "Numéros Utiles" },
    "infos_pratiques": { icon: "imagesEtVideos/infos_pratiques-icon.png.svg", text: "Infos Pratiques" },
    "infos_arrivee": { icon: "imagesEtVideos/infos_arrivee-icon.svg", text: "Infos Arrivée" },
    "infos_depart": { icon: "imagesEtVideos/infos_depart-icon.svg", text: "Infos Départ" }
};
let currentHeaderCategory = null; // Stocke la dernière catégorie affichée

function updateHeader(sectionId) {
    const headerIcon = document.querySelector(".header-logo");
    const headerText = document.querySelector(".header-text");

    // Déterminer la catégorie principale de la section actuelle
    const parentCategory = sectionParents[sectionId] || sectionId;

    // Vérifier si la catégorie affichée est déjà correcte
    if (parentCategory === currentHeaderCategory) {
        //console.log("c'est une sous page ou on réaffiche la même page depuis l'accueil");
        return; // Rien ne change, on évite de recharger l'image
    }

    // Mise à jour uniquement si nécessaire
    if (headerContent[parentCategory]) {
        headerIcon.src = headerContent[parentCategory].icon;
        headerIcon.alt = headerContent[parentCategory].text;
        headerText.textContent = headerContent[parentCategory].text;

        // Met à jour la catégorie affichée pour éviter de recharger inutilement
        currentHeaderCategory = parentCategory;
        //console.log("c'est un chagement de catégorie, on change l'image");
    }
}


function copyToClipboard() {
    const wifiKey = "Londresuk"; // Récupère la clé WiFi
    const button = document.querySelector(".copy-btn"); // Sélectionne le bouton

    // Copier le texte dans le presse-papiers
    navigator.clipboard.writeText(wifiKey).then(() => {
        // Modifier le bouton après la copie
        button.textContent = "Code copié";
        button.style.backgroundColor = "#007BFF"; // Bleu

        // Réinitialiser après 2 secondes
        setTimeout(() => {
            button.textContent = "Copier";
            button.style.backgroundColor = "#ff4d4d"; // Rouge
        }, 3000);
    }).catch(err => {
        console.error("Erreur lors de la copie :", err);
    });
}

