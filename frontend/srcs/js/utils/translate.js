    
export async function loadTranslation(key) {
    const response = await fetch(`translation/?key=${key}`,{
      method: 'GET',
    });
    const translations = await response.json();
    console.log(translations.key);
    return translations.key;
}

export function translate(elementId, translationKey) {
    loadTranslation(translationKey).then(translatedText => {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = translatedText;
        }
    });
}


