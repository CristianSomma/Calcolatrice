let displayedValue;

document.addEventListener('DOMContentLoaded', () => {
    // Valore già inserito
    displayedValue = document.getElementById('value-displayer').value;
})

function show(btnClicked) {
    // Valore da mostrare
    let valueToDisplay = '';
    // Indice dell'ultimo carattere inserito
    const lastChar = displayedValue.length-1;
    // Array contenente gli elementi da controllare
    const symbolsArray = ['×', '÷', '−', '+', '%'];

    // Se il carattere da inserire appartiene ad un array ma è preceduto da un altro simbolo non viene inserito
    if (symbolsArray.includes(displayedValue[lastChar]) && symbolsArray.includes(btnClicked.innerText)) {
        valueToDisplay += ''
    } else {
        valueToDisplay += btnClicked.innerText;    
    }

    // Viene mostrato il valore inserito
    document.getElementById('value-displayer').value += valueToDisplay;

    // Viene aggiornata la variabile per comprendere quello che è stato appena aggiunto
    displayedValue = document.getElementById('value-displayer').value
}

function brackets() {
    // Contatore delle parentesi aperte
    let openBracketsCounter = 0;
    // Contatore delle parentesi chiuse
    let closedBracketsCounter = 0;
    
    // Controlla ogni carattere, se è una parentesi aperta incrementa di uno il contatore relativo e viceversa per parentesi chiuse
    for(let char of displayedValue){
        if(char === '('){
            openBracketsCounter++;
        }else if(char === ')'){
            closedBracketsCounter++;
        }
    }

    //Se il numero di parentesi aperte e chiuse è uguale allora la parentesi inserita sarà aperta
    if (openBracketsCounter === closedBracketsCounter){
        document.getElementById('value-displayer').value+='(';
    }else{
        document.getElementById('value-displayer').value+=')';
    }

    // Sincronizzazione
    displayedValue = document.getElementById('value-displayer').value;
}

function result() {
    // Prende come valore finale per eseguire l'operazione il valore all'interno del display
    displayedValue = document.getElementById('value-displayer').value;

    // Elemento della lista Cronologia creato
    let historyElement = document.createElement('li');
    // Viene aggiunta una classe per gli stili all'elemento della lista
    historyElement.classList.add('list-item-operation');
    // Elemento bottone creato
    let historyBtn = document.createElement('button');
    // Viene aggiunta una funzione da eseguire quando il bottone creato è premuto
    historyBtn.onclick = () => { showHistory(historyBtn) }
    // Viene aggiunta uno stile al bottone
    historyBtn.classList.add('operation');
    // Viene inserito come testo del bottone l'operazione appena eseguita
    historyBtn.innerHTML = displayedValue;
    // Il bottone viene inserito nell'elemento della lista
    historyElement.appendChild(historyBtn);
    // L'elemento della lista viene inserito nella lista
    document.getElementById('history-list').appendChild(historyElement)

    // Creo una stringa in cui i valori non valutabili sono sostituiti con gli operatori originali
    let evaluatableText = displayedValue
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-');
    
    // Valuta in codice una stringa, così che le operazioni vengano eseguite
    let resultingValue = eval(evaluatableText);
    // Il risultato è stampato nel displayer
    document.getElementById('value-displayer').value = resultingValue;
    // Sincronizzazione
    displayedValue = document.getElementById('value-displayer').value;
}

function showHistory(btnClicked){
    document.getElementById('value-displayer').value = btnClicked.innerText;
    displayedValue = document.getElementById('value-displayer').value;
}

function reset() {
    // Svuota il displayer
    document.getElementById('value-displayer').value = '';
    // Sincronizzazione del valore mostrato e del valore interno
    displayedValue = document.getElementById('value-displayer').value
}
