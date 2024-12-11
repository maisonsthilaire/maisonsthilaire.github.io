/*-----------------------------------Gestion des clics sur les éléments du menu-----------------------------------*/
function showSection(targetId) {
    // Masque toutes les sections
    document.querySelectorAll('.content section').forEach(section => {
        section.classList.add('hidden');
    });
    // Affiche la section uniquement si un ID est fourni
    if (targetId) {
        const section = document.getElementById(targetId);
        if (section) section.classList.remove('hidden');
    }
}

/*-----------------------------------Gestion des clics sur les éléments du menu-----------------------------------*/
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', event => {
        event.preventDefault(); // Empêche le comportement par défaut des liens
        const targetId = event.currentTarget.getAttribute('data-target');
        history.pushState({ targetId }, "", `#${targetId}`);// Met à jour l'URL dans l'historique sans recharger la page
        showSection(targetId);// Affiche la section correspondante
    });
});

/*-----------------------------------Gestion de l'événement "popstate" pour le bouton "Retour" du navigateur-----------------------------------*/
window.addEventListener('popstate', event => {
    const targetId = event.state ? event.state.targetId : null; // Récupère l'ID de la section à afficher depuis l'état de l'historique | "null" parce que pas de section par défaut
    showSection(targetId);// Affiche la section correspondante (ou aucune si targetId est null)
});

/*-----------------------------------Au chargement initial de la page, affiche la section correspondant au hash dans l'URL-----------------------------------*/
document.addEventListener('DOMContentLoaded', () => {
    const initialId = location.hash ? location.hash.substring(1) : null; // Aucun ID par défaut
    // Affiche uniquement si un hash est présent
    if (initialId) {
        showSection(initialId);
    }
    // Si aucun état initial n'est défini, enregistre un état vide
    if (!history.state) {
        history.replaceState({ targetId: null }, "", location.href);
    }
});



























