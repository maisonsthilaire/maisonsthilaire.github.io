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
    "autourDeMoi": null, // Page parent pour "Autour de moi" (aucune)
    "numeros_utiles": null,
    "infos_pratiques": null,
    "infos_arrivee": null,
    "infos_depart": null
};

// Variable globale pour suivre la section actuellement visible
let currentVisibleSection = null;







// Fonction d'animation avec promesse
function animateElement(element, startStyles, endStyles, duration = 300) {
    return new Promise(resolve => {
        // Appliquer les styles de départ
        Object.assign(element.style, startStyles);

        // Forcer le recalcul pour appliquer correctement la transition
        element.offsetHeight; // Lecture de la propriété pour forcer le reflow

        // Ajouter la transition et les styles de fin
        element.style.transition = `all ${duration}ms ease`;
        Object.assign(element.style, endStyles);

        // Attendre la fin de l'animation
        element.addEventListener('transitionend', () => {
            element.style.transition = ''; // Supprime la transition après l'animation
            resolve(); // Marque la fin de l'animation
        }, { once: true });
    });
}
async function showSection(targetId) {
    const container = document.querySelector('.container'); // Page d'accueil
    const content = document.querySelector('.content'); // Conteneur des sections
    const currentSection = document.getElementById(currentVisibleSection); // Section visible actuelle
    const newSection = document.getElementById(targetId); // Nouvelle section cible

    if (targetId && targetId !== currentVisibleSection) {
        if (currentSection && content.style.display === 'block') {
            // Pas d'animation si on est entre sections secondaires
            currentSection.style.display = 'none';
            newSection.style.display = 'block';
        } else {
            // Avec animation pour autres transitions
            if (currentSection) {
                await animateElement(currentSection, 
                    { transform: 'translateY(0)', opacity: '1' },
                    { transform: 'translateY(100%)', opacity: '0' },
                    300
                );
                currentSection.style.display = 'none';
            } else {
                await animateElement(container, 
                    { transform: 'translateY(0)', opacity: '1' },
                    { transform: 'translateY(-100%)', opacity: '0' },
                    300
                );
                container.style.display = 'none';
            }
    
            content.style.display = 'block';
            if (newSection) {
                newSection.style.display = 'block';
                await animateElement(newSection, 
                    { transform: 'translateY(100%)', opacity: '0' },
                    { transform: 'translateY(0)', opacity: '1' },
                    300
                );
            }
        }
        currentVisibleSection = targetId;
    } else {
        // Quand on revient à la page d'accueil
        if (currentSection) {
            await animateElement(currentSection, 
                { transform: 'translateY(0)', opacity: '1' },
                { transform: 'translateY(100%)', opacity: '0' },
                300
            );
            currentSection.style.display = 'none'; // Masquer la section actuelle
        }

        content.style.display = 'none'; // Masquer tout le conteneur des sections
        container.style.display = 'flex'; // Réafficher la page d'accueil
        await animateElement(container, 
            { transform: 'translateY(-100%)', opacity: '0' },
            { transform: 'translateY(0)', opacity: '1' },
            300
        );
        currentVisibleSection = null;
    }
}









// Gestion des clics sur les éléments du menu
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', event => {
        event.preventDefault(); // Empêche le comportement par défaut
        const targetId = event.currentTarget.getAttribute('data-target');
        if (targetId) {
            showSection(targetId); // Affiche la section correspondante
        }
    });
});

// Gestion du clic sur le bouton "Retour"
document.getElementById('back-button').addEventListener('click', () => {
    if (currentVisibleSection) {
        const parentId = hierarchy[currentVisibleSection]; // Trouve la page parent
        if (parentId) {
            showSection(parentId); // Navigue vers la page parent
        } else {
            showSection(null); // Retourne à l'accueil
        }
    }
});

// Affichage initial basé sur le hash dans l'URL
document.addEventListener('DOMContentLoaded', () => {
    const initialId = location.hash ? location.hash.substring(1) : null;
    if (initialId) {
        showSection(initialId); // Affiche la section correspondant au hash
    } else {
        showSection(null); // Par défaut, aucune section affichée (ou accueil)
    }
});

























